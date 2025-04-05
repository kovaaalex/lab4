const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    mode: isProduction ? 'production' : 'development',
    entry: './src/script.js',
    output: {
      path: path.resolve(__dirname, ''), // Файлы в корень проекта
      filename: 'bundle.js',
      publicPath: '/' // Важно для корректных путей
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html', // Явно указываем имя файла
        minify: isProduction
      }),
      new Dotenv()
    ],
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    devServer: {
      static: {
        directory: path.join(__dirname, ''), // Сервим файлы из корня
      },
      hot: true,
      open: true // Автоматически открывать браузер
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/[hash][ext]' // Картинки в папку assets
          }
        }
      ]
    },
    optimization: {
      minimize: isProduction
    }
  };
};