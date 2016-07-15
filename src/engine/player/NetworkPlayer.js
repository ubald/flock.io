"use strict";

import _ from "lodash";
import Messages from "../network/Messages";
import Player from "./Player";
import Input from "../input/InputServer";
import ControlSerializer from "../serializers/ControlSerializer";

export default class NetworkPlayer extends Player {

    static ID = 0;

    /**
     * Game
     * @type {GameServer}
     * @protected
     */
    _game = null;

    get game() {
        return this._game;
    }

    /**
     * Socket
     * @type {ServerClient}
     * @protected
     */
    _client = null;

    get client() {
        return this._client;
    }

    /**
     * Input
     * @type {Input}
     * @private
     */
    _input = null;

    get input() {
        return this._input;
    }

    /**
     * @inheritdoc
     * @param {WebSocket} options.socket
     */
    constructor( options ) {
        super( _.defaults( { id: NetworkPlayer.ID++ }, options ) );
        this._input  = new Input( this );
        this._client = options.client;
        this._game = options.game;
    }

    /**
     * @inheritdoc
     */
    initialize() {
        super.initialize();

        // Send self to client
        this.send( { m: Messages.SELF_ADDED, id: this._id } );

        // Send current players to client
        for ( var id in this._game.players ) {
            if ( id != this._id ) {
                this.send( { m: Messages.PLAYER_ADDED, id } );
            }
        }
    }

    /**
     * @inheritdoc
     */
    update() {
        super.update();

        this._input.update();
    }

    /**
     * Send a message on the socket
     *
     * @param message
     * @param options
     */
    send( message, options = {} ) {
        if ( options.binary ) {
            this._client.socket.send( message, options );
        } else {
            this._client.socket.send( JSON.stringify( message ), options );
        }
    }

    /**
     * Socket message handler
     *
     * @param {String} type
     * @param {BufferWrapper} buffer
     */
    onMessage( type, buffer ) {
        switch ( type ) {
            case Messages.CONTROLS:
                this._input.state = ControlSerializer.deserialize( buffer );
                break;
        }
    }
}