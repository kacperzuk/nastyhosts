const dns = require("dns");

const evilHostnames = [];

module.exports = function(ip) {
  return new Promise(function(resolve) {
    const timeout = setTimeout(function() {
      resolve({ deny: false, hostnames: [] });
      resolve = null;
    }, 500);
    dns.reverse(ip, function(err, hostnames) {
      if(!resolve) {
        return;
      }
      clearTimeout(timeout);
      if(err) {
        hostnames = [];
      }
      const deny = hostnames.some(function(name) {
        return evilHostnames.some(function(regex) {
          return regex.test(name);
        });
      });
      resolve({
        deny,
        hostnames
      });
    });
  });
};

module.exports.feed = function(evil) {
  if(evil.hostname) {
    evilHostnames.push(new RegExp(evil.hostname, "i"));
  }
};
