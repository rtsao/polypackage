const {OptionManager} = require('babel-core');

const commonJSPlugin = OptionManager.normalisePlugin(
  require('babel-plugin-transform-es2015-modules-commonjs')
);

module.exports = function getBabelConfig(filepath) {
  const instance = new OptionManager();
  instance.init({filename: filepath});

  const options = instance.options;

  // attempt to find index of commonJSPlugin
  let indices = [];
  options.plugins.forEach((p, i) => {
    if (p[0] === commonJSPlugin) {
      indices.push(i);
    }
  });
  indices.forEach(index => {
    // delete index
    options.plugins.splice(index, 1);
  });

  return {
    plugins: options.plugins,
    // ignore .babelrc files
    babelrc: false
  };
}
