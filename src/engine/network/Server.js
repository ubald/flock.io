"use strict";

import SocketIo from "socket.io";
import Messages from "./Messages";

export default class Server {

    constructor( { game, port, playerClass } ) {
        this.game        = game;
        this.port        = port;
        this.playerClass = playerClass;
    }

    listen() {
        this.io = new SocketIo( this.port, { serveClient: false } );
        this.io.on( 'connection', this._onConnection.bind( this ) );
    }

    _onConnection( socket ) {
        console.log( 'Adding client', socket.id );

        const player = new this.playerClass( { game: this.game, socket } );

        socket.on( 'disconnect', this._onDisconnect.bind( this, player ) );

        // Send current player to client
        for ( var id in this.game.players ) {
            socket.emit( Messages.PLAYER_ADDED, { id } );
        }
        // Send self to client
        socket.broadcast.emit( Messages.PLAYER_ADDED, { id: player.id } );

        // Save player
        this.game.addPlayer( player );
    }

    _onDisconnect( player ) {
        console.log( 'Removing client', player.socket.id );

        this.game.removePlayer( player );
        player.dispose();

        this.io.emit( Messages.PLAYER_REMOVED, { id: player.id } );
    }
}