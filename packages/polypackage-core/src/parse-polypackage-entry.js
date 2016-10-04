const isValidExport = require('./is-valid-export');

module.exports = parseMain;

function parseMain(body) {
  const exportsMap = body.reduce((acc, statement) => {
    if (!isValidExport(statement)) {
      // TODO: output line number
      throw Error('not a valid export');
    }
    const source = statement.source.value;
    statement.specifiers.forEach(specifier => {
      const exportedName = specifier.exported.name;
      if (acc[exportedName]) {
        // TODO output duplicate name
        throw Error('named exports must be unique');
      }
      acc[exportedName] = {
        localName: specifier.local.name,
        source
      };
    });
    return acc;
  }, {});
  return exportsMap;
}
