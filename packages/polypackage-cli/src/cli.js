#!/usr/bin/env node
const argv = require('minimist')(process.argv.slice(2));
const path = require('path');
const polyPackage = require('polypackage');

const opts = {
  basedir: process.cwd(),
  srcDirname: argv._[0],
  outputDirname: argv.root,
  transpileDirname: argv['out-dir']
};

polyPackage(opts);
