const defaultConfig = {
  express: {
    host: "0.0.0.0",
    port: 3000,
  },
  limiter: {
    total: 30,
    expire: 2000
  },
  redis: {
    cache: {
      db: 0
    },
    limiter: {
      db: 1
    }
  },
  sources: [
    "angryadmin",
    "aws",
    "static",
    "tor"
  ],
  filters: [
    "hostnames",
    "networks"
  ],
  plugins: []
};

function configMerge(config, defaults) {
  for(const key in defaults) {
    if(config[key] !== undefined) {
      if(Object.prototype.toString.call(defaults[key]) === "[object Object]") {
        defaults[key] = configMerge(config[key], defaults[key]);
      } else {
        defaults[key] = config[key];
      }
    }
  }
  return defaults;
}

module.exports = function(callback) {
  callback(configMerge(require("../config.json"), defaultConfig));
};

module.exports.defaultConfig = defaultConfig;
