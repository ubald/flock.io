"use strict";

import Mapper from "./Mapper";

export const Button = {
    X:             0,
    CIRCLE:        1,
    SQUARE:        2,
    TRIANGLE:      3,
    LEFT_BUTTON:   4,
    RIGHT_BUTTON:  5,
    LEFT_TRIGGER:  6,
    RIGHT_TRIGGER: 7,
    SELECT:        8,
    START:         9,
    LEFT_STICK:    10,
    RIGHT_STICK:   11,
    DPAD_UP:       12,
    DPAD_DOWN:     13,
    DPAD_LEFT:     14,
    DPAD_RIGHT:    15,
    PS:            16
};

export const Axis = {
    LEFT_X:  0,
    LEFT_Y:  1,
    RIGHT_X: 2,
    RIGHT_Y: 3
};

const axisScale = {
    0: 1,
    1: -1,
    2: 1,
    3: -1
};

const DEAD_ZONE = 0.1;

export default class PS3 extends Mapper {

    static test( controller ) {
        return controller.id.match( /PLAYSTATION.*3/ ) != null;
    }

    static map( controller, state ) {
        // We don't really map since PS3 controller is our baseline
        controller.buttons.forEach( ( button, i ) => {
            state.buttons[i] = button.pressed ? button.value : 0.0;
        } );
        // PS3 axes are inverted on Y axis and it bothers me
        controller.axes.forEach( ( axis, i ) => {
            // Deadzone
            if ( axis <= DEAD_ZONE && axis >= -DEAD_ZONE ) {
                axis = 0.0;
            }
            state.axes[i] = axis * axisScale[i];
        } );
    }
}