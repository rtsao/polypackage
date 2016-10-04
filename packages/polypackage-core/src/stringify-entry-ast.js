const babel = require('babel-core');

module.exports = stringifyCommonJSEntry;

function stringifyCommonJSEntry(exportStatement) {
  return babel.transformFromAst({
    type: 'File',
    program: {
      type: 'Program',
      sourceType: 'module',
      body: [exportStatement]
    }
  }).code;
}
