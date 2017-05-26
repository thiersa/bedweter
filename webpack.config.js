var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        bedweter: './js/bedweter.js',
        bw: './js/bw.js'
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].bundle.js'
    },
    module: {
        loaders: [
            {
                test: [/\.js$/, /\.es6$/],
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                  cacheDirectory: true,
                  presets: ['react', 'es2015']
                }
            }
        ]
    },
    stats: {
        colors: true
    },
    devtool: 'source-map'
};
