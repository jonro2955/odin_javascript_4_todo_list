const path = require("path");

module.exports = {
  //mode: change this to "production" for minified code
  mode: "production",
  /* "devtool: "inline-source-map"" is a sourcemap feature to 
  locate source errors. Only use during development since it 
  dramatically increases bundle size: */
  // devtool: "inline-source-map",
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};
