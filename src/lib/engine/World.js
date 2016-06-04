"use strict";

import Id from "./Id";

/**
 * Game World
 */
export default class World extends Id {

    /**
     * Create a game world
     *
     * @param {String} name
     * @param {Object} options - Options
     * @param {Renderer} options.renderer - Renderer class to use for rendering the current scene
     * @param {Function} options.beforeUpdate - Callback used before updating the world
     * @param {Function} options.afterUpdate - Callback used after updating the world
     */
    constructor( name, options = {} ) {
        super( name );

        // Options
        this.options = options;

        // Renderer
        this.renderer = options.renderer;

        // Loop parameters
        this.fps        = 60.0;
        this.tickLength = 1e3 / this.fps;

        // Loop
        if ( 'undefined' != typeof requestAnimationFrame ) {
            // Browser, use requestAnimationFrame
            this._requestAnimationFrameLoop = this._requestAnimationFrameLoop.bind( this );
            this._requestAnimationFrameLoop();
        } else {
            // Server, use interval
            this.previousTick  = World._hrTime();
            this._intervalLoop = this._intervalLoop.bind( this );
            this._intervalLoop();
        }
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
            this._scene.destroy();
        }

        this._scene = scene;

        if ( this._scene ) {
            this._scene.init( this );
        }
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
        let time = World._hrTime();
        if ( this.previousTick + this.tickLength <= time ) {
            this.previousTick = time;
            this.loop( time );
        }

        if ( World._hrTime() - this.previousTick < this.tickLength - 16000 ) {
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

            if ( this.options.beforeUpdate ) {
                this.options.beforeUpdate();
            }

            // Only render when we have an active scene
            if ( this.scene ) {

                // Scene Update
                this.scene.update( dt );

                // Renderer
                if ( this.renderer ) {
                    this.renderer.render( this.scene );
                }

            }

            if ( this.options.afterUpdate ) {
                this.options.afterUpdate();
            }
        }
        this.lastTime = time;
    }
}