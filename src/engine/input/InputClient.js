"use strict";

import InputBase from "./InputBase";
import PS3 from "./mappers/PS3";
import FULLTILT from "fulltilt";

const mappers = [PS3];

export default class Input extends InputBase {

    state = {
        controllers: {},
        keys:        {},
        orientation: null
    };

    constructor( game ) {
        super( game );

        // CONTROLLER
        this._controllers = {};
        this._haveEvents  = 'ongamepadconnected' in window;

        // GAMEPADS
        this._detectControllers();
        window.addEventListener( "gamepadconnected", e => this._controllerHandler( e, true ), false );
        window.addEventListener( "gamepaddisconnected", e => this._controllerHandler( e, false ), false );

        // KEYBOARD
        window.addEventListener( 'keydown', this._onKeyDown.bind( this ), false );
        window.addEventListener( 'keypress', this._onKeyPress.bind( this ), false );
        window.addEventListener( 'keyup', this._onKeyUp.bind( this ), false );

        // Mobile Orientation
        this._fullTilt = new FULLTILT.getDeviceOrientation( { 'type': 'world' } )
            .then( controller => this._orientationController = controller )
            .catch( message => console.error( message ) );
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

    update() {
        super.update();

        if ( this._orientationController ) {
            this.state.orientation = this._orientationController.getFixedFrameQuaternion();
        }

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