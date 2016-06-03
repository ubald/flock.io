var webpack = require( 'webpack' );
var path    = require( 'path' );
var fs      = require( 'fs' );

module.exports = {
    devtool: 'source-map',
    entry:   [
        './src/client.js'
    ],
    output:  {
        path:       path.join( __dirname, 'build' ),
        filename:   'client.js',
        publicPath: '/'
    },
    resolve: {
        alias: {
            "cannon": "cannon/src"
        }
    },
    plugins: [
        new webpack.NoErrorsPlugin()
    ],
    module:  {
        loaders: [
            {
                test:    /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader:  'babel'
            },
            { test: /\.styl$/, loader: 'style!css?sourceMap!stylus?sourceMap' },
            { test: /\.less/, loader: 'style!css?sourceMap!less?sourceMap' }
        ]
    }
};