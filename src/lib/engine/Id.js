"use strict";

export default class Id {
    constructor( name ) {
        this._name = name;
    }

    get name() {
        return this._name;
    }
}