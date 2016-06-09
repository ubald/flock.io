var gulp             = require( 'gulp' );
var gutil            = require( "gulp-util" );
var webpack          = require( 'webpack' );
var path             = require( 'path' );
var fs               = require( 'fs' );
var nodemon          = require( 'nodemon' );
var WebpackDevServer = require( 'webpack-dev-server' );

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
    webpack( require( './webpack/webpack.config.client.production' ) ).run( onBuild( done ) );
} );

gulp.task( 'frontend-watch', function () {
    //webpack(frontendConfig).watch(100, onBuild());
    var config = require( './webpack/webpack.config.client.dev' );

    new WebpackDevServer( webpack( config ), {
        contentBase: './build',
        publicPath:  config.output.publicPath,
        hot:         true,
        progress: true,
        stats:       {
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
    webpack( require('./webpack/webpack.config.server.production') ).run( onBuild( done ) );
} );

gulp.task( 'backend-watch', function ( done ) {
    var config = require('./webpack/webpack.config.server.dev');

    var firedDone = false;
    webpack( config ).watch( 100, function ( err, stats ) {
        if ( !firedDone ) {
            firedDone = true;
            done();
        }
        gutil.log( "[webpack]", stats.toString( {
            colors: true
        } ) );
        nodemon.restart();
    } );
} );

gulp.task( 'build', ['frontend-build', 'backend-build'] );
gulp.task( 'watch', ['frontend-watch', 'backend-watch'] );

gulp.task( 'run', ['watch'], function () {
    nodemon( {
        execMap: {
            js: 'node'
        },
        script:  path.join( __dirname, 'build/server' ),
        ignore:  ['*'],
        watch: ['src/server.js', 'src/server/**/*', 'src/lib/**/*']
    } ).on( 'restart', function () {
        gutil.log( "[nodemon]", "Patched!" );
    } );
} );

/**
 * Gracefully exit when interrupting process
 * Otherwise nodemon hangs and webpack-dev-server keeps running
 */
process.on( 'SIGINT', () => {
    process.exit( 0 );
} );