"use strict";

import WebSocket, {Server as WebSocketServer} from "ws";
import NetworkPlayer from "../player/NetworkPlayer";

export default class Server {

    constructor( { game, port } ) {
        this.game        = game;
        this.port        = port;
    }

    listen() {
        this.ws = new WebSocketServer( { port: this.port } );
        this.ws.on( 'connection', this._onConnection.bind( this ) );
        this.ws.on( 'error', this._onError.bind( this ) );
    }

    _onConnection( socket ) {
        this.game.addPlayer( new NetworkPlayer( { game: this.game, socket } ) );
    }

    _onError( error ) {
        console.error( error );
    }

    broadcast( message, options = {}, skip = null ) {
        options = options || {};
        this.ws.clients.forEach( client => {
            if ( client.readyState == WebSocket.OPEN && ( !skip || skip != client ) ) {
                if ( options.binary ) {
                    client.send( message, options );
                } else {
                    client.send( JSON.stringify( message ), options );
                }
            }
        } );
    }
}