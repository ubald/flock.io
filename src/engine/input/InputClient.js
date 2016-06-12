"use strict";

import InputBase from "./InputBase";
import PS3 from "./mappers/PS3";

const mappers = [PS3];

export default class Input extends InputBase {

    state = {
        controllers: {},
        keys:        {},
        orientation: {}
    };

    constructor( game ) {
        super( game );

        // CONTROLLER
        this._haveEvents = 'ongamepadconnected' in window;

        // GAMEPADS
        this._detectControllers();
        window.addEventListener( "gamepadconnected", e => this._controllerHandler( e, true ), false );
        window.addEventListener( "gamepaddisconnected", e => this._controllerHandler( e, false ), false );

        // KEYBOARD
        window.addEventListener( 'keydown', this._onKeyDown.bind( this ), false );
        window.addEventListener( 'keypress', this._onKeyPress.bind( this ), false );
        window.addEventListener( 'keyup', this._onKeyUp.bind( this ), false );

        // Mobile Orientation
        window.addEventListener( 'deviceorientation', this._onDeviceOrientation.bind( this ), false );
        window.addEventListener( 'devicemotion', this._onDeviceMotion.bind( this ), false );

        //this.madgwick = new AHRS({ sampleInterval: 20, algorithm: 'Madgwick' });
    }

    _detectControllers() {
        const detected = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
        for ( var i = 0; i < detected.length; i++ ) {
            if ( detected[i] ) {
                if ( detected[i].index in this._controllers ) {
                    this._controllers[detected[i].index].raw = detected[i];
                } else {
                    this._addController( detected[i] )
                }
            }
        }
    }

    _addController( raw ) {
        const mapper = mappers.find( mapper => mapper.test( raw ) );
        if ( !mapper ) {
            console.warn( 'No mapper found for controller', raw );
            return;
        }
        this._controllers[raw.index]      = { raw, mapper: mapper };
        this.state.controllers[raw.index] = {
            id:      raw.index,
            buttons: {},
            axes:    {}
        };
    }

    _removeController( controller ) {
        delete this._controllers[controller.index];
        delete this.state.controllers[controller.index];
    }

    _controllerHandler( event, connecting ) {
        if ( connecting ) {
            console.log( "Controller connected at index %d: %s. %d buttons, %d axes.", event.gamepad.index, event.gamepad.id, event.gamepad.buttons.length, event.gamepad.axes.length );
            this._addController( event.gamepad );
        } else {
            console.log( "Controller disconnected from index %d: %s", event.gamepad.index, event.gamepad.id );
            this._removeController( event.gamepad );
        }
    }

    _onKeyDown( e ) {
        this.state.keys[e.keyCode] = true;
    }

    _onKeyPress( e ) {
        //console.log('p', e.keyCode);
        //this.state.keys[e.keyCode] = true;
    }

    _onKeyUp( e ) {
        delete this.state.keys[e.keyCode];
    }

    _onDeviceOrientation( e ) {
        this.state.orientation = { x:-e.beta, y:-e.gamma, z:e.alpha };
    }

    _onDeviceMotion( e ) {
        this._motion = e.acceleration;
    }

    update() {
        super.update();


        //this.madgwick.update(this._motion.x, this._motion.y, this._motion.z, this._orientation.x, this._orientation.y, this._orientation.z, 0,0,0);//compass.x, compass.y, compass.z);
        //const v = this.madgwick.toVector();
        //console.log(v.angle, v.x, v.y, v.z);

        // CONTROLLER
        if ( this._controllers && this._controllers[0] ) {
            if ( !this._haveEvents ) {
                this._detectControllers();
            }

            for ( var i in this._controllers ) {
                const controller      = this._controllers[i];
                const controllerState = this.state.controllers[i];
                controller.mapper.map( controller.raw, controllerState );
            }
        }
    }

}