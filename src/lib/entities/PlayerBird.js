'use strict';

import THREE from "three";
import Bird from "./Bird";
import FlightControls from "../components/FlightControls";

export default class PlayerBird extends Bird {

    constructor( name, config ) {
        super( name, config );
        this._player = config.player;
        __SERVER__ && this.addComponent( new FlightControls( 'control', {
            alpha: this.density,
            input: this._player.input
        } ) );
    }

    createMesh() {
        this.material = this.material || new THREE.MeshLambertMaterial( { color: 0xEE1010 } );
        super.createMesh();
    }

}