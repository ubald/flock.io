"use strict";

import Id from "./Id";

/**
 * Entity
 */
export default class Entity extends Id {

    /**
     * Create an entity
     * @param {String} name
     */
    constructor( name ) {
        super( name );

        // Components
        this._components = [];
    }

    /**
     * Scene
     * @returns {Scene}
     */
    get scene() {
        return this._scene;
    }

    /**
     * Scene
     * @params {Scene} scene
     */
    set scene(scene) {
        this._scene = scene;
    }

    /**
     * Components
     * @returns {Array<Component>}
     */
    get components() {
        return this._components;
    }

    /**
     * Add an component to the entity
     * @param {Component} component
     */
    add( component ) {
        if ( !component ) {
            throw new Error( "You can't add a null component" );
        }
        component.entity = this;
        this._components.push( component );
    }

    /**
     * Remove an component from the entity
     * @param {Component} component
     */
    remove( component ) {
        if ( !component ) {
            throw new Error( "You can't remove a null component" );
        }
        if ( component.scene != this ) {
            throw new Error( `You can't remove component ${component.name} from ${this.name} as this scene does not own the component` );
        }
        component.entity = null;
        this._components.splice( this._components.indexOf( component ), 1 );
    }

    /**
     * Update the entity
     * @param {number} dt - Time delta since last update
     */
    update(dt) {

        // Entities update
        this._components.forEach( component => component.update(dt) );
    }

    /**
     * Destroy an entity
     */
    destroy() {
        this._components.forEach( components => components.destroy() );
    }
}