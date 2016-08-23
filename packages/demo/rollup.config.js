import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/module.js',
  dest: 'dist/es/module.js',
  format: 'es',
  plugins: [
    babel({
      babelrc: false,
      presets: [require('babel-preset-es2015-rollup')]
    })
  ]
};
