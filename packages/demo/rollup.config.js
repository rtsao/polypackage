import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/module.js',
  dest: 'dist/mjs/bundle-es5.es.js',
  plugins: [babel({
    presets: [
      ['es2015', {modules: false}]
    ]
  })],
  format: 'es'
};
