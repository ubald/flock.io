"use strict";

import CANNON from "cannon";
import THREE from "three";
import Component from "../../engine/Component";

export default class LeashControl extends Component {

    constructor( name, config ) {
        super( name, config );
        this.alpha  = config.alpha || 1.0;
        this.input  = config.input;
        this.radius = config.radius;
    }

    init() {
        super.init();
        this._body = new CANNON.Body( {
            type: CANNON.Body.STATIC
        } );
        this.entity.scene.physics.addBody( this._body );

        this._constraint = new CANNON.PointToPointConstraint( this._body, new CANNON.Vec3( 0, 0, 0 ), this.entity.body, new CANNON.Vec3( 0, 0.5, 0 ), 0.1 );
        this.entity.scene.physics.addConstraint( this._constraint );
    }

    dispose() {
        this.entity.scene.physics.removeConstraint( this._constraint );
        this.entity.scene.physics.removeBody( this._body );
        super.dispose();
    }

    update( dt ) {
        super.update( dt );
        if ( !this.input.state ) {
            return;
        }

        const state = this.input.state;

        if ( state.orientation ) {
            const quaternion = new CANNON.Quaternion();
            const axis       = new THREE.Vector3(0,this.radius,0);
            quaternion.set( state.orientation.x, state.orientation.y, state.orientation.z, state.orientation.w );
            axis.applyQuaternion(quaternion);
            this._body.position.set( axis.x, axis.y, axis.z );

        }

    }
}