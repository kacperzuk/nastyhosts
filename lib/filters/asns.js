"use strict";

const ip2asn = require('ip2asn')();
const checkFreshness = () => {
  ip2asn.lastUpdated(function(err, t) {
      if (err) {
          console.error(err);
      } else {
          if (t > 1) {
            ip2asn.load({ update: true });
          } else {
            ip2asn.load({});
          }
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