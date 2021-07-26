//webpack渲染进程配置

'use strict'

const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const { ExternalsPlugin } = require('webpack')
const webpack = require('webpack')

let rendererConfig = {
    devtool:'eval-cheap-module-source-map',
    entry: {
        renderer: path.join(__dirname, '../src/renderer/main.js')//入口
    },
    externals:[],
    //webpack打包配置
    module: {
        rules: [{
            test: /\.scss$/,
            use: ['vue-style-loader', 'css-loader', 'sass-loader']
        }, {
            test: /\.css$/,
            use: ['vue-style-loader', 'css-loader']
        }, {
            test: /\.vue$/,
            use: ['vue-loader']
        },
        // 1.文件大小小于limit参数，url-loader将会把文件转为DataURL；2.文件大小大于limit，url-loader会调用file-loader进行处理，参数也会直接传给file-loader。
        {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            use: {
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'imgs/[name]--[folder].[ext]'
                }
            }
        }, {
            test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: 'media/[name]--[folder].[ext]'
            }
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            use: {
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'fonts/[name]--[folder].[ext]'
                }
            }
        }]
    },
    plugins: [
        // 需配合loader在module中使用
        new VueLoaderPlugin(),
        // 开启HMR(hot module replacement),手动引入则无需在webpack-dev-server中设置hot为true
        new webpack.HotModuleReplacementPlugin(),
        // 在编译出现错误时，使用 NoEmitOnErrorsPlugin 来跳过输出阶段
        new webpack.NoEmitOnErrorsPlugin(),
        // 寻找模板注入并创建index.html到output目录下
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, '../src/index.html')
        })
    ],
    node: {
        // true: 输入文件(打包前)的目录名 false: 输出文件(打包后)的目录名 (不设默认为'/')
        __dirname: process.env.NODE_ENV !== 'production',
        // true: 输入文件(打包前)的文件名 false: 输出文件(打包后)的文件名 (不设默认为'index.js')
        __filename: process.env.NODE_ENV !== 'production'
    },
    output: {
        // [name]是entry对象的key值
        filename: '[name].js',
        path: path.join(__dirname, '../dist/electron'),
        publicPath: './'
    },
    resolve: {
        // 别名设置
        alias: {
            '@': path.join(__dirname, '../src/renderer'),
            '@root': path.resolve(__dirname, '..'),
            'vue$': 'vue/dist/vue.esm.js'
        },
        // 自动解析，引入文件不需要加以下后缀
        extensions: ['.js', '.vue', '.json', '.css', 'scss']
    },
    // https://www.webpackjs.com/configuration/target/
    // target: 'electron6.13-renderer'
    target:'web'
}

if (process.env.NODE_ENV === 'production') {
    // 生产环境仅打包不生成source map
    rendererConfig.devtool = '';
    // 生产环境添加需要的插件
    rendererConfig.plugins.push(
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    )
}

module.exports = rendererConfig;