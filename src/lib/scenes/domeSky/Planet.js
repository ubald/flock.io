'use strict';

import CANNON from "cannon";
import THREE from "three";
import Entity from "../../../engine/Entity";

export default class Planet extends Entity {

    constructor( name, config ) {
        super( name, config );

        this.radius = config.radius;

        this._body  = new CANNON.Body( { mass: 0, shape: new CANNON.Sphere( this.radius - 1 ) } );
        this._body.position.set( 0, 0, 0 );
    }

    init() {
        super.init();

        if ( __CLIENT__ ) {
            // Dome Preview
            this.material = new THREE.MeshLambertMaterial( {
                color: 0x303030,
                //wireframe: true,
                //side:      THREE.DoubleSide
            } );
            var geometry = new THREE.SphereGeometry( this.radius - 1, 64, 64 );
            this.mesh     = new THREE.Mesh( geometry, this.material );
            this.mesh.position.set( 0, 0, 0 );
            this.addObject( this.mesh );
        }
    }

    dispose() {
        if ( __CLIENT__ ) {
            this.removeObject( this.mesh );
            this.dispose();
            this.material.dispose();
        }
        super.dispose();
    }
}