"use strict";

/**
 * Base class for any object with an internal id
 */
export default class Id {
    
    /**
     * @param {String} name
     */
    constructor( name ) {
        this._name = name;
    }

    /**
     * Object Name
     * @returns {String}
     */
    get name() {
        return this._name;
    }
}