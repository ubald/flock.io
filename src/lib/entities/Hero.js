'use strict';

import Bird from "./Bird";
import FlightControls from "../components/FlightControls";

export default class Hero extends Bird {
    
    constructor( name, config ) {
        super( name, config );
        this._body.position.set( 0, 10, 0 );
        this.addComponent( new FlightControls( 'control' ) );
    }

}