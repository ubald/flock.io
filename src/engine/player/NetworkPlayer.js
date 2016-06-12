"use strict";

import _ from "lodash";
import Messages from "../network/Messages";
import Player from "./Player";
import Input from "../input/InputServer";
import BufferWrapper from "../serializers/BufferWrapper";
import ControlSerializer from "../serializers/ControlSerializer";

export default class NetworkPlayer extends Player {

    static ID = 0;

    /**
     * Socket
     * @type {WebSocket}
     * @protected
     */
    _socket = null;

    get socket() {
        return this._socket;
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
        this._socket = options.socket;
        this._socket.on( 'close', this._onClose.bind( this ) );
        this._socket.on( 'error', this._onError.bind( this ) );
        this._socket.on( 'message', this._onMessage.bind( this ) );
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

    dispose() {
        super.dispose();

        this._socket.close();
    }

    /**
     * Send a message on the socket
     *
     * @param message
     * @param options
     */
    send( message, options = {} ) {
        if ( options.binary ) {
            this._socket.send( message, options );
        } else {
            this._socket.send( JSON.stringify( message ), options );
        }
    }

    /**
     * Socket close handler
     *
     * @protected
     */
    _onClose() {
        this._game.removePlayer( this );
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
            } catch (e) {
                console.warn(e);
                return;
            }
            switch ( message.m ) {
                default:
                    break;
            }
        } else {
            const buffer   = new BufferWrapper( data );
            const type = buffer.readInt8( );
            switch ( type ) {
                case Messages.CONTROLS:
                    this._input.state = ControlSerializer.deserialize(buffer);
                    break;
            }
        }
    }
}