'use strict';

import express from "express";
import http from "http";
import socketIo from "socket.io";
import preprocess from "preprocess";
import path from "path";
import World from "./lib/engine/World";
import DomeSkyScene from "./lib/scenes/DomeSkyScene";

const app    = express();
const server = http.createServer( app );
const io     = socketIo( server );

/**
 * Setup Socket.io
 */
io.on( 'connection', function ( socket ) {
    //console.log(socket);
} );

/**
 * Start Web Server
 */
server.listen( 3000, function () {
    console.log( 'Flock.io listening on port 3000!' );
} );

/**
 * Index Page
 */
app.get( '/', function ( req, res ) {
    res.set( {
        'Cache-Control': 'no-cache'
    } );
    res.send( preprocess.preprocess( require( './index.html' ) ) );
} );

/**
 * Public Stuff
 */
app.use( '/', express.static( path.join( path.dirname( __dirname ), 'public' ) ) );

const world = new World( 'flock.io', { io } );
world.scene = new DomeSkyScene();