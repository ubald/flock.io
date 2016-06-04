'use strict';

import express from 'express';
import http from 'http';
import socketIo from 'socket.io';
import preprocess from 'preprocess';
import path from 'path';
import World from './lib/engine/World';
import TestScene from './lib/scenes/TestScene';

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

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
    res.send( preprocess.preprocess( require( './index.html' ) ) );
} );

/**
 * Public Stuff
 */
app.use( '/', express.static( path.join( path.dirname( __dirname ), 'public' ) ) );


io.on( 'connection', function ( socket ) {
    //console.log(socket);
} );

const world = new World( 'flock.io' );
world.scene = new TestScene();