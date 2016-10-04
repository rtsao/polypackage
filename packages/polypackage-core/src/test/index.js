const test = require('tape');
const babylon = require('babylon');

function parse(src) {
  return babylon.parse(src, {
    sourceType: 'module'
  }).program.body;
}

const core = require('../index.js');

test('basic functionality', t => {
  const ast = parse(`
    export {foo} from './foo';
    export {bar} from 'bar';
    export {baz, qux} from 'baz'`);
  const entries = core(ast);
  const filenames = Object.keys(entries);
  t.equal(filenames.length, 4);
  t.equal(filenames[0], 'foo.js');
  t.equal(entries[filenames[0]], 'module.exports = require("./dist/foo").foo;');
  t.equal(filenames[1], 'bar.js');
  t.equal(entries[filenames[1]], 'module.exports = require("bar").bar;');
  t.equal(filenames[2], 'baz.js');
  t.equal(entries[filenames[2]], 'module.exports = require("baz").baz;');
  t.equal(filenames[3], 'qux.js');
  t.equal(entries[filenames[3]], 'module.exports = require("baz").qux;');
  t.end();
});
