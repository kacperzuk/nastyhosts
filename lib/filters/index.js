module.exports = function(filters) {
  return filters.map(function(filter) {
    return require("./" + filter);
  });
};
