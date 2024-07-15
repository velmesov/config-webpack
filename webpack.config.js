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
    let entryPageName = 'index.html'
    let outputPageName = 'index.php'

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
        withFileTypes: true,
        recursive: true
    })

    layouts.forEach(item => {
        let layoutPath = `${item.parentPath}/${item.name}`

        if (item.isDirectory()) {
            if (fs.existsSync(`${layoutPath}/${entryPageName}`)) {
                layoutPath = layoutPath.replace(`${env.inputDir}/`, '')

                entryList[layoutPath] = `./${inputDir}/${layoutPath}/js`
                pluginsList.push(
                    new HtmlWebpackPlugin({
                        template: `${inputDir}/${layoutPath}/${entryPageName}`,
                        filename: `${layoutPath}/${outputPageName}`, chunks: [layoutPath],
                        publicPath: env.outputDir.replace('./../back', ''),
                        scriptLoading: 'defer'
                    })
                )
            }
        }
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
