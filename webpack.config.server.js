var webpack = require( 'webpack' );
var path    = require( 'path' );
var fs      = require( 'fs' );

/**
 * Ignored node_modules
 */
var nodeModules = {};
fs.readdirSync( 'node_modules' )
    .filter( function ( x ) {
        return ['.bin'].indexOf( x ) === -1;
    } )
    .forEach( function ( mod ) {
        nodeModules[mod] = 'commonjs ' + mod;
    } );

module.exports = {
    devtool:     'source-map',
    entry:       [
        './src/server.js'
    ],
    target:      'node',
    output:      {
        path:     path.join( __dirname, 'build' ),
        filename: 'server.js'
    },
    node : {
        __filename: true,
        __dirname: true
    },
    externals:   nodeModules,
    recordsPath: path.join( __dirname, 'build/_records' ),
    resolve: {
        alias: {
            "cannon": "cannon/src"
        }
    },
    plugins:     [
        new webpack.NoErrorsPlugin(),
        new webpack.BannerPlugin( 'require("source-map-support").install();', { raw: true, entryOnly: false } )
    ],
    module:      {
        loaders: [
            { test: /\.html/, loader: 'html' },
            {
                test:    /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader:  'babel'
            }
        ]
    }
};