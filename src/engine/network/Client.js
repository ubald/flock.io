"use strict";

import SocketIo from "socket.io-client";
import Messages from "./Messages";

export default class Client {

    _id = null;

    constructor( { game, port, playerClass } ) {
        this.game        = game;
        this.port        = port;
        this.playerClass = playerClass;
    }

    get id() {
        return this._id;
    }

    get socket() {
        return this._socket;
    }

    connect() {
        this._socket = SocketIo.connect( `:${this.port}` );
        this._socket.on( 'connect', this._onConnect.bind( this ) );
        this._socket.on( Messages.SELF_ADDED, this._onSelfAdded.bind( this ) );
        this._socket.on( Messages.PLAYER_ADDED, this._onPlayerAdded.bind( this ) );
        this._socket.on( Messages.PLAYER_REMOVED, this._onPlayerRemoved.bind( this ) );
        this._socket.on( Messages.STATE, this._onState.bind( this ) );
    }

    _onConnect() {

    }

    _onSelfAdded( { id } ) {
        this._id     = id;
        const player = new this.playerClass( { id, hero: true, game: this.game, socket: this._socket } );
        this.game.addPlayer( player );
    }

    _onPlayerAdded( { id } ) {
        const player = new this.playerClass( { id, game: this.game, socket: this._socket } );
        this.game.addPlayer( player );
    }

    _onPlayerRemoved( { id } ) {
        const player = this.game.players[id];
        if ( player ) {
            this.game.removePlayer( player );
        }
    }

    _onState( data ) {
        let state = {};
        const bv  = new DataView( data.d );
        let s     = 0;
        for ( var i = 0; i < data.i.length; i++ ) {
            const id  = data.i[i];
            state[id] = [];
            for ( var j = 0; j < 7; j++ ) {
                state[id][j] = bv.getInt16( s );
                s += 2;
            }
        }
        this.game.state = state;
    }

}