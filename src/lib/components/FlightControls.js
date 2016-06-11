"use strict";

import CANNON from "cannon";
import Component from "../../engine/Component";

export default class FlightControls extends Component {
    
    constructor( name, config ) {
        super( name, config );
        this.alpha = config.alpha || 1.0;
        this.input = config.input;
    }

    init() {
        super.init();

        this.subscriptions = [
            this.input.axes
                .subscribe( this._controllerControl.bind( this ) ),

            this.input.keyPress
                .filter( ( { key } ) => key == 'KeyW' || key == 'ArrowUp' )
                .subscribe( this._keyboardThrustForwards.bind( this ) ),

            this.input.keyPress
                .filter( ( { key } ) => key == 'KeyS' || key == 'ArrowDown' )
                .subscribe( this._keyboardThrustBackwards.bind( this ) ),

            this.input.keyPress
                .filter( ( { key } ) => key == 'KeyA' || key == 'ArrowLeft' )
                .subscribe( this._keyboardBankLeft.bind( this ) ),

            this.input.keyPress
                .filter( ( { key } ) => key == 'KeyD' || key == 'ArrowRight' )
                .subscribe( this._keyboardBankRight.bind( this ) )
        ];
    }

    dispose() {
        this.subscriptions.forEach( subscription => subscription.unsubscribe() );
        super.dispose();
    }

    _controllerControl( axis ) {
        switch ( axis.id ) {
            case 0:
                //this.entity.body.applyLocalForce( new CANNON.Vec3( axis.value * 100, 0, 0 ), new CANNON.Vec3( 0, 0, 0 ) );

                //this.entity.body.applyLocalForce( new CANNON.Vec3( axis.value * -100, 0, 0 ), new CANNON.Vec3( 0, 0, 0 ) );
                break;

            case 1:
                //this.position.y += axis.value;
                this.entity.body.applyLocalForce( new CANNON.Vec3( 0, 0, axis.value * this.alpha * -5 ), new CANNON.Vec3( 0, 0, 0 ) );
                break;

            case 2:
                //this.rotation.y += axis.value * 0.1;
                this.entity.body.angularVelocity.vadd(
                    this.entity.body.vectorToWorldFrame(
                        new CANNON.Vec3(
                            0,
                            0,
                            axis.value * Math.max( 1, this.entity.body.vectorToLocalFrame( this.entity.body.velocity ).z ) * 0.01
                        )
                    ),
                    this.entity.body.angularVelocity
                );
                break;

            case 3:
                this.entity.body.angularVelocity.vadd(
                    this.entity.body.vectorToWorldFrame(
                        new CANNON.Vec3(
                            axis.value * Math.max( 1, this.entity.body.vectorToLocalFrame( this.entity.body.velocity ).z ) * -0.01,
                            0,
                            0
                        )
                    ),
                    this.entity.body.angularVelocity
                );
                break;
        }
    }

    _keyboardThrustForwards() {
        this.entity.body.applyLocalForce( new CANNON.Vec3( 0, 0, this.alpha * -5 ), new CANNON.Vec3( 0, 0, 0 ) );
    }

    _keyboardThrustBackwards() {
        this.entity.body.applyLocalForce( new CANNON.Vec3( 0, 0, this.alpha * 5 ), new CANNON.Vec3( 0, 0, 0 ) );
    }

    _keyboardBankLeft() {
        this.entity.body.angularVelocity.vadd(
            this.entity.body.vectorToWorldFrame(
                new CANNON.Vec3(
                    0,
                    0,
                    -Math.max( 1, this.entity.body.vectorToLocalFrame( this.entity.body.velocity ).z ) * 0.01
                )
            ),
            this.entity.body.angularVelocity
        );
    }

    _keyboardBankRight() {
        this.entity.body.angularVelocity.vadd(
            this.entity.body.vectorToWorldFrame(
                new CANNON.Vec3(
                    0,
                    0,
                    Math.max( 1, this.entity.body.vectorToLocalFrame( this.entity.body.velocity ).z ) * 0.01
                )
            ),
            this.entity.body.angularVelocity
        );
    }
}