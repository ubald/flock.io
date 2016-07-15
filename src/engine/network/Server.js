"use strict";

import WebSocket, {Server as WebSocketServer} from "ws";
import BufferWrapper from "../serializers/BufferWrapper";
import NetworkPlayer from "../player/NetworkPlayer";

export class ServerClient {
    constructor( server, socket ) {
        this._server = server;
        this._socket = socket;

        this._socket.on( 'close', this._onClose.bind( this ) );
        this._socket.on( 'error', this._onError.bind( this ) );
        this._socket.on( 'message', this._onMessage.bind( this ) );

        this._player = new NetworkPlayer( { client: this, game: this._server.game } );
        this.server.game.addPlayer( this.player );
    }

    get server() {
        return this._server;
    }

    get socket() {
        return this._socket;
    }

    get player() {
        return this._player;
    }

    /**
     * Socket close handler
     * @protected
     */
    _onClose() {
        this._server.game.removePlayer( this.player );
        this._server.removeClient( this );
        this._socket.close();
    }

    /**
     * Socket error handler
     *
     * @param error
     * @protected
     */
    _onError( error ) {
        console.error( error );
    }

    /**
     * Socket message handler
     *
     * @param data
     * @protected
     */
    _onMessage( data ) {
        //console.log('message', event);
        if ( typeof(data) == "string" ) {
            try {
                var message = JSON.parse( data );
            } catch ( e ) {
                console.warn( e );
                return;
            }
            switch ( message.m ) {
                default:
                    break;
            }
        } else {
            const buffer = new BufferWrapper( data );
            const type   = buffer.readInt8();
            switch ( type ) {
                default:
                    this._player.onMessage( type, buffer );
                    break;
            }
        }
    }
}

export default class Server {

    constructor( { game, port } ) {
        this.game    = game;
        this.port    = port;
        this.clients = {};
    }

    listen() {
        this.ws = new WebSocketServer( { port: this.port } );
        this.ws.on( 'connection', this._onConnection.bind( this ) );
        this.ws.on( 'error', this._onError.bind( this ) );
    }

    _onConnection( socket ) {
        this.addClient( new ServerClient( this, socket ) );
        //this.game.addPlayer( new NetworkPlayer( { game: this.game, socket } ) );
    }

    _onError( error ) {
        console.error( error );
    }

    addClient( client ) {
        this.clients[client.socket.id] = client;
    }

    removeClient( client ) {
        delete this.clients[client.socket.id];
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