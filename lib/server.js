const express = require("express");
const Redis = require("ioredis");

module.exports = function(config, plugins) {
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
    onRateLimited(req, res) {
      res.send({ status: 429 });
    }
  });

  app.use(function(req, res, next) {
    res.type("json");
    next();
  });

  plugins.forEach(function(plugin) {
    if(plugin.middleware) {
      app.use(plugin.middleware);
    }
  });

  app.get("/:ip", function(req, res) {
    redisCache.get(req.params.ip).then(function(cachedResult) {
      if(cachedResult) {
        redisCache.expire(req.params.ip, 600);
        console.log(cachedResult);
        res.send(cachedResult);
      } else {
        ipcheck(req.params.ip).then(function(result) {
          result = JSON.stringify(result);
          redisCache.setex(req.params.ip, 600, result);
          console.log(result);
          res.send(result);
        });
      }
    });
  });

  plugins.forEach(function(plugin) {
    if(plugin.routes) {
      plugin.routes.forEach(function(route) {
        if(["get", "post", "put", "delete"].indexOf(route.method) > -1) {
          app[route.method](route.path, route.callback);
        }
      });
    }
  });

  app.use(function(req, res) {
    res.send({ status: 200, ip: req.connection.remoteAddress });
  });

  const port = config.express.port;
  const host = config.express.host;

  app.listen(port, host);
};
