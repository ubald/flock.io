"use strict";

import _ from "lodash";
import THREE from "three";
import CANNON from "cannon";
import Scene from "../engine/Scene";
import Bird from "../entities/Bird";
import Hero from "../entities/Hero";
import Wander from "../engine/components/Wander";

export default class DomeSkyScene extends Scene {

    constructor() {
        super();
    }

    _init() {
        super._init();

        this.radius = 10;
        this._physics.gravity.set( 0, 0, 0 ); // m/s²
        this.planetGravity = {
            position: new CANNON.Vec3( 0, 0, 0 ),
            radius:   this.radius
        };

        //Ground Physics
        var groundShape = new CANNON.Plane();
        var groundBody  = new CANNON.Body( { mass: 0, shape: groundShape } );
        groundBody.quaternion.setFromAxisAngle( new CANNON.Vec3( 1, 0, 0 ), -Math.PI / 2 );
        groundBody.position.set( 0, -5, 0 );
        this.physics.addBody( groundBody );

        var domeShape = new CANNON.Sphere( this.radius - 1 );
        var domeBody  = new CANNON.Body( { mass: 0, shape: domeShape } );
        domeBody.position.set( 0, 0, 0 );
        this.physics.addBody( domeBody );

        this.hero = new Hero( 'hero', {
            planetGravity: _.extend( {
                fly: true
            }, this.planetGravity )
        } );
        this.add( this.hero );

        for ( var i = 0; i < 250; i++ ) {
            const bird = new Bird( 'bird' + i, {
                planetGravity: _.extend( {
                    fly: true
                }, this.planetGravity )
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
        }

        if ( __CLIENT__ ) {
            var groundMaterial  = new THREE.MeshLambertMaterial( {
                color:     0xe8d7a5
            } );
            var ground_geometry = new THREE.PlaneGeometry( 10000, 10000, 100, 100 );
            var ground          = new THREE.Mesh( ground_geometry, groundMaterial );
            this.stage.add( ground );

            //Ground Preview
            ground.quaternion.copy( groundBody.quaternion );
            ground.position.copy( groundBody.position );

            // Dome Preview
            this.domeMaterial = new THREE.MeshLambertMaterial( {
                color:     0x303030,
                //wireframe: true,
                //side:      THREE.DoubleSide
            } );
            this.domeGeometry = new THREE.SphereGeometry( this.radius - 1, 64, 64 );
            this.domeMesh     = new THREE.Mesh( this.domeGeometry, this.domeMaterial );
            this.domeMesh.position.set( 0, 0, 0 );
            this.stage.add( this.domeMesh );

            // Top Light
            var topPointLight = new THREE.PointLight( 0xffffff, 1, 100 );
            topPointLight.position.set( 0, this.radius + 5, 0 );
            this.stage.add( topPointLight );
            this.stage.add( new THREE.PointLightHelper( topPointLight, 1 ) );

            // Bottom Light
            var bottomPointLight = new THREE.PointLight( 0xffffff, 1, 100 );
            bottomPointLight.position.set( 0, -5, 0 );
            this.stage.add( bottomPointLight );
            this.stage.add( new THREE.PointLightHelper( bottomPointLight, 1 ) );

            var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
            hemiLight.color.setHSL( 0.6, 1, 0.6 );
            hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
            hemiLight.position.set( 0, 100, 0 );
            this.stage.add( hemiLight );

            // CAMERA RIG
            this.cameraNull = new THREE.Object3D();
            this.cameraNull.position.copy( this.hero.body.position );
            this.stage.add( this.cameraNull );

            this._camera            = new THREE.PerspectiveCamera( 90, 1, 0.01, 100000 );
            this._camera.position.y = 0.5;
            this._camera.position.z = -0.5;
            this._camera.rotation.x = 35 * Math.PI / 180;
            this._camera.rotateY( Math.PI );
            this.cameraNull.add( this._camera );

            this.cameraHelper = new THREE.CameraHelper( this._camera );
            this.stage.add( this.cameraHelper );
        }
    }

    //cameraPosition = new THREE.Vector3();
    cameraRotation = new THREE.Quaternion();

    update( dt ) {
        super.update( dt );

        if ( __CLIENT__ ) {
            this.cameraNull.position.lerp( this.hero.body.position, dt * 10 );
            // We have to convert from CANNON.Quaternion here otherwise slerp doesn't work
            this.cameraRotation.copy( this.hero.body.quaternion );
            this.cameraNull.quaternion.slerp( this.cameraRotation, dt * 5 );
            this.cameraHelper.update();
        }
    }
}