"use strict";

import {Subject} from 'rxjs';

export default class Input {

    constructor( world ) {
        this._world = world;

        this._haveEvents = 'ongamepadconnected' in window;

        this._deadZone = 0.1;

        this._controllers            = {};
        this._lastControllerState    = {};
        this._currentControllerState = {};
        this._detectControllers();

        console.log( this._controllers );

        window.addEventListener( "gamepadconnected", e => this._controllerHandler( e, true ), false );
        window.addEventListener( "gamepaddisconnected", e => this._controllerHandler( e, false ), false );

        this._buttonPressedSubject = new Subject();
        this._buttonReleasedSubject = new Subject();
        this._buttonDownSubject = new Subject();
        this._axesSubject = new Subject();
    }

    get controllers() {
        return this._controllers;
    }

    get buttonPressed() {
        return this._buttonPressedSubject;
    }

    get buttonReleased() {
        return this._buttonReleasedSubject;
    }

    get buttonDown() {
        return this._buttonDownSubject;
    }

    get axes() {
        return this._axesSubject;
    }

    _detectControllers() {
        const detected = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
        for ( var i = 0; i < detected.length; i++ ) {
            if ( detected[i] ) {
                if ( detected[i].index in this._controllers ) {
                    this._controllers[detected[i].index] = detected[i];
                } else {
                    this._addController( detected[i] )
                }
            }
        }
    }

    _addController( controller ) {
        this._controllers[controller.index]            = controller;
        this._lastControllerState[controller.index]    = {
            buttons: {},
            axes:    {}
        };
        this._currentControllerState[controller.index] = {
            buttons: {},
            axes:    {}
        };
    }

    _removeController( controller ) {
        delete this._controllers[controller.index];
        delete this._lastControllerState[controller.index];
        delete this._currentControllerState[controller.index];
    }

    _controllerHandler( event, connecting ) {
        if ( connecting ) {
            console.log( "Controller connected at index %d: %s. %d buttons, %d axes.", event.gamepad.index, event.gamepad.id, event.gamepad.buttons.length, event.gamepad.axes.length );
            console.log( event.gamepad );

            this._addController( event.gamepad );
        } else {
            console.log( "Controller disconnected from index %d: %s", event.gamepad.index, event.gamepad.id );
            this._removeController( event.gamepad );
        }
    }

    update() {
        if ( !this._controllers || !this._controllers[0] ) {
            return;
        }

        if ( !this._haveEvents ) {
            this._detectControllers();
        }

        for ( var i in this._controllers ) {
            const controller = this._controllers[i];
            const lastState  = this._lastControllerState[i];

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
                var axis     = controller.axes[k];
                var lastAxis = lastState.axes[k] || 0.0;

                // Deadzone
                if ( axis <= this._deadZone && axis >= -this._deadZone ) {
                    continue;
                }
                
                //if ( axis != lastAxis ) {
                    // axis
                    //console.log( k + ": " + controller.axes[k] );//.toFixed(4) );
                    //console.log({ controller, id: k, value: axis });
                    this._axesSubject.next( { controller, id: k, value: axis } );
                //}

                lastState.axes[k] = axis;
            }
        }
    }

}