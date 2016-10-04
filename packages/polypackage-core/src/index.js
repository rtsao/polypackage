const path = require('path');
const parseMain = require('./parse-polypackage-entry');
const generateCommonJsEntry = require('./generate-commonjs-entry');
const stringify = require('./stringify-entry-ast');
const kebab = require('param-case');

module.exports = moduleAstToCommonJs;

function moduleAstToCommonJs(body, opts = {}) {
  const exported = parseMain(body);
  // transformers
  const files = Object.keys(exported).reduce((acc, exportedName) => {
    const filename = getFilename(exportedName, opts.preserveCase);
    if (acc[filename]) {
      // TODO: Friendlier errors
      throw Error('commonJS filenames must be unique');
    }
    const {localName, source} = exported[exportedName];
    const ast = generateCommonJsEntry({
      source: getTranspiledPath(source, opts.transpileDir),
      exportedName,
      localName
    });
    acc[filename] = stringify(ast);
    return acc;
  }, {});
  return files;
}

function getFilename(identifier, preserveCase = false) {
  const name = preserveCase ? identifier : kebab(identifier);
  return `${name}.js`;
}

function getTranspiledPath(str, transpileDir = 'dist') {
  return pathIsRelative(str) ? `./${path.join(transpileDir, str)}` : str;
}

/**
 * Returns whether path is relative or not
 * Adapted from: https://github.com/nodejs/node/blob/55852e14212f81b3849508e7e8862b3077316a99/lib/module.js#L305
 * @param  {string} request - The path
 * @return {boolean}        - Whether path is relative or not
 */
function pathIsRelative(request) {
  return (
    !(request.length < 2 ||
      request.charCodeAt(0) !== 46/*.*/ ||
      (request.charCodeAt(1) !== 46/*.*/ &&
       request.charCodeAt(1) !== 47/*/*/))
  );
}
