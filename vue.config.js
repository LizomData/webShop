const { defineConfig } = require('@vue/cli-service')
  module.exports = defineConfig({
    transpileDependencies: true,
    devServer:
    {
      proxy:{
        '/api':
        {
          target:"http://10.60.81.180:8080",
          // ws:false,
          changeOrigin:true,
          pathRewrite:{
            '^/api':''
          }
        }
      }
    }
  })
