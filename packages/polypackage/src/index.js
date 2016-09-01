const path = require('path');
const derivePkg = require('derive-pkg-core');
const extend = require('just-extend');

function polyPackage({basedir, srcDirname, outputDirname, transpileDirname}) {
  derivePkg({
    srcDir: basedir,
    destDir: path.join(basedir, outputDirname),
    transformFn: (pkg) => {
      return extend({}, pkg, {
        main: path.join(transpileDirname, 'index.js'),
        module: 'es/index.js'
      });
    }
  }, (err) => {
    if (err) {
      console.log(err);
    }
  });
}

module.exports = polyPackage;
