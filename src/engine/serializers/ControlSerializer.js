"use strict";

import {UINT16} from "../math/Numbers";
import Messages from "../network/Messages";
import DataViewWrapper from "./DataViewWrapper";

export default class ControlSerializer {

    static serialize( controls ) {
        const keys            = Object.keys( controls.keys );
        const keyCount        = keys.length;
        const controllers     = Object.values( controls.controllers );
        const controllerCount = controllers.length;

        // Prepare data
        let length           = 0;
        const controllerData = [];
        controllers.forEach( controller => {
            const buttonKeys  = Object.keys( controller.buttons );
            const buttonCount = buttonKeys.length;
            const axisKeys    = Object.keys( controller.axes );
            const axisCount   = axisKeys.length;
            controllerData.push( {
                id: controller.id,
                    buttonCount, buttonKeys,
                    axisCount, axisKeys
            } );
            length += (buttonCount + axisCount) * 3 /* ID (8bit) + VALUE (16bit) */;
        } );

        const messageLength = /* MSG (8bit) */ 1 +
            /* KEY COUNT (8bit) */ 1 +
            /* KEYS (8bit) */ keyCount +
            /* CONTROLLER COUNT (8bit) */ 1 +
            /* CONTROLLER ID + BUTTON COUNT + AXIS COUNT (8bit) */ controllerCount * 3 +
            /* DATA LENGTH */ length +
            /* ORIENTATION */ 3 * 4;

        const buffer = new ArrayBuffer( messageLength );
        const dv     = new DataViewWrapper( buffer );

        // Message Type
        dv.writeUint8( Messages.CONTROLS );

        // Number of keys
        dv.writeUint8( keyCount );
        // Keys
        keys.forEach( key => dv.writeUint8( key ) );

        // Number of controllers
        dv.writeUint8( controllerCount );
        // Controllers
        controllerData.forEach( data => {
            const controller = controls.controllers[data.id];
            dv.writeUint8( data.id );
            dv.writeUint8( data.buttonCount );
            data.buttonKeys.forEach( buttonKey => {
                dv.writeUint8( buttonKey );
                dv.writeUint16( controller.buttons[buttonKey] * UINT16 );
            } );
            dv.writeUint8( data.axisCount );
            data.axisKeys.forEach( axisKey => {
                dv.writeUint8( axisKey );
                dv.writeUint16( Math.round( ( ( controller.axes[axisKey] + 1 ) / 2 ) * UINT16 ) );
            } );
        } );

        // Orientation
        dv.writeFloat32(controls.orientation.x);
        dv.writeFloat32(controls.orientation.y);
        dv.writeFloat32(controls.orientation.z);

        return buffer;
    }

    static deserialize( buffer ) {
        const state = {
            keys:        {},
            controllers: {},
            orientation: {}
        };

        // Keys
        const keyCount = buffer.readUint8();
        for ( var k = 0; k < keyCount; k++ ) {
            state.keys[buffer.readUint8()] = true;
        }

        // Controllers
        const controllerCount = buffer.readUint8();
        for ( var c = 0; c < controllerCount; c++ ) {
            const controller = {
                buttons: {},
                axes:    {}
            };

            // Id
            const id = buffer.readUint8();

            // Buttons
            const buttonCount = buffer.readUint8();
            for ( var b = 0; b < buttonCount; b++ ) {
                controller.buttons[buffer.readUint8()] = buffer.readUint16() / UINT16;
            }

            // Axes
            const axisCount = buffer.readUint8();
            for ( var a = 0; a < axisCount; a++ ) {
                controller.axes[buffer.readUint8()] = ( ( buffer.readUint16() / UINT16 ) * 2 ) - 1;
            }

            state.controllers[id] = controller;
        }

        // Orientation
        state.orientation.x = buffer.readFloat32();
        state.orientation.y = buffer.readFloat32();
        state.orientation.z = buffer.readFloat32();
        
        return state;
    }

}