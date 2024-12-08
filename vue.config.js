const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    devtool: "source-map"
  },
  outputDir: process.env.NODE_ENV === 'development' ? 'dist-dev' :
             process.env.NODE_ENV === 'production' ? 'dist-prod' :
             'dist', // fallback to dist for production
})
