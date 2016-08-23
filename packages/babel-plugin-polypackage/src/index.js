const fs = require('fs');
const path = require('path');
const polypackage = require('polypackage-core');

module.exports = function() {
  return {
    visitor: {
      Program: function({node}, state) {
        const rootModule = state.opts.rootModule || 'src/module.js';
        const destDir = state.opts.dest;

        if (state.file.opts.filename !== rootModule) {
          // only concerned with root module
          return false;
        }
        const modules = polypackage(node.body, {
          dirname: 'lib'
        });
        modules.forEach(file => {
          fs.writeFileSync(path.join(destDir, file.filename), file.code, 'utf8');
        });
      }
    }
  };
};
