var webpack = require( 'webpack' );

var config = require('./webpack.config.client');

config.plugins = config.plugins.concat(
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
);

module.exports = config;