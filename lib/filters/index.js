"use strict";

module.exports = (filters) => {
  return filters.map((filter) => {
    return require(`./${filter}`);
  });
};
