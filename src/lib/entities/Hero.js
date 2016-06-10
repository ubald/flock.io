'use strict';

import THREE from "three";
import Bird from "./Bird";
import FlightControls from "../components/FlightControls";

export default class Hero extends Bird {
    
    constructor( name, config ) {
        super( name, config );
        this._body.position.set( 0, 10, 0 );
        __SERVER__ && this.addComponent( new FlightControls( 'control', { alpha: this.density } ) );
    }

    createMesh() {
        super.createMesh();
        __CLIENT__ && (() => {
            this.material = new THREE.MeshLambertMaterial( { color: 0xEE1010 } );
            this.mesh.material = this.material;
        })();
    }

}