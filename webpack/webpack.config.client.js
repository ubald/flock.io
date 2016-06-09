var webpack = require( 'webpack' );
var path    = require( 'path' );
var fs      = require( 'fs' );

var isDev    = process.env.NODE_ENV !== 'production';
var rootPath = path.dirname( __dirname );

module.exports = {
    devtool: 'source-map',
    entry:   [
        path.join( rootPath, 'src/client.js' )
    ],
    output:  {
        path:       path.join( rootPath, 'build' ),
        filename:   'client.js',
        publicPath: '/'
    },
    resolve: {
        modulesDirectories: [
            'src/client',
            'src/lib',
            'node_modules'
        ],
        alias:              {
            //'cannon': 'cannon/src'
            'dat.gui': 'vendor/dat.gui.js'
        }
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin( {
            __CLIENT__:    true,
            __SERVER__:    false,
            __DEV__:       isDev,
            'process.env': {
                'NODE_ENV': JSON.stringify( isDev ? 'development' : 'production' )
            }
        } )
    ],
    module:  {
        loaders: [
            // Shims
            { test: /three\/examples/, loader: 'imports?THREE=three' },
            { test: /vendor\/dat\.gui/, loader: 'exports?dat' },
            // Loaders
            {
                test:    /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader:  'babel'
            },
            { test: /\.glsl/, loader: 'shader' },
            { test: /\.styl$/, loader: 'style!css?sourceMap!resolve-url?sourceMap!stylus?sourceMap' },
            { test: /\.less/, loader: 'style!css?sourceMap!less?sourceMap' },
            { test: /\.css$/, loader: 'style!css' },
            { test: /\.png$/, loader: 'url-loader?limit=100000' },
            { test: /\.jpg$/, loader: 'file-loader' },
            { test: /\.(woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }
        ]
    }
}
;