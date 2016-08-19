const babel = require('babel-core');
const path = require('path');

function getInfo(declaration, transpileDirname) {
  const exported = extractIndividualExports(declaration, transpileDirname);
  const modules = exported.map(info => {
    // WTF BABEL
    const untranspiled = babel.transformFromAst({
      type: 'File',
      program: {
        type: 'Program',
        sourceType: 'module',
        body: [info.declaration]
      }
    });

    const output = babel.transform(untranspiled.code, {
      plugins: [
        require('babel-plugin-add-module-exports'),
        require('babel-plugin-transform-es2015-modules-commonjs')
      ]
    });

    return {
      source: output.code,
      filename: `${info.exportedIdentifier}.js`
    };
  });
  return modules;
}

function extractIndividualExports(declaration, transpileDirname) {
  return declaration.specifiers.map(specifier => {
    return {
      declaration: {
        type: declaration.type,
        specifiers: [{
          type: specifier.type,
          local: specifier.local,
          exported: {
            type: 'Identifier',
            name: 'default'
          }
        }],
        source: {
          type: 'StringLiteral',
          value: getTranspiledPath(declaration.source.value, transpileDirname)
        },
        exportKind: declaration.exportKind
      },
      exportedIdentifier: specifier.exported.name 
    };
  });
}

module.exports = getInfo;

function getTranspiledPath(str, transpileDirname) {
  return pathIsRelative(str) ? `./${path.join(transpileDirname, str)}` : str;
}

function pathIsRelative(str) {
  return str[0] === '.';
}
