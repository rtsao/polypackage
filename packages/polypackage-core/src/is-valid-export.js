module.exports = isValidExport;

function isValidExport(item) {
  // only support non-declaration named exports
  if (item.type === 'ExportNamedDeclaration' && !item.declaration) {
    // disallow default exports
    return item.specifiers.every(specifier => specifier.exported.name !== 'default');
  }
  return false;
}
