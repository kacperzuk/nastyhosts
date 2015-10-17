const fs = require("fs");
const path = require("path");
const diff = require("lodash.difference");

function handle(file, feed) {
  const current = require(file);
  current.forEach(feed);
  file = path.join(__dirname, file);
  let w;

  function cb(ev) {
    if(ev !== "rename") {
      fs.readFile(file, (err, data) => {
        const newData = diff(JSON.parse(data), current);
        console.log("Loading new static evil:", newData);
        current.push(...newData);
        newData.forEach(feed);

        // workaround for https://github.com/nodejs/node-v0.x-archive/issues/3172
        w.close();
        w = fs.watch(file, { persistent: false }, cb);
      });
    }
  }

  w = fs.watch(file, { persistent: false }, cb);
}

module.exports = (feed) => {
  handle("../../evil-networks.json", (v) => {
    feed({ network: v });
  });
  handle("../../evil-hosts.json", (v) => {
    feed({ hostname: v });
  });
};
