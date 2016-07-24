"use strict";

if(process.argv.length < 3) {
  console.error("Missing cachedir argument");
  process.exit(1);
}

const ip2asn = require('iptoasn')(process.argv[2]);
ip2asn.update(null, (status) => {
  if(status == "cache_locked") {
  console.error("Cache is locked!");
  process.exit(2);
  } else if(status == "finished") {
    console.log("Done");
  } else {
    console.log("Unknown status", status);
    process.exit(3);
  }
});
