const fs = require('fs');
const path = require('path');
const polypackage = require('polypackage-core');
const mkdirp = require('mkdirp');

module.exports = function() {
  return {
    visitor: {
      Program: function({node}, state) {
        const rootModule = state.opts.rootModule || 'src/index.js';
        const destDir = state.opts.dest;

        if (state.file.opts.filename !== rootModule) {
          // only concerned with root module
          return false;
        }
        const modules = polypackage(node.body, {
          dirname: 'lib',
          preserveCase: state.opts.preserveCase
        });
        mkdirp.sync(destDir);
        modules.forEach(file => {
          const filepath = path.join(destDir, file.filename);
          if (!state.opts.silent) {
            console.log('polypackage:', filepath);
          }
          fs.writeFileSync(filepath, file.code, 'utf8');
        });
      }
    }
  };
};
