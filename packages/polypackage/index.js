const path = require('path');
const derivePkg = require('derive-pkg-core');

function polyPackage({basedir, srcDirname, outputDirname, transpileDirname}) {
  derivePkg({
    srcDir: basedir,
    destDir: path.join(basedir, outputDirname),
    transformFn: (pkg) => {
      return Object.assign({}, pkg, {
        main: path.join(transpileDirname, 'module.js'),
        module: 'es/module.js'
      });
    }
  }, (err) => {
    if (err) {
      console.log(err);
    }
  });
}

module.exports = polyPackage;
