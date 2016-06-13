"use strict";

import InputBase from "./InputBase";

export default class Input extends InputBase {

    state = null;

    constructor( game ) {
        super( game );
    }

    update() {
        super.update();

        /*// KEYBOARD
        for ( const key in this._keys ) {
            if ( this._keys[key] ) {
                if ( !this._lastKeys[key] ) {
                    this._keyDownSubject.next( { key } );
                }
                this._keyPressSubject.next( { key } );
            } else {
                this._keyUpSubject.next( { key } );
                delete this._keys[key];
            }
        }

        // CONTROLLER
        for ( var i in this._controllers ) {
            const controller = this._controllers[i];
            let lastState    = this._lastControllerState[i];

            if ( !lastState ) {
                lastState = this._lastControllerState[i] = {
                    buttons: [],
                    axes:    []
                }
            }

            for ( var j = 0; j < controller.buttons.length; j++ ) {
                const button = controller.buttons[j];

                if ( !lastState.buttons[j] ) {
                    lastState.buttons[j] = { pressed: false, value: 0.0 };
                }
                const lastButtonState = lastState.buttons[j];

                if ( !button.pressed && lastButtonState.pressed ) {
                    // button released
                    //console.log( "BUTTON RELEASED", j );
                    this._buttonReleasedSubject.next( { controller, button: j, value: button.value } );

                } else if ( button.pressed && !lastButtonState.pressed ) {
                    // button pressed
                    //console.log( "BUTTON PRESSED", j );
                    this._buttonPressedSubject.next( { controller, button: j, value: button.value } );

                } else if ( button.pressed ) {
                    // button down
                    //console.log( "BUTTON DOWN", j );
                    this._buttonDownSubject.next( { controller, button: j, value: button.value } );

                }

                lastButtonState.pressed = button.pressed;
                lastButtonState.value   = button.value;
            }

            for ( var k = 0; k < controller.axes.length; k++ ) {
                var axis     = controller.axes[k] || 0.0;
                var lastAxis = lastState.axes[k] || 0.0;

                // Deadzone
                if ( axis <= this._deadZone && axis >= -this._deadZone ) {
                    axis = 0.0;
                }

                //if ( axis != lastAxis ) {
                // axis
                //console.log( k + ": " + controller.axes[k] );//.toFixed(4) );
                //console.log({ controller, id: k, value: axis });
                this._axesSubject.next( { controller, id: k, value: axis } );
                //}

                lastState.axes[k] = axis;
            }

            this._lastControllerState[i] = lastState
        }*/

    }
}