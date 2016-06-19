"use strict";

const ip2country = require('fast-iptocountry')("./ip2country-cache");

const checkFreshness = () => {
  ip2country.lastUpdated(function(err, t) {
      if (err) {
          console.error(err);
      } else {
          if (t > 1) {
            ip2country.load({ update: true });
          } else {
            ip2country.load({});
          }
      }
  });
}

ip2country.on('cache_locked', () => {
  ip2country.load({});
});

checkFreshness();
setInterval(checkFreshness, 1000*60*60);

module.exports = (ip) => {
  return new Promise((resolve) => {
    let country = ip2country.lookup(ip);
    if(!country) country = undefined;
    resolve({
      deny: false,
      country
    });
  });
};

module.exports.feed = () => {};
