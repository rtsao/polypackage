const fs = require('fs');
const path = require('path');

const parse = require('./parse');
const toModule = require('./ast-to-commonjs-module');

function polyPackage({basedir, srcDirname, outputDirname, transpileDirname}) {
  const pkgSrc = fs.readFileSync(path.join(basedir, 'package.json'), 'utf8');
  const pkg = JSON.parse(pkgSrc);

  if (!pkg.module) {
    throw Error('must have module field');
  }

  const moduleSrc = fs.readFileSync(path.join(basedir, pkg.module), 'utf8');
  const exportDeclarations = parse(moduleSrc);
  const modules = exportDeclarations.reduce((acc, decl) => {
    return acc.concat(toModule(decl, transpileDirname));
  }, []);
  try {
    fs.mkdirSync(path.join(basedir, outputDirname));
  } catch(e) {
    if ( e.code != 'EEXIST' ) throw e;
  }
  modules.forEach(({filename, source}) => {
    fs.writeFileSync(path.join(basedir, outputDirname, filename), source, 'utf8');
  });

  const derivedPkg = Object.assign({}, pkg, {
    main: path.join(transpileDirname, 'module.js')
  });
  fs.writeFileSync(path.join(basedir, outputDirname, 'package.json'), JSON.stringify(derivedPkg, null, 2), 'utf8');
}

module.exports = polyPackage;

