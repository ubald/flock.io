var gulp             = require( 'gulp' );
var gutil            = require( "gulp-util" );
var webpack          = require( 'webpack' );
var path             = require( 'path' );
var fs               = require( 'fs' );
var nodemon          = require( 'nodemon' );
var WebpackDevServer = require( 'webpack-dev-server' );

var clientConfig = require( './webpack.config.client' );
var serverConfig = require( './webpack.config.server' );

function onBuild( done ) {
    return function ( err, stats ) {
        if ( err ) {
            throw new gutil.PluginError( "webpack", err );
        }
        gutil.log( "[webpack]", stats.toString( {
            colors: true
        } ) );
        if ( done ) {
            done();
        }
    }
}

gulp.task( 'frontend-build', function ( done ) {
    clientConfig.plugins = clientConfig.plugins.concat(
        new webpack.DefinePlugin( {
            "process.env": {
                "NODE_ENV": JSON.stringify( "production" )
            }
        } ),
        new webpack.optimize.UglifyJsPlugin()
    );
    webpack( clientConfig ).run( onBuild( done ) );
} );

gulp.task( 'frontend-watch', function () {
    //webpack(frontendConfig).watch(100, onBuild());
    clientConfig.debug = true;
    clientConfig.entry.unshift("webpack-dev-server/client?http://localhost:3001/", "webpack/hot/dev-server");
    clientConfig.output.publicPath = "http://localhost:3001" + clientConfig.output.publicPath;
    clientConfig.plugins           = clientConfig.plugins.concat(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin( {
            "process.env": {
                "NODE_ENV": JSON.stringify( "development" )
            }
        } )
    );

    new WebpackDevServer( webpack( clientConfig ), {
        publicPath: clientConfig.output.publicPath,
        hot:        true,
        stats:      {
            colors: true
        }
    } ).listen( 3001, 'localhost', function ( err, result ) {
        if ( err ) {
            throw new gutil.PluginError( "webpack-dev-server", err );
        }
        gutil.log( "[webpack-dev-server]", "http://localhost:3001/" );
    } );

} );

gulp.task( 'backend-build', function ( done ) {
    serverConfig.plugins = serverConfig.plugins.concat(
        new webpack.DefinePlugin( {
            "process.env": {
                "NODE_ENV": JSON.stringify( "production" )
            }
        } ),
        new webpack.optimize.UglifyJsPlugin()
    );
    webpack( serverConfig ).run( onBuild( done ) );
} );

gulp.task( 'backend-watch', function ( done ) {
    serverConfig.debug   = true;
    serverConfig.plugins = serverConfig.plugins.concat(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin( {
            "process.env": {
                "NODE_ENV": JSON.stringify( "development" )
            }
        } )
    );

    var firedDone = false;
    webpack( serverConfig ).watch( 100, function ( err, stats ) {
        if ( !firedDone ) {
            firedDone = true;
            done();
        }

        nodemon.restart();
    } );
} );

gulp.task( 'build', ['frontend-build', 'backend-build'] );
gulp.task( 'watch', ['frontend-watch', 'backend-watch'] );

gulp.task( 'run', ['backend-watch', 'frontend-watch'], function () {
    nodemon( {
        execMap: {
            js: 'node'
        },
        script:  path.join( __dirname, 'build/server' ),
        ignore:  ['*']
    } ).on( 'restart', function () {
        console.log( 'Patched!' );
    } );
} );