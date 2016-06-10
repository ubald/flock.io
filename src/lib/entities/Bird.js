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
            if ( !Bird.geometry ) {
                geometry.scale( 0.25, 0.25, 0.25 );
                Bird.geometry = geometry;
            }
            const shape = new CANNON.Sphere( Bird.geometry.boundingSphere.radius );
            this._body.addShape( shape );
            this._body.mass = shape.volume() * this.density;
            this._body.updateMassProperties();

            this.createMesh();
            //var normals = new THREE.VertexNormalsHelper( this.birdMesh, 0.2, 0x00ff00, 1 );
            //this.addObject( normals );
        });
    }
    
    createMesh() {
        if ( __CLIENT__ ) {
            this.material = new THREE.MeshLambertMaterial( { color: 0xFFC107 } );
            this.mesh     = new THREE.Mesh( Bird.geometry, this.material );
            this.addObject( this.mesh );
        }
    }

    update( dt ) {
        super.update( dt );
    }

    dispose() {
        this.removeObject( this.mesh );
        this.mesh.dispose();
        this.material.dispose();
        super.dispose();
    }


}