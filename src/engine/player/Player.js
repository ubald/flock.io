"use strict";

export default class Player {

    /**
     * Player Id
     * @type {int}
     * @protected
     */
    _id = null;
    
    get id() {
        return this._id;
    }


    /**
     * Game
     * @type {Game}
     * @protected
     */
    _game = null;

    /**
     * Create a new PLayer
     * @param {Object} options
     * @param {int} options.id
     * @param {Game} options.game
     */
    constructor(options) {
        this._id = options.id;
        this._game = options.game;
    }

    /**
     * Initialise
     */
    initialize() {
        
    }

    /**
     * Update
     */
    update() {
        
    }

    /**
     * Dispose
     */
    dispose() {

    }
}