var webpack = require( 'webpack' );

var config = require('./webpack.config.server');

config.plugins = serverConfig.plugins.concat(
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
);

module.exports = config;