'use strict';

import THREE from "three";
import CANNON from "cannon";
import Entity from "../engine/Entity";
import PlanetGravity from "../components/PlanetGravity";
import STLLoader from "../loaders/STLLoader";

export default class Bird extends Entity {

    density = 2.5;

    constructor( name, config ) {
        super( name, config );

        this._body = new CANNON.Body( {
            linearDamping:  0.5,
            angularDamping: 0.9,
            type:           CANNON.Body.DYNAMIC
        } );

        this.addComponent( new PlanetGravity( 'gravity', this.config.planetGravity ) );
    }

    init() {
        super.init();

        STLLoader.load( "assets/bird.stl", geometry => {
            const shape = new CANNON.Sphere( geometry.boundingSphere.radius );
            this._body.addShape( shape );
            this._body.mass = shape.volume() * this.density;
            this._body.updateMassProperties();

            if ( __CLIENT__ ) {
                this.material = new THREE.MeshNormalMaterial( { color: 0xFFC107, side: THREE.DoubleSide } );
                this.birdMesh = new THREE.Mesh( geometry, this.material );
                this.addObject( this.birdMesh );
            }
            //var normals = new THREE.VertexNormalsHelper( this.birdMesh, 0.2, 0x00ff00, 1 );
            //this.addObject( normals );
        });
    }

    update( dt ) {
        super.update( dt );
    }

    dispose() {
        this.removeObject( this.birdMesh );
        this.birdMesh.dispose();
        this.material.dispose();
        super.dispose();
    }


}