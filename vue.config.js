const CompressionPlugin = require('compression-webpack-plugin')
module.exports = {
  publicPath: './',
  configureWebpack: {
    externals: {
      vue: 'Vue',
      'vue-router': 'VueRouter',
      vuex: 'Vuex',
      'element-ui': 'ELEMENT',
      axios: 'axios',
      moment: 'moment'
      // without find a useful CDN to import it
      // 'cos-js-sdk-v5': 'COS'
    },
    plugins: [
      new CompressionPlugin({
        filename: '[path][base].gz',
        algorithm: 'gzip',
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0.8
      })
    ]
  },
  devServer: {
    proxy: {
      '/api': {
        // target: 'http://121.4.217.63:8080/',
        target: 'http://127.0.0.1:8888/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
