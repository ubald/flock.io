var webpack = require( 'webpack' );

var config = require('./webpack.config.server');

config.debug   = true;
config.plugins = config.plugins.concat(
    new webpack.HotModuleReplacementPlugin()
);

module.exports = config;