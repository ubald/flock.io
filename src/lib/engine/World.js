"use strict";

import Id from "./Id";

import CANNON from "cannon";
import THREE from "three";

export default class World extends Id {
    constructor( name ) {
        super( name );

        this.fps           = 60.0;
        this.tickLength    = 1e3 / this.fps;
        this.fixedTimeStep = 1.0 / this.fps; // seconds
        this.maxSubSteps   = 3;

        this.world = new CANNON.World();
        this.world.gravity.set(0, 0, -9.82); // m/s²

        if ( CLIENT ) {
            this.renderer = new THREE.WebGLRenderer({antialias: true});
            this.renderer.setPixelRatio( window.devicePixelRatio );

            this.domeScene = new THREE.Scene();

            //this.camera = new THREE.PerspectiveCamera( 2, 1 /* temporary value */, 1, 10000 );
            this.camera = new THREE.OrthographicCamera( -200, 200, 200, -200, 1, 100000 );
            this.camera.position.x = 0;
            this.camera.position.y = 0;
            this.camera.position.z = 0;
            this.camera.rotation.x = Math.PI / 2;
            this.domeScene.add(this.camera);

            this.cubeCamera = new THREE.CubeCamera(1, 100000, 4096);
            this.cubeCamera.position.x = 0;
            this.cubeCamera.position.y = 0;
            this.cubeCamera.position.z = 0;
            this.domeGeometry = new THREE.SphereGeometry( 200, 32, 32, 0, Math.PI*2, 0, Math.PI/2 /* TODO: DOME ANGLE */);
            this.domeGeometry.uvsNeedUpdate = true;
            this.domeMaterial = new THREE.MeshBasicMaterial( {
                envMap: this.cubeCamera.renderTarget.texture,
                side: THREE.DoubleSide
            } );
            this.domeMesh = new THREE.Mesh( this.domeGeometry, this.domeMaterial );
            //this.domeMesh.scale.y = -1;

            //this.scene.add( this.cubeCamera );
            this.domeScene.add( this.domeMesh );

            //
        }

        if ( 'undefined' != typeof requestAnimationFrame ) {
            this._requestAnimationFrameLoop = this._requestAnimationFrameLoop.bind(this);
            this._requestAnimationFrameLoop();
        } else {
            this.previousTick = this._hrTime();
            this._intervalLoop = this._intervalLoop.bind(this);
            this._intervalLoop();
        }
    }

    get simulationOnly() {
        return this._simulationOnly;
    }

    get scene() {
        return this._scene;
    }

    set scene( scene ) {
        if ( this._scene ) {
            this._scene.destroy();
        }

        this._scene = scene;

        if ( this._scene ) {
            this._scene.world = this;
            this._scene.init();
        }
    }

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

            // Physics
            this.world.step( this.fixedTimeStep, dt, this.maxSubSteps );

            // Scene
            this.scene.update();

            // 3D
            if ( CLIENT ) {
                this.cubeCamera.updateCubeMap( this.renderer, this.scene.scene );
                this.renderer.render( this.domeScene, this.camera );
            }
        }
        this.lastTime = time;
    }

    update() {
        if ( this._scene ) {
            this._scene.update();
        }
    }
}