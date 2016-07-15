'use strict';

import THREE from "three";
//import GPUParticleSystem from "../../client/GPUParticlesSystem";
import Bird from "./Bird";
import FlightControls from "../components/FlightControls";
import LeashControl from "../components/LeashControl";

export default class PlayerBird extends Bird {

    constructor( name, config ) {
        super( name, config );
        this._player = config.player;
        if ( __SERVER__ ) {
            this.addComponent( new FlightControls( 'flight', {
                alpha: this.density,
                input: this._player.input
            } ) );
            this.addComponent( new LeashControl( 'leash', {
                alpha:  this.density,
                input:  this._player.input,
                radius: this.config.planetGravity.radius
            } ) );
        }
    }

    init() {
        super.init();

        /*if (__CLIENT__) {
            this.particles = new THREE.GPUParticleSystem({
                maxParticles: 250000
            });
            this.scene.stage.add(this.particles);

            // options passed during each spawned
            this.particleOptions = {
                position: new THREE.Vector3(),
                positionRandomness: 0,//.3,
                velocity: new THREE.Vector3(),
                velocityRandomness: 0,//.5,
                color: 0xaa88ff,
                colorRandomness: .2,
                turbulence: 0,//.5,
                lifetime: 2,
                size: 5,
                sizeRandomness: 1
            };

            this.particleSpawnerOptions = {
                spawnRate: 15000,
                timeScale: 1
            }
        }*/
    }

    createMesh() {
        this.material = this.material || new THREE.MeshLambertMaterial( { color: 0xEE1010 } );
        super.createMesh();
    }

    dispose() {
        //this.scene.stage.remove(this.particles);
        super.dispose();
    }

    //tick = 0;
    update(dt) {
        super.update(dt);

        /*if (__CLIENT__) {
            this.particleOptions.position.copy(this._body.position);
            //this.particles.position.copy( this._body.position );
            //this.particles.quaternion.copy( this._body.quaternion );
            for ( var x = 0; x < this.particleSpawnerOptions.spawnRate * dt; x++ ) {
                // Yep, that's really it.	Spawning particles is super cheap, and once you spawn them, the rest of
                // their lifecycle is handled entirely on the GPU, driven by a time uniform updated below
                this.particles.spawnParticle( this.particleOptions );
            }

            this.tick += dt;
            this.particles.update( this.tick );
        }*/
    }

}