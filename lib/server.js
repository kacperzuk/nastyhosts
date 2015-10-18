const express = require("express");
const Redis = require("ioredis");

module.exports = (config, plugins) => {
  const app = express();
  const redisCache = new Redis(config.redis.cache);
  const redisLimiter = new Redis(config.redis.limiter);
  const limiter = require("express-limiter")(app, redisLimiter);
  const ipcheck = require("./ipcheck")(config);

  limiter({
    path: "*",
    method: "all",
    lookup: "connection.remoteAddress",
    total: config.limiter.total,
    expire: config.limiter.expire,
    whitelist(req) {
      return config.limiter.whitelist.indexOf(req.connection.remoteAddress) > -1;
    },
    onRateLimited(req, res) {
      res.send({ status: 429 });
    }
  });

  app.use((req, res, next) => {
    res.type("json");
    next();
  });

  plugins.forEach((plugin) => {
    plugin(app, config, ipcheck);
  });

  app.get("/:ip", (req, res) => {
    redisCache.get(req.params.ip).then((cachedResult) => {
      let d = new Date().toISOString().split('T')[1].split('.')[0];
      if(cachedResult) {
        redisCache.expire(req.params.ip, 600);
        console.log(d, req.params.ip, cachedResult);
        res.send(cachedResult);
      } else {
        ipcheck(req.params.ip).then((result) => {
          result = JSON.stringify(result);
          redisCache.setex(req.params.ip, 600, result);
          console.log(d, req.params.ip, result);
          res.send(result);
        });
      }
    });
  });

  app.use((req, res) => {
    res.send({ status: 200, ip: req.connection.remoteAddress });
  });

  const port = config.express.port;
  const host = config.express.host;

  app.listen(port, host);
};
