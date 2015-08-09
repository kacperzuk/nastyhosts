const validator = require("validator");
let filters;
let sources;

const evilHostnames = [];
const evilNetworks = [];

function feedFilters(evil) {
  filters.forEach(function(filter) {
    filter.feed(evil);
  });
}

function ipcheck(ip) {
  if(validator.isIP(ip)) {
    const promises = [];
    const response = { status: 200 };
    let deny = false;

    filters.forEach(function(filter) {
      promises.push(filter(ip).then(function(data) {
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

    return Promise.all(promises).then(function() {
      response.suggestion = deny ? "deny" : "allow";
      return Promise.resolve(response);
    });
  } else {
    return Promise.resolve({status: 400});
  }
}

module.exports = function(config) {
  filters = require("./filters")(config.filters);
  sources = require("./sources")(config.sources);
  sources.forEach(function(source) {
    source(function(evil) {
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
