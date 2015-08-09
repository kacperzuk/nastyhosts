const request = require("request");

function updateList(feed) {
  request("https://check.torproject.org/exit-addresses", function(error, response, body) {
    if(!error && response.statusCode === 200) {
      body.split("\n").forEach(function(d) {
        if(d.indexOf("ExitAddress") > -1) {
          const network = d.split(" ")[1].trim() + "/32";
          feed({ network });
        }
      });
    }
  });
}


module.exports = function(feed) {
  updateList(feed);
  setInterval(function() {
    updateList(feed);
  }, 1000 * 60 * 60);
};
