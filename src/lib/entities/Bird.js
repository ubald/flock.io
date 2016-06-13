'use strict';

import _ from "lodash";
import THREE from "three";
import CANNON from "cannon";
import Entity from "../../engine/Entity";
import PlanetGravity from "../components/PlanetGravity";
import STLLoader from "../../engine/loaders/STLLoader";

export default class Bird extends Entity {

    density = 2.5;

    constructor( name, config ) {
        super( name, config );

        this._body = new CANNON.Body( {
            linearDamping:  0.5,
            angularDamping: 0.9,
            type:           CANNON.Body.DYNAMIC
        } );

        this._body.position.set( 0, 0, 10 );

        if ( __SERVER__ ) {
            this.addComponent( new PlanetGravity(
                'gravity',
                _.extend( {
                    fly: true
                }, this.config.planetGravity )
            ) );
        }
    }

    init() {
        super.init();

        STLLoader.load( "assets/bird2.stl", geometry => {
            if ( !Bird.geometry ) {
                geometry.scale( 0.25, 0.25, 0.25 );
                Bird.geometry = geometry;
            }

            const shape = new CANNON.Sphere( Bird.geometry.boundingSphere.radius * 0.5 );
            this._body.addShape( shape );
            this._body.mass = shape.volume() * this.density;
            this._body.updateMassProperties();

            if ( __CLIENT__ ) {
                this.createMesh();
            }
            //var normals = new THREE.VertexNormalsHelper( this.birdMesh, 0.2, 0x00ff00, 1 );
            //this.addObject( normals );
        } );
    }

    createMesh() {
        this.mesh = new THREE.Mesh( Bird.geometry, this.material || new THREE.MeshLambertMaterial( { color: 0xFFC107 } ) );
        this.addObject( this.mesh );
    }

    update( dt ) {
        super.update( dt );
    }

    dispose() {
        if ( __CLIENT__ ) {
            this.removeObject( this.mesh );
            this.material.dispose();
        }
        super.dispose();
    }
}