const validator = require("validator");
let filters;
let sources;

const evilHostnames = [];
const evilNetworks = [];

function feedFilters(evil) {
  filters.forEach((filter) => {
    filter.feed(evil);
  });
}

function ipcheck(ip) {
  if(validator.isIP(ip)) {
    const promises = [];
    const response = { status: 200 };
    let deny = false;

    filters.forEach((filter) => {
      promises.push(filter(ip).then((data) => {
        for(const key in data) {
          if(key === "deny") {
            if(!deny) {
              deny = data[key];
            }
          } else {
            response[key] = data[key];
          }
        }
      }));
    });

    return Promise.all(promises).then(() => {
      response.suggestion = deny ? "deny" : "allow";
      return response;
    });
  } else {
    return Promise.resolve({status: 400});
  }
}

module.exports = (config) => {
  filters = require("./filters")(config.filters);
  sources = require("./sources")(config.sources);
  sources.forEach((source) => {
    source((evil) => {
      if(evil.hostname) {
        if(evilHostnames.indexOf(evil.hostname) === -1) {
          evilHostnames.push(evil.hostname);
          feedFilters(evil);
        }
      } else if(evil.network) {
        if(evilNetworks.indexOf(evil.network) === -1) {
          evilNetworks.push(evil.network);
          feedFilters(evil);
        }
      }
    });
  });

  return ipcheck;
};
