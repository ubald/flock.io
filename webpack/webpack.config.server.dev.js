var webpack = require( 'webpack' );

var config = require('./webpack.config.server');

config.debug   = true;

module.exports = config;