const babel = require('babel-core');

module.exports = stringifyCommonJSEntry;

function stringifyCommonJSEntry(declaration) {
  // TODO: Customizing plugins in transformFromAst not working for some reason...
  const untranspiled = babel.transformFromAst({
    type: 'File',
    program: {
      type: 'Program',
      sourceType: 'module',
      body: [declaration]
    }
  });
  const output = babel.transform(untranspiled.code, {
    plugins: [
      require('babel-plugin-add-module-exports'),
      require('babel-plugin-transform-es2015-modules-commonjs')
    ]
  });
  return output.code;
}
