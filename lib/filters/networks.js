const IPcheck = require("ipcheck");

const evilNetworks = [];

module.exports = (ip) => {
  return new Promise((resolve) => {
    ip = new IPcheck(ip);
    resolve({
      deny: evilNetworks.some((network) => {
        return ip.match(network);
      })
    });
  });
};

module.exports.feed = (evil) => {
  if(evil.network) {
    const n = new IPcheck(evil.network);
    if(n.valid) {
      evilNetworks.push(n);
    }
  }
};
