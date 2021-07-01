const path = require('path');

module.exports = {
  //mode: change this to 'production' for minified code
  mode: 'development', 
  // make webpack use the built in sourcemap feature to locate source errors 
  devtool: 'inline-source-map',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },

};