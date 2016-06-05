"use strict";

import CANNON from "cannon";
import Scene from "../engine/Scene";
import TestHero from "./TestHero";

if ( __CLIENT__ ) {
    var THREE = require( "three" );
}

export default class TestScene extends Scene {
    constructor() {
        super();
    }

    init( world ) {
        super.init( world );

        this._physics.gravity.set( 0, 0, 0 ); // m/s²

        this.hero = new TestHero( 'testHero' );
        this.add( this.hero );

        //Ground Physics
        var groundShape = new CANNON.Plane();
        var groundBody  = new CANNON.Body( { mass: 0, shape: groundShape } );
        groundBody.quaternion.setFromAxisAngle( new CANNON.Vec3( 1, 0, 0 ), -Math.PI / 2 );
        groundBody.position.set( 0, 0, 0 );
        this.physics.addBody( groundBody );

        this.anchor = new CANNON.Body( { mass: 0 } );
        this.physics.addBody( this.anchor );

        /*const spring = new CANNON.Spring( this.anchor, this.hero.body, {
            restLength: 10,
            stiffness:  100,
            damping:    1
        } );

        this.physics.addEventListener( "postStep", function ( event ) {
            spring.applyForce();
        } );*/


        this.radius = 10;

        /*this.domeBody = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Sphere(this.radius)
        });
        this.physics.addBody(this.domeBody);*/

        //const distance = new CANNON.DistanceConstraint( this.anchor, this.hero.body, 10, 10 );
        //this.physics.addConstraint( distance );


        if ( __CLIENT__ ) {
            var groundMaterial  = new THREE.MeshBasicMaterial( {
                color:     0x003300,
                wireframe: true,
                side:      THREE.DoubleSide
            } );
            var ground_geometry = new THREE.PlaneGeometry( 10000, 10000, 100, 100 );
            var ground          = new THREE.Mesh( ground_geometry, groundMaterial );
            this.stage.add( ground );

            //Ground Preview
            ground.quaternion.copy( groundBody.quaternion );
            ground.position.copy( groundBody.position );

            // Dome Preview
            this.domeMaterial = new THREE.MeshBasicMaterial( {
                color:     0x303030,
                wireframe: true,
                side:      THREE.DoubleSide
            } );
            this.domeGeometry = new THREE.SphereGeometry( this.radius, 16, 16 );
            this.domeMesh     = new THREE.Mesh( this.domeGeometry, this.domeMaterial );
            this.domeMesh.position.set( 0, 0, 0 );
            this.stage.add( this.domeMesh );

            var pointLight = new THREE.PointLight( 0xffffff, 1, 100 );
            pointLight.position.set( 0, this.radius + 5, 0 );
            this.stage.add( pointLight );

            var sphereSize       = 1;
            var pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
            this.stage.add( pointLightHelper );

            this.cameraNull         = new THREE.Object3D();
            this._camera            = new THREE.PerspectiveCamera( 90, 1, 1, 100000 );
            this._camera.position.z = -5;
            this._camera.rotateY( Math.PI );
            this.cameraNull.add( this._camera );
            this.stage.add( this.cameraNull );

            this.cameraHelper = new THREE.CameraHelper( this._camera );
            this.stage.add( this.cameraHelper );
        }
    }

    update( dt ) {
        super.update( dt );

        // Planet gravity
        const height = this.hero.body.position.length();
        if ( Math.abs( height - this.radius ) > 1 ) {
            const mult = height > this.radius ? -1 : 1;
            this.hero.body.force.set(
                mult * this.hero.body.position.x,
                mult * this.hero.body.position.y,
                mult * this.hero.body.position.z
            ).normalize();
            this.hero.body.force.scale( 9.82 * 10, this.hero.body.force );
        }

        if ( __CLIENT__ ) {
            this.cameraNull.position.copy( this.hero.body.position );
            this.cameraNull.quaternion.copy( this.hero.body.quaternion );
            //.setLength( this.hero.position.length() + 10 );
            //this._camera.lookAt(new THREE.Vector3(0,0,0));
        }
    }
}