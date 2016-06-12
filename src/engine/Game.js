"use strict";

export default class Game {

    initialized  = false;
    beforeUpdate = null;
    afterUpdate  = null;
    players      = {};

    /**
     * Create a game
     *
     * @param {Object} options - Options
     * @param {Renderer} options.renderer - Renderer class to use for rendering the current scene
     * @param {Function} options.beforeUpdate - Callback used before updating the game
     * @param {Function} options.afterUpdate - Callback used after updating the game
     */
    constructor( options = {} ) {
        // Options
        this.options = options;

        this.beforeUpdate = options.beforeUpdate;
        this.afterUpdate  = options.afterUpdate;

        // Loop parameters
        this.fps        = 60.0;
        this.tickLength = 1e3 / this.fps;
    }

    /**
     * Scene
     * @returns {Scene}
     */
    get scene() {
        return this._scene;
    }

    /**
     * @param {Scene} scene
     */
    set scene( scene ) {
        if ( this._scene ) {
            this._scene.dispose();
        }

        this._scene = scene;

        if ( this.initialized && this._scene ) {
            this._scene.initialize( this );
        }
    }

    /**
     * Initialize the game
     */
    initialize() {
        if ( this._initialized ) {
            return;
        }

        this._init();

        if ( this._scene ) {
            this._scene.initialize( this );
        }

        this._initialized = true;

        // Loop
        if ( 'undefined' != typeof requestAnimationFrame ) {
            // Browser, use requestAnimationFrame
            this._requestAnimationFrameLoop = this._requestAnimationFrameLoop.bind( this );
            this._requestAnimationFrameLoop();
        } else {
            // Server, use interval
            this.previousTick  = Game._hrTime();
            this._intervalLoop = this._intervalLoop.bind( this );
            this._intervalLoop();
        }
    }

    _init() {
        //
    }

    /**
     * Request Animation Frame Loop
     * @param {number} time - Time in nanoseconds
     * @private
     */
    _requestAnimationFrameLoop( time ) {
        requestAnimationFrame( this._requestAnimationFrameLoop );
        this.loop( time );
    }

    /**
     * Precise Hardware Time
     * @returns {number}
     * @private
     */
    static _hrTime() {
        const hrTime = process.hrtime();
        return hrTime[0] * 1e3 + hrTime[1] * 1e-6;
    }

    /**
     * Interval Loop
     * @private
     */
    _intervalLoop() {
        let time = Game._hrTime();
        if ( this.previousTick + this.tickLength <= time ) {
            this.previousTick = time;
            this.loop( time );
        }

        // if we are more than 16 milliseconds away from the next tick, use setTimeout
        if ( Game._hrTime() - this.previousTick < this.tickLength - 16 ) {
            setTimeout( this._intervalLoop );
        } else {
            setImmediate( this._intervalLoop );
        }
    }

    /**
     * Update & Render Loop
     * @param {number} time - Time in nanoseconds
     */
    loop( time ) {
        // Don't attempt a first run when it's the first loop
        if ( this.lastTime !== undefined ) {
            var dt = (time - this.lastTime) / 1000;

            if ( this.beforeUpdate ) {
                this.beforeUpdate();
            }

            // Only render when we have an active scene
            if ( this._scene ) {
                this.preUpdate(dt);
                this._scene.update( dt );
                this.postUpdate(dt);
            }

            if ( this.afterUpdate ) {
                this.afterUpdate();
            }
        }
        this.lastTime = time;
    }

    preUpdate() {

    }

    postUpdate() {

    }

    addPlayer( player ) {
        this.players[player.id] = player;
        if ( this._scene && this._scene.initialized ) {
            this._scene.addPlayer( player );
        }
        player.initialize();
    }

    removePlayer( player ) {
        if ( this._scene && this._scene.initialized ) {
            this._scene.removePlayer( player );
        }
        delete this.players[player.id];
        player.dispose();
    }
}