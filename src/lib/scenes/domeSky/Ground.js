'use strict';

import CANNON from "cannon";
import THREE from "three";
import Entity from "../../../engine/Entity";

export default class Ground extends Entity {

    constructor( name, config ) {
        super( name, config );

        this._body = new CANNON.Body( { mass: 0, shape: new CANNON.Plane() } );
        this._body.position.set( 0, 0, -5 );
    }

    init() {
        super.init();

        if ( __CLIENT__ ) {
            this.material = new THREE.MeshLambertMaterial( {
                color: 0xe8d7a5
            } );
            var geometry  = new THREE.PlaneGeometry( 10000, 10000, 100, 100 );
            this.mesh     = new THREE.Mesh( geometry, this.material );
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