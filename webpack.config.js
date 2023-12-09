const path = require('path')

module.exports = {
  entry: './public/scripts/edit-db.js',
  module: {
    rules: [
      { test: /\.(js)$/, use: 'babel-loader' }
    ]
  },
  output: {
    path: path.resolve(__dirname, './public/scripts'),
    filename: 'bundle_2.js'
  },
  mode: 'development'
}