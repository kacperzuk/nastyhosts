const fs = require("fs");
const path = require("path");
const diff = require("lodash.difference");

function handle(file, feed) {
  const current = require(file);
  current.forEach(feed);
  file = path.join(__dirname, file);
  let w;

  const cb = function(ev) {
    if(ev != "rename") {
      fs.readFile(file, function(err, data) {
        const new_data = diff(JSON.parse(data), current);
        console.log("Loading new static evil:", new_data);
        current.push.apply(current, new_data);
        new_data.forEach(feed);

        // workaround for https://github.com/nodejs/node-v0.x-archive/issues/3172
        w.close();
        w = fs.watch(file, { persistent: false }, cb);
      });
    }
  };

  w = fs.watch(file, { persistent: false }, cb);
}

module.exports = function(feed) {
  handle("../../evil-networks.json", function(v) {
    feed({ network: v });
  });
  handle("../../evil-hosts.json", function(v) {
    feed({ hostname: v });
  });
};
