const webpack = require('webpack');

module.exports = {
    cache: true,
    entry: {
        home: './app/public/js/home.js',
        wall: './app/public/js/wall.js'
    },
    output: {
        path: './dist/js',
        filename: '[name].js',
        publicPath: '/js/',
        chunkFilename: '[id].[name].js'
    },
    resolve: {
        modules: ['node_modules', 'web_modules', 'modules'],
        descriptionFiles: ['package.json']

    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: [/node_modules/, /web_modules/],
            loader: 'babel-loader',
            options: {
                presets: [['es2015', { modules: false}], 'react']
            }
        }]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            filename: 'common.js',
            name: 'common'
        })
    ],
    node: {
        fs: 'empty'
    }
};
