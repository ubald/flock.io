"use strict";

import Messages from "./Messages";

if ( __SERVER__ ) {
    var Input = require( "../input/InputServer" ).default;
}/* else if ( __CLIENT__ ) {
    var Input = require( "./input/InputClient" ).default;
}*/

export default class Player {

    static ID = 0;

    /**
     * Player Id
     * @type {int}
     * @private
     */
    _id = null;

    constructor( { id, hero, game, socket } ) {
        this._id = id || Player.ID++;
        this._hero = hero;
        this.game   = game;
        this.socket = socket;

        if ( __SERVER__ ) {
            // Input
            this._input = new Input( this );

            this.socket.on( Messages.CONTROLS, this._onControls.bind( this ) );
            this.socket.emit( Messages.SELF_ADDED, { id: this._id } );
        }
    }

    /**
     * Get Player Id
     * @returns {int}
     */
    get id() {
        return this._id;
    }

    /**
     * Is this player the hero
     * @returns {Boolean}
     */
    get hero() {
        return this._hero;
    }

    /**
     * Input
     * @returns {Input}
     */
    get input() {
        return this._input;
    }

    /**
     * Update
     */
    update() {
        if ( __SERVER__ ) {
            this._input.update();
        }
    }
    
    /**
     * Dispose of the player
     */
    dispose() {
        //
    }

    _onControls(state) {
        this._input._controllers = state;
    }
}