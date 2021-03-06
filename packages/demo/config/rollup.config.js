import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/index.js',
  dest: 'dist-es/index.js',
  format: 'es',
  plugins: [
    babel({
      babelrc: false,
      presets: [
        ['babel-preset-es2015', {
          modules: false
        }]
      ],
      plugins: ['external-helpers']
    })
  ]
};
