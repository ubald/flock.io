"use strict";

import Id from "./Id";

if ( __CLIENT__ ) {
    var THREE = require( "three" );
}

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

        // Physics
        this._body = null;
        
        // Object 3D
        this._object3D = null;

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
    set scene( scene ) {
        this._scene = scene;
    }

    /**
     * Physics body
     * @returns {CANNON.body}
     */
    get body() {
        return this._body;
    }

    /**
     * Object 3D
     * @returns {THREE.Object3D}
     */
    get object3D() {
        return this._object3D;
    }

    /**
     * Components
     * @returns {Array<Component>}
     */
    get components() {
        return this._components;
    }
    
    /*get position() {
        return this._body ? this._body.position : this._object3D.position;
    }

    get rotation() {
        return this._body ? this._body.position : this._object3D.rotation;
    }

    get quaternion() {
        return this._body ? this._body.position : this._object3D.quaternion;
    }*/

    /**
     * Add an component to the entity
     * @param {Component} component
     */
    addComponent( component ) {
        if ( !component ) {
            throw new Error( "You can't add a null component" );
        }
        component.entity = this;
        this._components.push( component );
        if ( this._scene && this._scene.initialized ) {
            component.init();
        }
    }

    /**
     * Remove an component from the entity
     * @param {Component} component
     */
    removeComponent( component ) {
        if ( !component ) {
            throw new Error( "You can't remove a null component" );
        }
        if ( component.entity != this ) {
            throw new Error( `You can't remove component ${component.name} from ${this.name} as this scene does not own the component` );
        }
        component.entity = null;
        this._components.splice( this._components.indexOf( component ), 1 );
    }

    /**
     * Add THREE.Object3D object to the stage (THREE.Scene)
     * @param {THREE.Object3D} object3D
     */
    addObject( object3D ) {
        this.object3D.add( object3D );
    }

    /**
     * Remove THREE.Object3D object from the stage (THREE.Scene)
     * @param {THREE.Object3D} object3D
     */
    removeObject( object3D ) {
        this.object3D.remove( object3D );
    }

    init() {
        if ( this.body ) {
            this._scene.physics.addBody(this.body);
        }
        if ( __CLIENT__ ) {
            this._object3D = new THREE.Object3D();
            this._scene.stage.add( this._object3D );
        }
        this._components.forEach( component => component.init );
    }

    /**
     * Update the entity
     * @param {number} dt - Time delta since last update
     */
    update( dt ) {
        // Entities update
        this._components.forEach( component => component.update( dt ) );

        if ( __CLIENT__ ) {
            if ( this._body ) {
                this._object3D.position.copy( this._body.position );
                this._object3D.quaternion.copy( this._body.quaternion );
            }
        }
    }

    /**
     * Destroy an entity
     */
    dispose() {
        if ( this.body ) {
            this._scene.physics.removeBody(this.body);
        }
        this._components.forEach( components => components.dispose() );
        this._scene.stage.remove( this._object3D );
        this._object3D = null;
    }
}