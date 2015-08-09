const IPcheck = require("ipcheck");

const evilNetworks = [];

module.exports = function(ip) {
  return new Promise(function(resolve) {
    ip = new IPcheck(ip);
    resolve({
      deny: evilNetworks.some(function(network) {
        return ip.match(network);
      })
    });
  });
};

module.exports.feed = function(evil) {
  if(evil.network) {
    const n = new IPcheck(evil.network);
    if(n.valid) {
      evilNetworks.push(n);
    }
  }
};
