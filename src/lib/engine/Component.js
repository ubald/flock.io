"use strict";

import Id from "./Id";

/**
 * Component
 */
export default class Component extends Id {

    /**
     * Entity
     * @type {Entity}
     * @private
     */
    _entity = null;

    /**
     * Create a component
     * @param {String} name
     * @param {Object} [config]
     */
    constructor( name, config = {}) {
        super( name );
        
        // Config
        this._config = config;
    }

    /**
     * Entity
     * @returns {Entity}
     */
    get entity() {
        return this._entity;
    }

    /**
     * Entity
     * @params {Entity} entity
     */
    set entity( entity ) {
        this._entity = entity;
    }

    /**
     * Add an component to the entity
     * @param {Component} component
     */
    addComponent( component ) {
        if ( !this._entity ) {
            throw new Error( "You can't add a component while not attached to a scene" );
        }
        this._entity.addComponent( component );
    }

    /**
     * Remove an component from the entity
     * @param {Component} component
     */
    removeComponent( component ) {
        if ( !this._entity ) {
            throw new Error( "You can't remove a component while not attached to a scene" );
        }
        this._entity.removeComponent( component );
    }

    /**
     * Initialize the component
     */
    init() {
        //
    }

    /**
     * Update the component
     * @param {number} dt - Time delta since last update
     */
    update( dt ) {
        //
    }

    /**
     * Destroy the component
     */
    dispose() {
        //
    }
}