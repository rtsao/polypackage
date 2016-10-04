const fs = require('fs');
const path = require('path');
const polypackage = require('polypackage-core');

module.exports = function() {
  return {
    visitor: {
      Program: function({node}, state) {
        const rootModule = state.opts.rootModule || 'src/index.js';
        if (state.file.opts.filename !== rootModule) {
          // ignore everything but polypackage entry
          return false;
        }
        const files = polypackage(node.body, {
          dirname: state.opts.transpileDir,
          preserveCase: state.opts.preserveCase
        });
        Object.keys(files).forEach(filename => {
          const content = files[filename];
          if (!state.opts.silent) {
            console.log('polypackage:', filename);
          }
          fs.writeFileSync(filename, content, 'utf8');
        });
      }
    }
  };
};
