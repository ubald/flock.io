"use strict";

import Component from "../Component";

export default class PhysicsBody extends Component {
    constructor( name, { shape } ) {
        super( name );

        this._shape = shape;
    }

    get shape() {
        return this._shape;
    }
}