const {spawn} = require('child_process');
const rollup = require('rollup');
const path = require('path');
const minimist = require('minimist');
const getConfig = require('./get-rollup-babel-config');
const babel = require('rollup-plugin-babel');
const resolveBin = require('resolve-bin');
const readPkgUp = require('read-pkg-up');

const babelCli = resolveBin.sync('babel-cli', {executable: 'babel'});

const args = process.argv.slice(2);

const optsWhitelist = {
  'out-dir': true,
  'd': true,
  'copy-files': true,
  '_': true
};

const opts = minimist(args, {
  // NOTE: this is incomplete
  alias: {
    'd': 'out-dir'
  }
});

Object.keys(opts).forEach(name => {
  if (!optsWhitelist[name]) {
    throw new Error(`Error: Babel option ${name} not yet supported`);
  }
});

if (opts._.length < 1) {
  throw new Error('Babel src argument is required');
}

const src = opts._[0];

const info = readPkgUp.sync({cwd: path.dirname(src)});
const pkg = info.pkg;
const pkgDir = path.dirname(info.path);
const destDir = path.resolve(opts['out-dir']);
const pkgMainDestDir = path.resolve(pkgDir, path.dirname(pkg.main));

if (pkgMainDestDir !== destDir) {
  throw new Error(`Babel out dir: ${opts['out-dir']} does not correspond to package.json main entry: ${pkg.main}`);
}

if (!pkg.module) {
  throw new Error('no module field in package.json!');
}

const srcEntryPath = path.resolve(src, path.basename(pkg.main));

spawn(babelCli, args, {stdio: 'inherit'});

rollup.rollup({
  entry: srcEntryPath,
  plugins: [
    babel(getConfig(path.resolve(src)))
  ]
}).then(bundle => {
  bundle.write({
    format: 'es',
    dest: path.resolve(pkg.module)
  });
});
