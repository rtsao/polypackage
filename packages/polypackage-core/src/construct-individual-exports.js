module.exports = constructIndividualExports;

/**
 * [constructIndividualExports description]
 * @param  {ExportNamedDeclaration} declaration - Source declaration AST
 * @param  {function} sourceTransform           - 
 * @return {ExportNamedDeclaration[]}           - Array of individual export ASTs
 */
function constructIndividualExports(declaration, sourceTransform) {
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
          value: sourceTransform(declaration.source.value)
        },
        exportKind: declaration.exportKind
      },
      exportedIdentifier: specifier.exported.name 
    };
  });
}
