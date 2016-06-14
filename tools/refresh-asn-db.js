"use strict";

if(process.argv.length < 3) {
  console.error("Missing cachedir argument");
  process.exit(1);
}

const ip2asn = require('iptoasn')(process.argv[2]);
ip2asn.load({ update: true });
ip2asn.on('cache_locked', () => {
  console.error("Cache is locked!");
  process.exit(2);
});
ip2asn.on('ready', () => {
  console.log("Done");
});
