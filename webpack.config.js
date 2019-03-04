const webpack = require("webpack")
const path = require("path") //node核心模块
module.exports = {
    mode: "production", // development|production
    entry: [ // 入口配置
        "./src/js/main.js"
    ],
    output: { // 输出配置
        filename: "main.js", // 打包输出文件名
        path: path.resolve(__dirname, "./dist/js/") // 打包输出路径（必须绝对路径，否则报错）
    },
    module: { // 放置loader加载器，webpack本身只能打包commonjs规范的js文件
        rules: [{ //规则1
            test: /\.js$/, //js规则
            exclude: /(node_modules)/, //排除modules目录
            use: { //使用babel作为js的loade
                loader: "babel-loader"
                // ,
                // 	options: {
                // 		presets: ['@babel/preset-env'
                // 		],
                // 		plugins: ["@babel/transform-runtime"]
                // 	}
            }
        }]
    },
    plugins: [], // 插件，扩展功能
    resolve: {}, // 为引入的模块起别名
    devServer: {} // webpack-dev-server
}