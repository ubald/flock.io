'use strict';

import Entity from "../engine/Entity";
import CANNON from "cannon";

var THREE = require( "three" );
if ( __CLIENT__ ) {
    require( "three/examples/js/loaders/STLLoader" )
}

export default class TestHero extends Entity {

    constructor( name ) {
        super( name );
        this.radius = 1;

        this._body = new CANNON.Body( {
            shape:          new CANNON.Sphere( this.radius ),
            linearDamping:  0.5,
            angularDamping: 0.9,
            mass:           10
        } );
        this._body.position.set( 0, 10, 0 );
    }

    init() {
        super.init();

        if ( __CLIENT__ ) {
            this.scene.world.input.axes
                .subscribe( this._controllerControl.bind( this ) );

            this.scene.world.input.keyPress
                .filter(({key}) => key == 'w' || key == 'ArrowUp')
                .subscribe( this._keyboardThrustForwards.bind( this ) );

            this.scene.world.input.keyPress
                .filter(({key}) => key == 's' || key == 'ArrowDown')
                .subscribe( this._keyboardThrustBackwards.bind( this ) );

            this.scene.world.input.keyPress
                .filter(({key}) => key == 'a' || key == 'ArrowLeft')
                .subscribe( this._keyboardBankLeft.bind( this ) );

            this.scene.world.input.keyPress
                .filter(({key}) => key == 'd' || key == 'ArrowwRight')
                .subscribe( this._keyboardBankRight.bind( this ) );

            var loader = new THREE.STLLoader();
            loader.load( '/assets/bird.stl', geometry => {
                geometry.rotateX( -Math.PI / 2 );
                //geometry.rotateY( Math.PI );
                this.material = new THREE.MeshNormalMaterial( { color: 0xFFC107, side: THREE.DoubleSide } );
                this.heroMesh = new THREE.Mesh( geometry, this.material );
                this.addObject( this.heroMesh );

                //var normals = new THREE.VertexNormalsHelper( this.heroMesh, 0.2, 0x00ff00, 1 );
                //this.addObject( normals );

                //this.frontArrowHelper = new THREE.ArrowHelper( new THREE.Vector3(0,0,1), new THREE.Vector3(0,0,0), 1, 0xff0000 );
                //this.scene.stage.add( this.frontArrowHelper );
            } );
        }
    }

    update( dt ) {
        super.update( dt );


        const bodyRotation = new CANNON.Vec3();
        this.body.quaternion.toEuler( bodyRotation );

        const bodyFront = new CANNON.Vec3( 0, 0, 1 );
        const bodySide  = new CANNON.Vec3( -1, 0, 0 );

        const center = this._body.pointToLocalFrame( new CANNON.Vec3( 0, 0, 0 ) );

        const v1 = new THREE.Vector3( bodyFront.x, bodyFront.y, bodyFront.z );
        const v2 = new THREE.Vector3( bodySide.x, bodySide.y, bodySide.z );
        const v3 = new THREE.Vector3( center.x, center.y, center.z );

        this.body.angularVelocity.vadd(
            this.body.vectorToWorldFrame(
                new CANNON.Vec3(
                    (v1.angleTo( v3 ) - Math.PI / 2) * 0.25,
                    (v2.angleTo( v3 ) - Math.PI / 2) * 0.01, // Bank rotation
                    (v2.angleTo( v3 ) - Math.PI / 2) * 0.05,
                )
            ),
            this.body.angularVelocity
        );

        /*if (__CLIENT__) {
            this.frontArrowHelper.position.copy(this._body.position);
            this.frontArrowHelper.quaternion.copy(this._body.quaternion);
            this.frontArrowHelper.setDirection(this.object3D.worldToLocal(new THREE.Vector3(0,0,0)));
        }*/
    }

    dispose() {
        this.removeObject( this.heroMesh );
        this.heroMesh.dispose();
        //this.heroGeometry.dispose();
        this.material.dispose();

        super.dispose();
    }

    _controllerControl( axis ) {
        switch ( axis.id ) {
            case 0:
                //this.body.applyLocalForce( new CANNON.Vec3( axis.value * 100, 0, 0 ), new CANNON.Vec3( 0, 0, 0 ) );

                //this.body.applyLocalForce( new CANNON.Vec3( axis.value * -100, 0, 0 ), new CANNON.Vec3( 0, 0, 0 ) );
                break;

            case 1:
                //this.position.y += axis.value;
                this.body.applyLocalForce( new CANNON.Vec3( 0, 0, axis.value * -100 ), new CANNON.Vec3( 0, 0, 0 ) );
                break;

            case 2:
                //this.rotation.y += axis.value * 0.1;
                this.body.angularVelocity.vadd(
                    this.body.vectorToWorldFrame(
                        new CANNON.Vec3(
                            0,
                            0,
                            axis.value * Math.max( 1, this.body.vectorToLocalFrame( this.body.velocity ).z ) * 0.01
                        )
                    ),
                    this.body.angularVelocity
                );
                break;

            case 3:
                this.body.angularVelocity.vadd(
                    this.body.vectorToWorldFrame(
                        new CANNON.Vec3(
                            axis.value * Math.max( 1, this.body.vectorToLocalFrame( this.body.velocity ).z ) * -0.01,
                            0,
                            0
                        )
                    ),
                    this.body.angularVelocity
                );
                break;
        }
    }

    _keyboardThrustForwards() {
        this.body.applyLocalForce( new CANNON.Vec3( 0, 0, 100 ), new CANNON.Vec3( 0, 0, 0 ) );
    }

    _keyboardThrustBackwards() {
        this.body.applyLocalForce( new CANNON.Vec3( 0, 0, -100 ), new CANNON.Vec3( 0, 0, 0 ) );
    }

    _keyboardBankLeft() {
        this.body.angularVelocity.vadd(
            this.body.vectorToWorldFrame(
                new CANNON.Vec3(
                    0,
                    0,
                    -Math.max( 1, this.body.vectorToLocalFrame( this.body.velocity ).z ) * 0.01
                )
            ),
            this.body.angularVelocity
        );
    }

    _keyboardBankRight() {
        this.body.angularVelocity.vadd(
            this.body.vectorToWorldFrame(
                new CANNON.Vec3(
                    0,
                    0,
                    Math.max( 1, this.body.vectorToLocalFrame( this.body.velocity ).z ) * 0.01
                )
            ),
            this.body.angularVelocity
        );
    }
}