const path = require('path');

module.exports = {
  mode: 'production',
  entry: './index.js', 
  output: {
    path: path.resolve(__dirname, '../server_build'), 
    filename: 'bundle.js', 
  },
  target: 'node', 
  module: {
    rules: [
      {
        test: /\.ejs$/,
        loader: 'ejs-compiled-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.js$|.*www.*\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
