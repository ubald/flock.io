"use strict";

import THREE from "three";
import CANNON from "cannon";
import Scene from "../../engine/Scene";
import LocalPlayer from "../../engine/player/LocalPlayer";
import Ground from "./domeSky/Ground";
import Planet from "./domeSky/Planet";
import Pointer from "../entities/Pointer";
import Bird from "../entities/Bird";
import Hero from "../entities/Hero";
import PlayerBird from "../entities/PlayerBird";
import Wander from "../../engine/components/Wander";

export default class DomeSkyScene extends Scene {

    constructor() {
        super();
    }

    /**
     * @inheritdoc
     */
    _init() {
        super._init();

        this.radius = 10;
        this._physics.gravity.set( 0, 0, 0 ); // m/s²

        // Defaults for planet gravity
        this.planetGravity = {
            position: new CANNON.Vec3( 0, 0, 0 ),
            radius:   this.radius
        };

        // Ground
        this.add( new Ground( 'ground' ) );

        // Planet
        this.add( new Planet( 'planet', { radius: this.radius } ) );

        // Birds
        /*for ( var i = 0; i < 100; i++ ) {
            const bird = new Bird( 'bird' + i, {
                planetGravity: this.planetGravity
            } );
            bird.body.position.set(
                (Math.random() - 0.5) * this.radius * 2,
                (Math.random() - 0.5) * this.radius * 2,
                (Math.random() - 0.5) * this.radius * 2
            );
            if ( __SERVER__ ) {
                bird.addComponent( new Wander( 'wander' ) );
            }
            this.add( bird );
        }*/

        if ( __CLIENT__ ) {

            // Top Light
            var topPointLight = new THREE.PointLight( 0xffffff, 1, 100 );
            topPointLight.position.set( 0, 0, this.radius + 5 );
            this.stage.add( topPointLight );
            this.stage.add( new THREE.PointLightHelper( topPointLight, 1 ) );

            // Bottom Light
            var bottomPointLight = new THREE.PointLight( 0xffffff, 1, 100 );
            bottomPointLight.position.set( 0, 0, -5 );
            this.stage.add( bottomPointLight );
            this.stage.add( new THREE.PointLightHelper( bottomPointLight, 1 ) );

            var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
            hemiLight.color.setHSL( 0.6, 1, 0.6 );
            hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
            hemiLight.position.set( 0, 0, 100 );
            this.stage.add( hemiLight );

            // CAMERA RIG
            this.cameraNull = new THREE.Object3D();
            this.stage.add( this.cameraNull );

            this._camera            = new THREE.PerspectiveCamera( 90, 1, 0.01, 100000 );
            this._camera.position.y = -0.5;
            this._camera.position.z = 0.5;
            this._camera.rotation.x = 35 * Math.PI / 180;
            this.cameraNull.add( this._camera );

            this.cameraHelper = new THREE.CameraHelper( this._camera );
            this.stage.add( this.cameraHelper );
        }
    }

    /**
     * @inheritdoc
     */
    addPlayer( player ) {
        // Player Bird
        const clazz  = ( player instanceof LocalPlayer ) ? Hero : PlayerBird;
        const playerBird = new clazz( `player-${player.id}`, {
            player:        player,
            planetGravity: this.planetGravity
        } );
        this.add( playerBird );
        if ( player instanceof LocalPlayer ) {
            this.hero = playerBird;
        }
        // Player Pointer
        const playerPointer = new Pointer( `pointer-${player.id}`, {
            player:        player
        } );
        this.add( playerPointer );
    }

    /**
     * @inheritdoc
     */
    removePlayer( player ) {
        // Player Bird
        const playerBird = this.get( `player-${player.id}` );
        if ( playerBird ) {
            if ( player.hero ) {
                this.hero = null;
            }
            this.remove( playerBird );
        } else {
            console.warn( `Could not find player entity ${player.id} for removal` )
        }
        // Player Pointer
        const playerPointer = this.get( `pointer-${player.id}` );
        if ( playerPointer ) {
            this.remove( playerPointer );
        } else {
            console.warn( `Could not find pointer entity ${player.id} for removal` )
        }
    }

    /**
     * Temporary
     * quaternion use to compute slerp for camera rotation
     * @type {THREE.Quaternion}
     */
    cameraRotation = new THREE.Quaternion();

    /**
     * @inheritdoc
     */
    update( dt ) {
        super.update( dt );

        if ( __CLIENT__ ) {
            if ( this.hero ) {
                this.cameraNull.position.lerp( this.hero.body.position, dt * 10 );
                // We have to convert from CANNON.Quaternion here otherwise slerp doesn't work
                this.cameraRotation.copy( this.hero.body.quaternion );
                this.cameraNull.quaternion.slerp( this.cameraRotation, dt * 5 );
                this.cameraHelper.update();
            }
        }
    }
}