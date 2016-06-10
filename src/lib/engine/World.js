'use strict';

import Id from "./Id";
import CANNON from "cannon";

if ( __CLIENT__ ) {
    var Input = require( "./InputClient" ).default;
} else {
    var Input = require( "./InputServer" ).default;
}

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

        // Network
        this.io = options.io;

        if ( __SERVER__ ) {
            this.io.on( 'connection', socket => {
                socket.on( 0x02, state => {
                    this._input._controllers = state
                } );
            } )
        }

        // Renderer
        this.renderer = options.renderer;

        // Input
        this._input = new Input( this );

        // Loop parameters
        this.fps        = 60.0;
        this.tickLength = 1e3 / this.fps;

        if ( __CLIENT__ ) {
            this.io.on( 0x01, state => {
                const bodies    = this._scene.physics.bodies;
                const bodyCount = this._scene.physics.numObjects();
                const DYNAMIC   = CANNON.Body.DYNAMIC;
                for ( let i = 0; i !== bodyCount; i++ ) {
                    const bi = bodies[i];
                    const s  = state[bi.id];
                    if ( bi.type & DYNAMIC && s ) { // Only for dynamic bodies
                        bi.position.set( s.p[0] / 100, s.p[1] / 100, s.p[2] / 100 );
                        bi.quaternion.set( s.o[0] / 100, s.o[1] / 100, s.o[2] / 100, s.o[3] / 100 );
                    }
                }
            } );
        }

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
     * Input
     * @returns {Input}
     */
    get input() {
        return this._input;
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

        if ( this._scene ) {
            this._scene.initialize( this );
        }
    }

    setSize( width, height ) {
        if ( this.renderer ) {
            this.renderer.setSize( width, height );
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
            if ( this._scene ) {

                // Input
                if ( this._input ) {
                    this._input.update();
                }

                // Scene Update
                this._scene.update( dt );

                if ( __SERVER__ ) {
                    const bodies    = this._scene.physics.bodies;
                    const bodyCount = this._scene.physics.numObjects();
                    const DYNAMIC   = CANNON.Body.DYNAMIC;
                    const io        = this.options.io;
                    let state       = {};
                    for ( let i = 0; i !== bodyCount; i++ ) {
                        const bi = bodies[i];
                        if ( bi.type & DYNAMIC ) { // Only for dynamic bodies
                            state[bi.id] = {
                                p: bi.position.toArray().map( a => (a * 100).toFixed( 2 ) ),
                                o: bi.quaternion.toArray().map( a => (a * 100).toFixed( 2 ) )
                            }
                        }
                    }
                    io.emit( 0x01, state )
                }

                // Renderer
                if ( this.renderer ) {
                    this.renderer.render( this._scene );
                }

            }

            if ( this.options.afterUpdate ) {
                this.options.afterUpdate();
            }
        }
        this.lastTime = time;
    }

    /*buttonPressed( controller, button, value ) {
     if ( this._scene ) {
     this._scene.buttonPressed( controller, button, value );
     }
     }

     buttonReleased( controller, button, value ) {
     if ( this._scene ) {
     this._scene.buttonReleased( controller, button, value );
     }
     }

     buttonDown( controller, button, value ) {
     if ( this._scene ) {
     this._scene.buttonDown( controller, button, value );
     }
     }

     axisChanged( controller, axis, value ) {
     if ( this._scene ) {
     this._scene.axisChanged( controller, axis, value );
     }
     }*/
}