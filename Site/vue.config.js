const Dotenv = require('dotenv-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  configureWebpack: {
    plugins: [
      new Dotenv({
        path: './.env'
      }),
      new MiniCssExtractPlugin()
    ],
    resolve: {
      
    }
  }
};
