'use strict';

import THREE from "three";
import CANNON from "cannon";
import Entity from "../../engine/Entity";
import DeviceOrientation from "../components/DeviceOrientation";

export default class Pointer extends Entity {

    constructor( name, config ) {
        super( name, config );
        this._player = config.player;
        
        this._body = new CANNON.Body( {
            type: CANNON.Body.KINEMATIC
        } );

        if ( __SERVER__ ) {
            this.addComponent( new DeviceOrientation( 'cursor', {
                input: this._player.input
            } ) );
        }
    }

    init() {
        super.init();

        if (__CLIENT__) {
            this.material        = new THREE.MeshBasicMaterial( { color: 0x1010FF } );
            this.mesh            = new THREE.Mesh( new THREE.SphereGeometry( 0.5, 4, 4 ), this.material );
            this.mesh.position.y = 12;
            this.addObject( this.mesh );
        }
    }

    dispose() {
        if ( __CLIENT__ ) {
            this.removeObject( this.mesh );
            this.material.dispose();
        }
        super.dispose();
    }
}