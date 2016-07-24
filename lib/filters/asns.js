"use strict";

const ip2asn = require('iptoasn')("./iptoasn-cache");
const checkFreshness = () => {
  ip2asn.lastUpdated(function(t) {
    if (t > 1) {
      ip2asn.update(null, () => {
        ip2asn.load(() => {});
      });
    } else {
      ip2asn.load(() => {});
    }
  });
}

checkFreshness();
setInterval(checkFreshness, 1000*60*60);

const evilASNs = [];

module.exports = (ip) => {
  return new Promise((resolve) => {
    let asn = ip2asn.lookup(ip);
    if(!asn) asn = undefined;
    resolve({
      deny: asn && evilASNs.indexOf(asn.asn) != -1,
      asn: asn
    });
  });
};

module.exports.feed = (evil) => {
  if(evil.asn) {
    if(evilASNs.indexOf(evil.asn) == -1)
      evilASNs.push(evil.asn.toString());
  }
};
