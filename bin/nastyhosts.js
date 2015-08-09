require("use-strict");

const path = require("path");
const fs = require("fs");
const argv = require("minimist")(process.argv.slice(2));
const configPath = path.resolve(__dirname, "..", "config.json");
const hostnamesPath = path.resolve(__dirname, "..", "evil-hosts.json");
const networksPath = path.resolve(__dirname, "..", "evil-networks.json");

if(argv.init) {
  fs.access(configPath, function(err) {
    if(err) {
      console.log("Creating " + configPath);
      fs.writeFile(configPath, JSON.stringify(require("../lib/config.js").defaultConfig, null, 2));
    }
  });

  fs.access(networksPath, function(err) {
    if(err) {
      console.log("Creating " + networksPath);
      fs.writeFile(networksPath, JSON.stringify(["127.0.0.0/8"], null, 2));
    }
  });

  fs.access(hostnamesPath, function(err) {
    if(err) {
      console.log("Creating " + hostnamesPath);
      fs.writeFile(hostnamesPath, JSON.stringify([], null, 2));
    }
  });

} else {
  [configPath, hostnamesPath, networksPath].forEach(function(v) {
    try {
      fs.accessSync(v);
    } catch(err) {
      console.log("Missing " + v);
      console.log("Have you run --init?");
      process.exit(1);
    }
  });
  require("../lib/config.js")(function(config) {
    require("../lib/server.js")(config);
  });
}
