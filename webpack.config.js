const fs = require('fs')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env) => {
    fs.rmSync(`./${env.outputDir}`, {
        recursive: true,
        force: true
    });

    let fileName = '[contenthash]'
    let devtool = 'inline-source-map'

    if (env.mode === 'production') {
        fileName = 'index'
        devtool = false
    }

    let splitInputDir = env.inputDir.split('/')
    let context = splitInputDir.length === 1 ? './' : env.inputDir.slice(0, splitInputDir[0].length)
    let inputDir = env.inputDir.replace(`${context}/`, '')
    let entryList = {}

    let pluginsList = [
        new MiniCssExtractPlugin({
            filename: `[name]/css/${fileName}.css`
        })
    ]

    let layouts = fs.readdirSync(env.inputDir, {
        withFileTypes: false,
        recursive: false
    })

    layouts.forEach(dir => {
        entryList[dir] = `./${inputDir}/${dir}/js`
        pluginsList.push(
            new HtmlWebpackPlugin({
                template: `${inputDir}/${dir}/index.html`,
                filename: `${dir}/index.php`, chunks: [dir],
                publicPath: `./${env.outputDir}`,
                scriptLoading: 'defer'
            })
        )
    })

    return {
        mode: env.mode,
        context: path.resolve(__dirname, context),
        entry: entryList,
        output: {
            path: path.resolve(__dirname, `./${env.outputDir}`),
            filename: `[name]/js/${fileName}.js`
        },
        resolve: {
            extensions: ['.js']
        },
        devtool: devtool,
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                url: false
                            }
                        }
                    ]
                }
            ]
        },
        plugins: pluginsList
    }
}