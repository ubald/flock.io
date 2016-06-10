"use strict";

import CANNON from "cannon";
import Component from "../Component";

export default class Wander extends Component {

    wanderTheta    = 0.0;
    wanderPhi      = 0.0;
    wanderPsi      = 0.0;
    wanderRadius   = 1.0;
    wanderDistance = 2.5;
    wanderStep     = 0.25;
    velocity       = new CANNON.Vec3();
    offset         = new CANNON.Vec3();

    constructor( name ) {
        super( name );
    }

    update( dt ) {

        // Get current velocity
        this.velocity.copy( this.entity.body.velocity );

        // Normalize and scale by distance to put ahead of the entity
        this.velocity.normalize();
        this.velocity.mult( this.wanderDistance, this.velocity );

        // Calculate displacement force
        this.wanderTheta += -this.wanderStep + Math.random() * this.wanderStep * 2;
        this.wanderPhi += -this.wanderStep + Math.random() * this.wanderStep * 2;
        this.wanderPsi += -this.wanderStep + Math.random() * this.wanderStep * 2;

        if ( Math.random() < 0.5 ) {
            this.wanderTheta = -this.wanderTheta;
        }

        this.offset.x = this.wanderRadius * Math.cos( this.wanderTheta );
        this.offset.y = this.wanderRadius * Math.sin( this.wanderPhi );
        this.offset.z = this.wanderRadius * Math.cos( this.wanderPsi );

        this.velocity.vadd( this.offset, this.velocity );

        this.entity.body.force.vadd(this.velocity, this.entity.body.force);
        //force.setxy( pos.x, pos.y );
        //force.subeq( physics.body.velocity );

        super.update( dt );
    }

}
