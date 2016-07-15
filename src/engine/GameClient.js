"use strict";

import Game from "./Game";
import Input from "./input/InputClient";
import Client from "./network/Client";
import ControlSerializer from "./serializers/ControlSerializer";
import StateSerializer from "./serializers/StateSerializer";

export default class GameClient extends Game {

    /**
     * Renderer
     * @type {Renderer}
     */
    renderer = null;

    /**
     * Client
     * @type {Client}
     */
    client = null;

    constructor( options = { spectator: false } ) {
        super( options );

        // Renderer
        this.renderer = options.renderer;

        if ( !options.spectator ) {
            // Input
            this.input = new Input( this );
        }
    }

    _init() {
        super._init();

        // Client
        this.client = new Client( {
            game:      this,
            port:      4000,
            spectator: this.options.spectator
        } );

        this.client.connect();
    }

    preUpdate() {
        super.preUpdate();

        // Input
        if ( this.input ) {
            this.input.update();
            const controls = ControlSerializer.serialize( this.input.state );
            this.client.send( controls, { binary: true } );
        }

        // State
        if ( this.client.state ) {
            StateSerializer.deserialize( this.client.state, this );
            this.client.state = null; // Reset so that we don't parse the same state twice or more
        }
    }

    postUpdate() {
        super.postUpdate();

        if ( this.renderer ) {
            this.renderer.render( this._scene );
        }
    }

}