"use strict";

import Game from "./Game";
import Server from "./network/Server";
import Messages from "./network/Messages";
import StateSerializer from "./serializers/StateSerializer";

export default class GameServer extends Game {

    /**
     * Server
     * @type {Server}
     */
    server = null;
    
    constructor( options = {} ) {
        super( options );
    }
    
    _init() {
        super._init();
        
        // Server
        this.server = new Server( {
            game:        this,
            port:        4000
        } );
        this.server.listen();
    }
    
    preUpdate() {
        super.preUpdate();

        Object.values( this.players ).forEach( player => player.update() );
    }
    
    postUpdate() {
        super.postUpdate();
        
        const state = StateSerializer.serialize( this );
        this.server.broadcast( state, { binary: true } );
    }

    addPlayer(player) {
        super.addPlayer(player);
        this.server.broadcast( { m: Messages.PLAYER_ADDED, id: player.id }, null, player.socket );
    }

    removePlayer(player) {
        super.removePlayer(player);
        this.server.broadcast( { m: Messages.PLAYER_REMOVED, id: player.id }, null, player.socket );
    }
}