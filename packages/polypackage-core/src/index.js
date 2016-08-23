const path = require('path');
const isValidExport = require('./is-valid-export');
const constructIndividualExports = require('./construct-individual-exports');
const compileToCommonJSEntry = require('./compile-to-commonjs-entry');

module.exports = moduleAstToCommonJs;

function moduleAstToCommonJs(body, opts) {
  inspect(body);
  const transFn = sourcePath => getTranspiledPath(sourcePath, opts.dirname);
  const identifierToFilename = identifier => `${identifier}.js`;
  let output = [];
  body.forEach(decl => {
    const asts = constructIndividualExports(decl, transFn);
    asts.forEach(thing => {
      const code = compileToCommonJSEntry(thing.declaration);
      const filename = identifierToFilename(thing.exportedIdentifier);
      output.push({filename, code});
    });
  });
  return output;
}

function inspect(body) {
  for (let i = 0; i < body.length; i++) {
    const item = body[i];
    if (!isValidExport(item)) {
      // TODO: output line number
      throw Error('not a valid export');
    }
  }
}

function getTranspiledPath(str, transpileDirname) {
  return pathIsRelative(str) ? `./${path.join(transpileDirname, str)}` : str;
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
