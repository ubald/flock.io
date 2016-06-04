var webpack = require( 'webpack' );
var path    = require( 'path' );
var fs      = require( 'fs' );

var isDev = process.env.NODE_ENV !== 'production';
var rootPath = path.dirname( __dirname );

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
        path.join( rootPath, 'src/server.js' )
    ],
    target:      'node',
    output:      {
        path:     path.join( rootPath, 'build' ),
        filename: 'server.js'
    },
    node:        {
        __filename: true,
        __dirname:  true
    },
    externals:   nodeModules,
    recordsPath: path.join( __dirname, 'build/_records' ),
    resolve:     {
        modulesDirectories: [
            'src/server',
            'src/lib',
            'node_modules'
        ],
        alias: {
            //"cannon": "cannon/src"
        }
    },
    plugins:     [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.BannerPlugin( 'require("source-map-support").install();', { raw: true, entryOnly: false } ),
        new webpack.DefinePlugin( {
            __CLIENT__:    false,
            __SERVER__:    true,
            "process.env": {
                "NODE_ENV": JSON.stringify( isDev ? "development" : "production" )
            }
        } )
    ],
    module:      {
        loaders: [
            // Loaders
            { test: /\.html/, loader: 'html' },
            {
                test:    /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader:  'babel'
            }
        ]
    }
};