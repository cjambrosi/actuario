module.exports = {
  output: {
    filename: 'bundle.min.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ["@babel/preset-env"]
          }
        },
      },
    ],
  },
  mode: 'production',
  stats: {
    assets: true
  },
  performance: {
    hints: false
  }
};