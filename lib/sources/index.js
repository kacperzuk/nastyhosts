"use strict";

module.exports = (sources) => {
  return sources.map((source) => {
    return require(`./${source}`);
  });
};
