module.exports = isValidExport;

function isValidExport(item) {
  // only support non-declaration named exports
  if (
    // support only named exports
    item.type !== 'ExportNamedDeclaration' ||
    // do not support declaration exports
    item.declaration ||
    // export must have a source
    !item.source
  ) {
    return false;
  }
  // disallow default exports
  return item.specifiers.every(specifier => specifier.exported.name !== 'default');
}
