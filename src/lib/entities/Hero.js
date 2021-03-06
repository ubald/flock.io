'use strict';

import THREE from "three";
import PlayerBird from "./PlayerBird";

export default class Hero extends PlayerBird {

    constructor( name, config ) {
        super( name, config );
    }

    createMesh() {
        this.material = this.material || new THREE.MeshLambertMaterial( { color: 0x10EE10 } );
        super.createMesh();
    }

}