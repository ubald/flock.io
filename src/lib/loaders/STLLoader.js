"use strict";

import THREE from "three";
import "three/examples/js/loaders/STLLoader";

const loader = new THREE.STLLoader;

if ( __SERVER__ ) {
    var fs = require( "fs" );
}

export default class STLLoader {

    static requests = {};
    static cache    = {};

    static load( stl, cb ) {
        if ( STLLoader.cache[stl] ) {
            cb( STLLoader.cache[stl] );

        } else if ( STLLoader.requests[stl] ) {
            STLLoader.requests[stl].push( cb );
        } else {
            STLLoader.requests[stl] = [cb];

            if ( __CLIENT__ ) {
                loader.load( stl, g => {
                    STLLoader.cache[stl] = g;
                    STLLoader.notify( stl, g );
                } );
            } else {
                const buffer = fs.readFileSync( 'public/' + stl );
                var ab       = new ArrayBuffer( buffer.length );
                var view     = new Uint8Array( ab );
                for ( var i = 0; i < buffer.length; ++i ) {
                    view[i] = buffer[i];
                }
                const g              = loader.parse( ab );
                STLLoader.cache[stl] = g;
                STLLoader.notify( stl, g );
            }
        }
    }

    static notify( stl, g ) {
        g.computeBoundingBox();
        g.computeBoundingSphere();
        STLLoader.requests[stl].forEach( cb => cb( g ) );
        delete STLLoader.requests[stl];
    }

}