"use strict";

import Id from "./Id";

export default class Scene extends Id {
    constructor( name ) {
        super( name );

        this.entities = [];
    }

    init() {

    }

    destroy() {

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
        this.entities.push( entity );
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
        this.entities.splice( this.entities.indexOf( entity ), 1 );
    }
    
    update() {
        entities.forEach( entity => entity.update() );
    }
}