const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = (env, argv) => {
    let fileName = '[contenthash]'
    let devtool = 'inline-source-map'

    if (argv.mode === 'production') {
        fileName = 'index'
        devtool = false
    }

    return {
        mode: argv.mode,
        context: path.resolve(__dirname, 'src'),
        entry: {
            'home': './layouts/home/js'
        },
        output: {
            path: path.resolve(__dirname, './public'),
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
        plugins: [
            new HtmlWebpackPlugin({ template: 'layouts/home/index.html', filename: '[name]/index.html' }),
            new MiniCssExtractPlugin({
                filename: `[name]/css/${fileName}.css`
            })
        ]
    }
}