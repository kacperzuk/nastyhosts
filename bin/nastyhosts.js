"use strict";

const path = require("path");
const fs = require("fs");
const argv = require("minimist")(process.argv.slice(2));

process.chdir(path.resolve(__dirname, ".."));

const configPath = path.resolve("config.json");
const hostnamesPath = path.resolve("evil-hosts.json");
const networksPath = path.resolve("evil-networks.json");
const asnsPath = path.resolve("evil-asns.json");


if(argv.init) {
  fs.access(configPath, (err) => {
    if(err) {
      console.log(`Creating ${configPath}`);
      fs.writeFile(configPath, JSON.stringify(require("../lib/config.js").defaultConfig, null, 2));
    }
  });

  fs.access(networksPath, (err) => {
    if(err) {
      console.log(`Creating ${networksPath}`);
      fs.writeFile(networksPath, JSON.stringify(["127.0.0.0/8"], null, 2));
    }
  });

  fs.access(hostnamesPath, (err) => {
    if(err) {
      console.log(`Creating ${hostnamesPath}`);
      fs.writeFile(hostnamesPath, JSON.stringify([], null, 2));
    }
  });

  fs.access(asnsPath, (err) => {
    if(err) {
      console.log(`Creating ${asnsPath}`);
      fs.writeFile(asnsPath, JSON.stringify([], null, 2));
    }
  });

} else {
  [configPath, hostnamesPath, networksPath, asnsPath].forEach((v) => {
    try {
      fs.accessSync(v);
    } catch(err) {
      console.log(`Missing ${v}`);
      console.log("Have you run --init?");
      process.exit(1);
    }
  });
  require("../lib/config.js")((config) => {
    const plugins = config.plugins.map((plugin) => {
      return require(`nastyhosts-${plugin}-plugin`);
    });
    require("../lib/server.js")(config, plugins);
  });
}
