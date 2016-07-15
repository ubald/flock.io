"use strict";

import THREE from "three";
import Renderer from "../engine/Renderer";

/**
 * Desktop Renderer for THREE.js
 */
export default class DesktopRenderer extends Renderer {

    /**
     * Create a Desktop Renderer
     */
    constructor() {
        super( new THREE.WebGLRenderer( { antialias: true } ) );
    }

    updateSizes() {
        super.updateSizes();
        this._renderer.setViewport( 0, 0, this._width, this._height );
        this._camera.aspect = this._width / this.height;
        this._camera.updateProjectionMatrix();
    }

    render( scene ) {
        super.render( scene );
        this._renderer.render( scene.stage, scene.camera );
    }

}