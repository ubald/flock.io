"use strict";

import Component from "../../engine/Component";

export default class DeviceOrientation extends Component {

    constructor( name, config ) {
        super( name, config );
        this.input  = config.input;
    }

    update( dt ) {
        super.update( dt );
        if ( !this.input.state ) {
            return;
        }

        if ( this.input.state.orientation ) {
            this.entity.body.quaternion.set(
                this.input.state.orientation.x,
                this.input.state.orientation.y,
                this.input.state.orientation.z,
                this.input.state.orientation.w
            );
        } else {
            console.log('nope');
        }
    }
}