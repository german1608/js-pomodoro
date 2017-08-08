const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  // entry: es la que decide que se va a colocar en el dist. en app.js por ejemplo se decidira que se va a usar
  // entre css blabla
  entry: './src/app.js',
  // el output en un solo archivo
  output: {
    filename: 'bundle.js', 
    path: path.resolve(__dirname, 'dist')
  },
  // module.rules contiene las reglas o mandatos que ejecutara webpack cada vez que lo ejecutemos
  module: {
    rules: [
      
      {
        test: /\.scss$/,
        use: [{
            loader: "style-loader" // creates style nodes from JS strings
        }, {
            loader: "css-loader" // translates CSS into CommonJS
        }, {
            loader: "sass-loader" // compiles Sass to CSS
        }]
      },
      {
        test: /\.pug$/,
        use: ['html-loader','pug-html-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader"
      }
    ]
  },
  devServer: {
    // The following 2 lines enable to check it via IP
    host: "0.0.0.0",
    disableHostCheck: true,
    contentBase: './dist'
  },
  // plugins para html
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.pug'
    })
  ]
}