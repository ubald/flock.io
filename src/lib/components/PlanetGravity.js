"use strict";

import _ from "lodash";
import THREE from "three";
import CANNON from "cannon";
import {PI_2} from "../../engine/math/Math";
import Component from "../../engine/Component";

export default class PlanetGravity extends Component {

    constructor( name, config ) {
        super( name, config );
        _.defaults( this._config, { position: new CANNON.Vec3( 0, 0, 0 ), radius: 1, gravity: 9.82, fly: false } );
    }

    force       = new THREE.Vector3();
    front       = new THREE.Vector3( 0, 0, 1 );
    side        = new THREE.Vector3( -1, 0, 0 );
    localCenter = new THREE.Vector3();
    attitude    = new CANNON.Vec3();

    update( dt ) {
        super.update( dt );

        // SURFACE GRAVITY
        if ( this._config.fly ) {
            // Soft surface gravity, objects will float around the radius
            this.force
                .copy( this.entity.body.position )
                .setLength( this.entity.body.position.length() - this._config.radius );
        } else {
            // Hard surface gravity, objects are constantly pulled towards the center, use a surface to collide with
            this.force
                .copy( this.entity.body.position );
        }
        this.force.multiplyScalar( this.entity.body.mass * this._config.gravity );
        this.entity.body.force.vsub( this.force, this.entity.body.force );
        
        // SURFACE ALIGNMENT
        this.entity.body.pointToLocalFrame( this._config.position, this.localCenter );
        let pitch = this.front.angleTo( this.localCenter ) - PI_2;
        let roll  = this.side.angleTo( this.localCenter ) - PI_2;

        // Protection for when the player is dead-center, thus having no angle at all
        if ( isNaN( pitch ) ) {
            pitch = 0.00;
        }
        if ( isNaN( roll ) ) {
            roll = 0.00;
        }

        this.attitude.set( pitch * 0.25, 0.0, roll * 0.05 );
        this.entity.body.vectorToWorldFrame( this.attitude, this.attitude );
        this.entity.body.angularVelocity.vadd( this.attitude, this.entity.body.angularVelocity );
    }
}