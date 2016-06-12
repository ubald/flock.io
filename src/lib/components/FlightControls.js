"use strict";

import CANNON from "cannon";
import Component from "../../engine/Component";
import {Axis, Button} from "../../engine/input/mappers/PS3";
import {KeyCodes} from "../../engine/input/Keyboard";

export default class FlightControls extends Component {

    constructor( name, config ) {
        super( name, config );
        this.alpha = config.alpha || 1.0;
        this.input = config.input;
    }

    update( dt ) {
        super.update( dt );
        if ( !this.input.state ) {
            return;
        }

        const state      = this.input.state;
        const controller = state.controllers[0];

        const thrust = Math.max( -1.0, Math.min( 1.0,
            ( controller ? controller.axes[Axis.LEFT_Y] : 0.0 ) +
            ( state.keys[KeyCodes['w']] ? 1.0 : 0.0 ) +
            ( state.keys[KeyCodes['s']] ? -1.0 : 0.0 ) +
            state.orientation.y / 45
        ) );
        const pitch  = Math.max( -1.0, Math.min( 1.0, ( controller ? controller.axes[Axis.RIGHT_Y] : 0.0 ) + ( state.keys[KeyCodes['space']] ? 1.0 : 0.0 ) + ( state.keys[KeyCodes['shift']] ? -1.0 : 0.0 ) ) );
        const roll   = Math.max( -1.0, Math.min( 1.0,
            ( controller ? controller.axes[Axis.RIGHT_X] : 0.0 ) +
            ( state.keys[KeyCodes['d']] ? 1.0 : 0.0 ) +
            ( state.keys[KeyCodes['a']] ? -1.0 : 0.0 ) +
            state.orientation.x / 45
        ) );
        const yaw    = (
            Math.min( controller ? controller.buttons[Button.LEFT_TRIGGER] * -1 : 0.0, state.keys[KeyCodes['q']] ? -1.0 : 0.0 ) +
            Math.max( controller ? controller.buttons[Button.RIGHT_TRIGGER] : 0.0, state.keys[KeyCodes['e']] ? 1.0 : 0.0 )
        );

        this.entity.body.applyLocalForce( new CANNON.Vec3( 0, 0, thrust * this.alpha * 5 ), new CANNON.Vec3( 0, 0, 0 ) );

        const zVelocity = Math.max( 1, Math.abs( this.entity.body.vectorToLocalFrame( this.entity.body.velocity ).z ) );
        this.entity.body.angularVelocity.vadd(
            this.entity.body.vectorToWorldFrame(
                new CANNON.Vec3(
                    pitch * zVelocity * -0.01,
                    yaw * zVelocity * -0.01 + roll * zVelocity * -0.01,
                    roll * zVelocity * 0.01
                )
            ),
            this.entity.body.angularVelocity
        );

    }
}