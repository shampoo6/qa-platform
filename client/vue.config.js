const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    // proxy 配置可以直接输入一个url，这样的话所有的请求都会发送到该地址
    // proxy: 'http://127.0.0.1:1024',
    // 也可以进行更多的细节配置
    proxy: {
      // 配置url前缀对应不通的服务器路径
      '/api': {
        target: 'http://127.0.0.1:1024',
        // 使用rewrite配置，可以将访问路径重写
        // 此处的配置含义是：将访问路径中的 /api 去掉
        pathRewrite: { '^/api': '' },
        // ws: true,
        // changeOrigin: true
      },
    }
  }
})
