"use strict";

import Id from "./Id";

import CannonWorld from "cannon/world/World"

export default class World extends Id {
    constructor( name ) {
        super( name );

        this._inited = false;

        this.fps           = 60.0;
        this.tickLength    = 1e3 / this.fps;
        this.fixedTimeStep = 1.0 / this.fps; // seconds
        this.maxSubSteps   = 3;

        this.world = new CannonWorld();
        this.world.gravity.set(0, 0, -9.82); // m/s²

        if ( 'undefined' != typeof requestAnimationFrame ) {
            this._requestAnimationFrameLoop = this._requestAnimationFrameLoop.bind(this);
            this._requestAnimationFrameLoop();
        } else {
            this.previousTick = this._hrTime();
            this._intervalLoop = this._intervalLoop.bind(this);
            this._intervalLoop();
        }
    }

    /*get inited() {
     return this._inited;
     }*/

    get scene() {
        return this._scene;
    }

    set scene( scene ) {
        if ( this._scene ) {
            this._scene.destroy();
        }

        this._scene = scene;

        if ( this._scene ) {
            this._scene.init();
        }
    }

    /*init() {
     this._inited = true;
     }*/

    _requestAnimationFrameLoop( time ) {
        requestAnimationFrame( this._requestAnimationFrameLoop );
        this.loop( time );
    }

    _hrTime() {
        const hrTime = process.hrtime();
        return hrTime[0] * 1e3 + hrTime[1] * 1e-6;
    }

    _intervalLoop() {
        let time   = this._hrTime();
        if ( this.previousTick + this.tickLength <= time ) {
            this.previousTick = time;
            this.loop( time );
        }

        if ( this._hrTime() - this.previousTick < this.tickLength - 16000 ) {
            setTimeout( this._intervalLoop );
        } else {
            setImmediate( this._intervalLoop );
        }
    }

    loop( time ) {
        if ( this.lastTime !== undefined ) {
            var dt = (time - this.lastTime) / 1000;
            this.world.step( this.fixedTimeStep, dt, this.maxSubSteps );
        }
        this.lastTime = time;
    }

    update() {
        if ( this._scene ) {
            this._scene.update();
        }
    }
}