const request = require("request");

function grab(feed) {
  request("https://ip-ranges.amazonaws.com/ip-ranges.json", function(error, response, body) {
    if(!error && response.statusCode === 200) {
      JSON.parse(body).prefixes.forEach(function(prefix) {
        if(prefix.service === "EC2") {
          feed({ network: prefix.ip_prefix });
        }
      });
    }
  });
}

module.exports = function(feed) {
  feed({ hostname: "\\.amazonaws\\.com$" });
  grab(feed);
  setInterval(function() {
    grab(feed);
  }, 1000 * 3600 * 4);
};
