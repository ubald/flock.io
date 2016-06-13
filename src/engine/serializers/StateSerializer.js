"use strict";

import CANNON from "cannon";
import Messages from "../network/Messages";
import DataViewWrapper from "./DataViewWrapper";

/*export class StateSerializer {

    static serialize( game ) {
        const bodies    = game.scene.physics.bodies;
        const bodyCount = game.scene.physics.numObjects();
        const DYNAMIC   = CANNON.Body.DYNAMIC;
        let state       = {};
        for ( let i = 0; i !== bodyCount; i++ ) {
            const bi = bodies[i];
            if ( bi.type & DYNAMIC ) { // Only for dynamic bodies
                const position   = bi.position.toArray().map( a => Math.round( a * 1000 ) );
                const quaternion = bi.quaternion.toArray().map( a => Math.round( a * 1000 ) );
                state[bi.__id]   = position.concat( quaternion );
            }
        }
        return state;
    }

    static deserialize( state, game ) {
        const bodies    = game.scene.physics.bodies;
        const bodyCount = game.scene.physics.numObjects();
        const DYNAMIC   = CANNON.Body.DYNAMIC;
        for ( let i = 0; i !== bodyCount; i++ ) {
            const bi = bodies[i];
            const s  = state[bi.__id];
            if ( bi.type & DYNAMIC && s ) { // Only for dynamic bodies
                bi.position.set( s[0] / 1000, s[1] / 1000, s[2] / 1000 );
                bi.quaternion.set( s[3] / 1000, s[4] / 1000, s[5] / 1000, s[6] / 1000 );
            }
        }
    }

}*/

export default class BinaryStateSerializer {

    static serialize( game ) {
        const bodies    = game.scene.physics.bodies;
        const bodyCount = game.scene.physics.numObjects();
        const STATIC   = CANNON.Body.STATIC;

        const ids     = [];
        let idsLength = 0;
        let values    = [];

        for ( let i = 0; i !== bodyCount; i++ ) {
            const bi = bodies[i];
            if ( bi.type != STATIC ) { // Only for dynamic/kinematic bodies
                const position   = bi.position.toArray().map( a => Math.round( a * 1000 ) );
                const quaternion = bi.quaternion.toArray().map( a => Math.round( a * 1000 ) );
                ids.push( bi.__id );
                idsLength += bi.__id.length;
                values = values.concat( position, quaternion );
            }
        }
        const idCount = ids.length;

        const messageLength = 1 + 2 + idCount + idsLength * 2 + 2 + values.length * 2;
        const buffer        = new ArrayBuffer( messageLength ); //16bit
        const dv            = new DataViewWrapper( buffer );
        
        // Message Type
        dv.writeUint8( Messages.STATE );

        // Number of ids
        dv.writeUint16( ids.length );

        // Ids
        ids.forEach( id => {
            const idLength = id.length;
            dv.writeUint8( idLength );
            for ( var i = 0; i < idLength; i++ ) {
                dv.writeUint16( id.charCodeAt( i ) );
            }
        } );

        // Values
        const valueCount = values.length;
        dv.writeUint8( valueCount / idCount );
        for ( var v = 0; v < valueCount; v++ ) {
            dv.writeInt16( values[v] );
        }

        return buffer;
    }

    static deserialize( dv, game ) {

        // Ids
        const ids       = [];
        const idData    = {};
        const idsLength = dv.readUint16();
        for ( var i = 0; i < idsLength; i++ ) {
            let id         = "";
            const idLength = dv.readUint8();
            for ( var j = 0; j < idLength; j++ ) {
                id += String.fromCharCode( dv.readInt16() );
            }
            ids.push( id );
            idData[id] = [];
        }

        // Values
        const valueCount = dv.readUint8();
        ids.forEach( id => {
            const values = idData[id];
            for ( var v = 0; v < valueCount; v++ ) {
                values.push( dv.readInt16() );
            }
        } );

        const bodies    = game.scene.physics.bodies;
        const bodyCount = game.scene.physics.numObjects();
        const STATIC   = CANNON.Body.STATIC;

        for ( let i = 0; i !== bodyCount; i++ ) {
            const bi = bodies[i];
            const s  = idData[bi.__id];
            if ( bi.type != STATIC && s ) { // Only for dynamic/kinematic bodies
                bi.position.set( s[0] / 1000, s[1] / 1000, s[2] / 1000 );
                bi.quaternion.set( s[3] / 1000, s[4] / 1000, s[5] / 1000, s[6] / 1000 );
            }
        }
    }

}