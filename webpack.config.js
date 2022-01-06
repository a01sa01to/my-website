const path = require('path')

module.exports = {
  resolve: {
    modules: ['node_modules', 'es2020', 'ts-loader'],
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts/,
        loader: 'ts-loader',
        exclude: [/_site/, /node_modules/],
      },
    ],
  },
  entry: {
    main: './src/main.ts',
  },
  output: {
    path: path.resolve(__dirname, 'js'),
    filename: '[name].bundle.js',
  },
  // mode: "development",
  mode: 'production',
}
