"use strict";

import Messages from "./Messages";
import LocalPlayer from "../player/LocalPlayer";
import RemotePlayer from "../player/RemotePlayer";
import DataViewWrapper from "../serializers/DataViewWrapper";

export default class Client {

    _id = null;

    constructor( { game, port = 4000, spectator = false } ) {
        this.game      = game;
        this.port      = port;
        this.spectator = spectator;
    }

    get id() {
        return this._id;
    }

    get socket() {
        return this._socket;
    }

    connect() {
        this.ws            = new WebSocket( `ws://${window.location.hostname}:${this.port}` );
        this.ws.binaryType = "arraybuffer";
        this.ws.onopen     = this._onConnect.bind( this );
        this.ws.onerror    = this._onError.bind( this );
        this.ws.onclose    = this._onClose.bind( this );
        this.ws.onmessage  = this._onMessage.bind( this );
    }

    send( message, options = {} ) {
        if ( this.ws.readyState == WebSocket.OPEN ) {
            if ( options.binary ) {
                this.ws.send( message, options );
            } else {
                this.ws.send( JSON.stringify( message ), options );
            }
        }
    }

    _onConnect( event ) {
        console.log( 'open', event );
    }

    _onError( event ) {
        console.error( 'error', event );
    }

    _onClose( event ) {
        console.log( 'close', event );
    }

    _onMessage( event ) {
        //console.log('message', event);
        const data = event.data;
        if ( typeof(data) == "string" ) {
            const message = JSON.parse( data );
            switch ( message.m ) {
                case Messages.SELF_ADDED:
                    this._onSelfAdded( message );
                    break;
                case Messages.PLAYER_ADDED:
                    this._onPlayerAdded( message );
                    break;
                case Messages.PLAYER_REMOVED:
                    this._onPlayerRemoved( message );
                    break;
            }
        } else {
            const dv   = new DataViewWrapper( data );
            const type = dv.readInt8();
            switch ( type ) {
                case Messages.STATE:
                    this.state = dv;
                    break;
            }
        }
    }

    _onSelfAdded( { id } ) {
        this._id     = id;
        const player = new LocalPlayer( { id, game: this.game, socket: this.ws } );
        this.game.addPlayer( player );
    }

    _onPlayerAdded( { id } ) {
        const player = new RemotePlayer( { id, game: this.game } );
        this.game.addPlayer( player );
    }

    _onPlayerRemoved( { id } ) {
        const player = this.game.players[id];
        if ( player ) {
            this.game.removePlayer( player );
        }
    }

}