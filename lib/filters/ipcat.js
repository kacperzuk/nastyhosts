const IPcheck = require("ipcheck");
const https = require("https");
const byline = require("byline");

const ipToLong = function(ip) {
  return ip.split(".").reduce((iplong, octet) => {
    iplong <<= 8;
    iplong += parseInt(octet);
    return iplong;
  }, 0) >>> 0;
};

let evilNetworks = [];
let evilNetworksTmp = [];

module.exports = (ip) => {
  if(ip.indexOf(":") > -1)
    return Promise.resolve({deny:false});

  let iplong = ipToLong(ip);
  return Promise.resolve({
      deny: evilNetworks.some((v) => {
        return iplong >= v[0] &&
               iplong <= v[1];
      })
  });
};

module.exports.feed = () => {};

const parseLine = (data) => {
  console.log(data.toString());
  const fields = data.toString().split(",");
  evilNetworksTmp.push([ipToLong(fields[0]), ipToLong(fields[1])]);
};

const fetchNew = () => {
  evilNetworksTmp = [];
  https.get("https://raw.githubusercontent.com/client9/ipcat/master/datacenters.csv", (res) => {
    let stream = byline(res);
    stream.on('data', parseLine);
    stream.on('end', () => {
      evilNetworks = evilNetworksTmp;
    });
  });
  setTimeout(fetchNew, 1000*3600*24);
};

fetchNew();
