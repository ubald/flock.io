'use strict';

import Entity from "../engine/Entity";
import CANNON from "cannon";

if ( __CLIENT__ ) {
    var THREE = require( "three" );
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
                .subscribe( this._move.bind( this ) );


            var loader = new THREE.STLLoader();
            loader.load( '/assets/bird1.stl', geometry => {
                geometry.rotateX( -Math.PI / 2 );
                //geometry.rotateY( Math.PI );
                this.material = new THREE.MeshNormalMaterial( { color: 0xFFC107, side: THREE.DoubleSide } );
                this.heroMesh = new THREE.Mesh( geometry, this.material );
                this.addObject( this.heroMesh );

                //var normals = new THREE.VertexNormalsHelper( this.heroMesh, 0.2, 0x00ff00, 1 );
                //this.addObject( normals );
            } );

            this.debugBox = new THREE.BoxGeometry(2, 3, 4, 1, 1, 1);
            this.debugBoxMesh = new THREE.Mesh( this.debugBox, new THREE.MeshBasicMaterial({color: 0x0000ff, wireframe: true}));
            this.scene.stage.add(this.debugBoxMesh);
        }
    }

    update( dt ) {
        super.update( dt );
        
        // Slight rotation from angle (pseudo flight sim)
        const rotation = new CANNON.Vec3();
        this.body.quaternion.toEuler(rotation);
        this.body.angularVelocity.vadd(
            this.body.vectorToWorldFrame(
                new CANNON.Vec3(
                    0,
                    -rotation.z * 0.05,
                    0
                )
            ),
            this.body.angularVelocity
        );
    }

    dispose() {
        this.removeObject( this.heroMesh );
        this.heroMesh.dispose();
        //this.heroGeometry.dispose();
        this.material.dispose();

        super.dispose();
    }

    _move( axis ) {
        switch ( axis.id ) {
            case 0:
                //this.body.applyLocalForce( new CANNON.Vec3( axis.value * 100, 0, 0 ), new CANNON.Vec3( 0, 0, 0 ) );
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
                            axis.value * Math.max(1,this.body.vectorToLocalFrame(this.body.velocity).z) * 0.01
                        )
                    ),
                    this.body.angularVelocity
                );
                break;

            case 3:
                this.body.angularVelocity.vadd(
                    this.body.vectorToWorldFrame(
                        new CANNON.Vec3(
                            axis.value * Math.max(1,this.body.vectorToLocalFrame(this.body.velocity).z) * -0.01,
                            0,
                            0
                        )
                    ),
                    this.body.angularVelocity
                );
                break;
        }
    }
}