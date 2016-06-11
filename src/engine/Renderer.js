"use strict";

/**
 * Game Renderer
 */
export default class Renderer {

    /**
     * THREE Renderer
     * @type {THREE.WebGLRenderer}
     * @protected
     */
    _renderer = null;
    
    /**
     * Main Camera
     * @type {THREE.Camera}
     * @protected
     */
    _camera = null;

    /**
     * Width
     * @type {number}
     * @protected
     */
    _width = 1;
    
    /**
     * Height
     * @type {number}
     * @protected
     */
    _height = 1;

    /**
     * Create a game renderer
     * @param {THREE.WebGLRenderer} renderer
     */
    constructor( renderer ) {
        this._renderer = renderer;
        this._renderer.setPixelRatio( window.devicePixelRatio );
    }

    get camera() {
        return this._camera;
    }

    set camera(camera) {
        this._camera = camera;
        this.updateCameras();
    }
    
    get width() {
        return this._width;
    }
    
    get height() {
        return this._height;
    }

    get renderer() {
        return this._renderer;
    }

    setSize( width, height ) {
        this._width = width;
        this._height = height;
        this.updateSizes();
    }
    
    updateSizes() {
        this._renderer.setSize( this._width, this._height );
    }

    /**
     * Render the game
     * 
     * @param {Scene} scene
     */
    render(scene) {
        //
    }
}