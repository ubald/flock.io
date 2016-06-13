var webpack = require( 'webpack' );
var localIP = require( '../src/engine/utils/NetworkUtils' ).getLocalIp();

var config = require( './webpack.config.client' );

config.debug = true;
config.entry.client.unshift( "webpack-dev-server/client?http://" + localIP + ":3001/", "webpack/hot/dev-server" );
config.output.publicPath = "http://" + localIP + ":3001" + config.output.publicPath;
config.plugins           = config.plugins.concat(
    new webpack.HotModuleReplacementPlugin()
);

module.exports = config;
