var webpack = require( 'webpack' );

var config = require( './webpack.config.client' );

config.debug = true;
config.entry.unshift( "webpack-dev-server/client?http://localhost:3001/", "webpack/hot/dev-server" );
config.output.publicPath = "http://localhost:3001" + config.output.publicPath;
config.plugins           = config.plugins.concat(
    new webpack.HotModuleReplacementPlugin()
);

module.exports = config;