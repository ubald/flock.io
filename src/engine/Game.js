"use strict";

import CANNON from "cannon";
import Messages from "./network/Messages";

/*if ( __SERVER__ ) {
 var Input = require( "./input/InputServer" ).default;
 } else */
if ( __CLIENT__ ) {
    var Input = require( "./input/InputClient" ).default;
}

export default class Game {

    initialized  = false;
    beforeUpdate = null;
    afterUpdate  = null;
    playerClass  = null;
    players      = {};
    state        = {};

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

        // Renderer
        this.renderer     = options.renderer;
        this.beforeUpdate = options.beforeUpdate;
        this.afterUpdate  = options.afterUpdate;

        // Loop parameters
        this.fps        = 60.0;
        this.tickLength = 1e3 / this.fps;

        if ( __CLIENT__ ) {
            // Input
            this._input = new Input( this );
        }
    }

    /**
     * Input
     * @returns {Input}
     */
    /*get input() {
     return this._input;
     }*/

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
     * Game Server
     * @returns {Server}
     */
    get server() {
        return this._server;
    }

    /**
     * Game Client
     * @returns {Client}
     */
    get client() {
        return this._client;
    }

    /**
     * Initialize the game
     */
    initialize() {
        if ( this._initialized ) {
            return;
        }

        if ( __SERVER__ ) {
            this._server = new (require( './network/Server' ).default)( {
                game:        this,
                port:        4000,
                playerClass: this.playerClass
            } );
            this._server.listen();
        } else if ( __CLIENT__ ) {
            this._client = new (require( './network/Client' ).default)( {
                game:        this,
                port:        4000,
                playerClass: this.playerClass
            } );
            this._client.connect();
        }

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

        if ( Game._hrTime() - this.previousTick < this.tickLength - 16000 ) {
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

                // Input
                if ( __SERVER__ ) {
                    Object.values( this.players ).forEach( player => player.update() )
                } else if ( __CLIENT__ ) {
                    this._input.update();
                }

                if ( __CLIENT__ ) {
                    const bodies    = this._scene.physics.bodies;
                    const bodyCount = this._scene.physics.numObjects();
                    const DYNAMIC   = CANNON.Body.DYNAMIC;
                    for ( let i = 0; i !== bodyCount; i++ ) {
                        const bi = bodies[i];
                        const s  = this.state[bi.__id];
                        if ( bi.type & DYNAMIC && s ) { // Only for dynamic bodies
                            bi.position.set( s[0] / 1000, s[1] / 1000, s[2] / 1000 );
                            bi.quaternion.set( s[3] / 1000, s[4] / 1000, s[5] / 1000, s[6] / 1000 );
                        }
                    }
                }

                // Scene Update
                this._scene.update( dt );

                // Network
                if ( __SERVER__ ) {
                    const bodies    = this._scene.physics.bodies;
                    const bodyCount = this._scene.physics.numObjects();
                    const DYNAMIC   = CANNON.Body.DYNAMIC;
                    let state       = {
                        i: [],
                        d:null
                    };
                    let values = [];
                    //let state = {};
                    for ( let i = 0; i !== bodyCount; i++ ) {
                        const bi = bodies[i];
                        if ( bi.type & DYNAMIC ) { // Only for dynamic bodies
                            const position = bi.position.toArray().map( a => Math.round( a * 1000 ) );
                            const quaternion = bi.quaternion.toArray().map( a => Math.round( a * 1000 ) );
                            state.i.push(bi.__id);
                            values = values.concat(position, quaternion);
                            //state[bi.__id] = position.concat( quaternion );
                        }
                    }
                    var buffer = new ArrayBuffer(values.length*2); //16bit
                    var dv = new DataView(buffer, 0);
                    for ( var i = 0; i<values.length; i++) {
                        dv.setInt16( i*2, values[i] );
                    }
                    state.d = buffer;
                    this._server.io.emit( Messages.STATE, state );
                    //this._server.io.emit( Messages.STATE, state );

                } else if ( __CLIENT__ ) {
                    // Renderer
                    this.renderer.render( this._scene );
                }

            }

            if ( this.afterUpdate ) {
                this.afterUpdate();
            }
        }
        this.lastTime = time;
    }

    addPlayer( player ) {
        this.players[player.id] = player;
        if ( this._scene && this._scene.initialized ) {
            this._scene.addPlayer( player );
        }
    }

    removePlayer( player ) {
        if ( this._scene && this._scene.initialized ) {
            this._scene.removePlayer( player );
        }
        delete this.players[player.id];
    }
}