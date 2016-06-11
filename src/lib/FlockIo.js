"use strict";

import Game from "../engine/Game";
import FlockIoPlayer from "./FlockIoPlayer";
import DomeSkyScene from "./scenes/DomeSkyScene";

export default class FlockIo extends Game {
    constructor() {
        super();
        this.playerClass = FlockIoPlayer;
        this._scene = new DomeSkyScene();
    }
}