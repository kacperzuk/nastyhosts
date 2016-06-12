"use strict";

const dns = require("dns");

const evilHostnames = [];

module.exports = (ip) => {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve({ deny: false, hostnames: [] });
      resolve = null;
    }, 500);
    dns.reverse(ip, (err, hostnames) => {
      if(!resolve) {
        return;
      }
      clearTimeout(timeout);
      if(err) {
        hostnames = [];
      }
      const deny = hostnames.some((name) => {
        return evilHostnames.some((regex) => {
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

module.exports.feed = (evil) => {
  if(evil.hostname) {
    evilHostnames.push(new RegExp(evil.hostname, "i"));
  }
};
