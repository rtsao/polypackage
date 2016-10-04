module.exports = generateEntry;

/**
 * Generates CommonJS entries from a polypackage-compliant "main" entry
 * @param  {ExportNamedDeclaration} declaration - Source declaration AST
 * @param  {function} pathTransformer           - Function that return new path 
 * @return {ExpressionStatement}                - AST for CommonJS entry export
 */
function generateEntry({exportedName, localName, source}) {
  return {
    type: 'ExpressionStatement',
    expression: {
      type: 'AssignmentExpression',
      operator: '=',
      left: {
        type: 'MemberExpression',
        object: {
          type: 'Identifier',
          name: 'module'
        },
        property: {
          type: 'Identifier',
          name: 'exports'
        }
      },
      right: {
        type: 'MemberExpression',
        object: {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: 'require'
          },
          arguments: [
            {
              type: 'StringLiteral',
              value: source
            }
          ]
        },
        property: {
          type: 'Identifier',
          name: localName
        }
      }
    }
  };
}
