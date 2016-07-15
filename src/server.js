'use strict';

import express from "express";
import http from "http";
import preprocess from "preprocess";
import path from "path";
import FlockIo from "./lib/FlockIo";

const app    = express();
const server = http.createServer( app );

/**
 * Start Web Server
 */
server.listen( 3000, function () {
    console.log( 'Flock.io listening on port 3000!' );
} );

/**
 * Public Stuff
 */
app.use( '/', express.static( path.join( path.dirname( __dirname ), 'public' ) ) );

/**
 * Index Page
 */
app.get( '*', function ( req, res ) {
    res.set( {
        'Cache-Control': 'no-cache'
    } );
    res.send( preprocess.preprocess( require( './index.html' ) ) );
} );


const game = new FlockIo();
game.initialize();