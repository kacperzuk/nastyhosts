const evilNetworks = require("../../evil-networks.json");
const evilHosts = require("../../evil-hosts.json");

module.exports = function(feed) {
  evilNetworks.forEach(function(v) {
    feed({ network: v });
  });
  evilHosts.forEach(function(v) {
    feed({ hostname: v });
  });
};
