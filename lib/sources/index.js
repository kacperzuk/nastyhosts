module.exports = function(sources) {
  return sources.map(function(source) {
    return require("./" + source);
  });
};
