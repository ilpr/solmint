const webpack = require('webpack')
const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
    transpileDependencies: false,
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                Buffer: ['buffer', 'Buffer'],
                process: 'process/browser'
            })
        ],
        resolve: {
            fallback: {
                zlib: false,
                crypto: require.resolve("crypto-browserify"),
                fs: false,
                assert: false,
                util: false,
                path: false,
                stream: require.resolve("stream-browserify")
            }
        }
    }
})
