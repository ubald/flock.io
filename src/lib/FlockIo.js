"use strict";

import DomeSkyScene from "./scenes/DomeSkyScene";

if ( __SERVER__ ) {
    var Game = require( "../engine/GameServer" ).default;
} else if ( __CLIENT__ ) {
    var Game = require( "../engine/GameClient" ).default;
}

export default class FlockIo extends Game {
    constructor() {
        super();
        this._scene      = new DomeSkyScene();
    }
}