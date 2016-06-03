'use strict';

import express from 'express';
import preprocess from 'preprocess';
import path from 'path';

const app = express();

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

/**
 * Start Web Server
 */
app.listen( 3000, function () {
    console.log( 'Flock.io listening on port 3000!' );
} );


import World from "./lib/engine/World";
import TestScene from "./lib/scenes/TestScene";

const world = new World();
world.scene = new TestScene();