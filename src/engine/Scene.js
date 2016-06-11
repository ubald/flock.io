"use strict";

import Id from "./Id";
import CANNON from "cannon";

if ( __CLIENT__ ) {
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

        this._initialized = false;

        // Entities
        this._entities     = [];
        this._entitiesById = {};

        // Physics
        this.maxSubSteps = 3;
    }

    get initialized() {
        return this._initialized;
    }

    /**
     * Game
     * @returns {Game}
     */
    get game() {
        return this._game;
    }

    /**
     * Physics
     * @returns {CANNON.World}
     */
    get physics() {
        return this._physics;
    }

    /**
     * Stage
     * @returns {THREE.Scene}
     */
    get stage() {
        return this._stage;
    }

    /**
     * Entities
     * @returns {Array<Entity>}
     */
    get entities() {
        return this._entities;
    }

    /**
     * Camera
     * @returns {THREE.Camera}
     */
    get camera() {
        return this._camera;
    }

    initialize( game ) {
        this._game = game;

        this._preInit();
        this._init();
        this._postInit();

        this._initialized = true;
    }

    _preInit() {

    }

    /**
     * Initialize the scene
     */
    _init() {
        // World
        this.fixedTimeStep = 1.0 / this._game.fps; // seconds

        // Physics
        this._physics = new CANNON.World();
        this._physics.gravity.set( 0, -9.82, 0 ); // m/s²

        // Players
        for ( var id in this._game.players ) {
            this.addPlayer( this._game.players[id] );
        }

        // Visual
        if ( __CLIENT__ ) {
            this._stage = new THREE.Scene();
        }

    }

    _postInit() {
        if ( __CLIENT__ ) {
            this._game.renderer.camera = this._camera;
        }

        this._entities.forEach( entity => entity.init() );
    }

    /**
     * Destroy the scene
     */
    dispose() {
        if ( __CLIENT__ ) {
            this._stage = null;
        }

        this._entities.forEach( entity => entity.dispose() );
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
        this._entitiesById[entity.name] = entity;
        if ( this._initialized ) {
            entity.init();
        }
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
        this._entities.splice( this._entities.indexOf( entity ), 1 );
        delete this._entitiesById[entity.id];
        entity.dispose();
    }

    get( id ) {
        return this._entitiesById[id];
    }

    /**
     * Update the scene
     * @param {number} dt - Time delta since last update
     */
    update( dt ) {
        // Entities update
        this._entities.forEach( entity => entity.update( dt ) );

        if ( __SERVER__ ) {
            // Physics Update
            this._physics.step( this.fixedTimeStep, dt, this.maxSubSteps );
        }
    }

    /**
     * Add Player to Scene
     * @param {Player} player
     */
    addPlayer( player ) {
        //
    }

    /**
     * Remove Player from Scene
     * @param {Player} player
     */
    removePlayer( player ) {
        //
    }
}