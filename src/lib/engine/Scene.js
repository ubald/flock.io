"use strict";

import Id from "./Id";
import CANNON from "cannon";

if (__CLIENT__) {
    var THREE = require( "three" );
}

/**
 * Scene
 */
export default class Scene extends Id {

    /**
     * Create a scene
     * @param {String} name
     */
    constructor( name ) {
        super( name );

        // Entities
        this._entities = [];
        
        // Physics
        this.maxSubSteps = 3;
    }

    /**
     * World
     * @returns {World}
     */
    get world() {
        return this._world;
    }

    /**
     * Physics
     * @returns {CANNON.World}
     */
    get physics() {
        return this._physics;
    }

    /**
     * Scene
     * @returns {THREE.Scene}
     */
    get scene() {
        return this._scene;
    }

    /**
     * Entities
     * @returns {Array<Entity>}
     */
    get entities() {
        return this._entities;
    }

    /**
     * Initialize the scene
     * @param {World} world
     */
    init(world) {
        // World
        this._world = world;
        this.fixedTimeStep = 1.0 / this._world.fps; // seconds

        // Physics
        this._physics = new CANNON.World();
        this._physics.gravity.set( 0, 0, -9.82 ); // m/s²
        
        // Visual
        if ( __CLIENT__ ) {
            this._scene = new THREE.Scene();
        }
    }

    /**
     * Destroy the scene
     */
    destroy() {
        if ( __CLIENT__ ) {
            this._scene = null;
        }
        this._entities.forEach( entity => entity.destroy() );
        this._physics = null;
    }

    /**
     * Add an entity to the scene
     * @param {Entity} entity
     */
    add( entity ) {
        if ( !entity ) {
            throw new Error( "You can't add a null entity" );
        }
        entity.scene = this;
        this._entities.push( entity );
    }

    /**
     * Remove an entity from the scene
     * @param {Entity} entity
     */
    remove( entity ) {
        if ( !entity ) {
            throw new Error( "You can't remove a null entity" );
        }
        if ( entity.scene != this ) {
            throw new Error( `You can't remove entity ${entity.name} from ${this.name} as this scene does not own the entity` );
        }
        entity.scene = null;
        this._entities.splice( this._entities.indexOf( entity ), 1 );
    }

    /**
     * Update the scene
     * @param {number} dt - Time delta since last update
     */
    update(dt) {

        // Entities update
        this._entities.forEach( entity => entity.update(dt) );

        // Physics Update
        this._physics.step( this.fixedTimeStep, dt, this.maxSubSteps );
    }
}