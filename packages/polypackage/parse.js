const babylon = require('babylon');

const allBabylonPlugins = [
  'jsx',
  'flow',
  'asyncFunctions',
  'classConstructorCall',
  'doExpressions',
  'trailingFunctionCommas',
  'objectRestSpread',
  'decorators',
  'classProperties',
  'exportExtensions',
  'exponentiationOperator',
  'asyncGenerators',
  'functionBind',
  'functionSent'
];

function parse(src) {
  const ast = babylon.parse(src, {
    sourceType: 'module',
    plugins: allBabylonPlugins
  });

  for (let i = 0; i < ast.program.body.length; i++) {
    const item = ast.program.body[i];
    if (!isValidExport(item)) {
      throw Error('not a valid export');
    }
  }
  return ast.program.body;
}

function isValidExport(item) {
  // only support non-declaration named exports
  if (item.type === 'ExportNamedDeclaration' && !item.declaration) {
    // disallow default exports
    return item.specifiers.every(specifier => specifier.exported.name !== 'default');
  }
  return false;
}

module.exports = parse;
