"use strict";

import THREE from "three";
import "three/examples/js/controls/OrbitControls";
import Renderer from "../lib/engine/Renderer";
import DomeVertex from "./shaders/DomeVertex.glsl";
import DomeFragment from "./shaders/DomeFragment.glsl";

/**
 * Dome Renderer for THREE.js
 */
export default class DomeRenderer extends Renderer {

    /**
     * Create a Dome Renderer
     *
     * @param {float} domeAngle - Dome angle in degrees (ex: 180 or 210)
     * @param {int} gridResolution - Resolution of the grid onto which the cube map is projected (grid size)
     * @param {int} mapResolution - Cube map resolution (pixels per face)
     */
    constructor( domeAngle = 210, gridResolution = 64, mapResolution = 1024 ) {
        super();

        this._domeAngle = domeAngle;
        this._showGrid = false;
        this._gridResolution = gridResolution;
        this._mapResolution = mapResolution;
        
        // Create the renderer
        this.renderer = new THREE.WebGLRenderer( {
            antialias: true
        } );
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        //this.renderer.shadowMap.renderSingleSided = false;
        //this.renderer.gammaInput = true;
        //this.renderer.gammaOutput = true;
        this.renderer.setPixelRatio( window.devicePixelRatio );

        // Create the scene into which we'll render the dome master
        this.domeScene = new THREE.Scene();

        // Preview Camera - Monitor to preview what happens in the scene
        this.previewCamera            = new THREE.PerspectiveCamera( 90, 1, 1, 100000 );
        this.previewCamera.position.z = 1000;
        this.controls                 = new THREE.OrbitControls( this.previewCamera );

        // Orthographic Camera - To capture the projected cube map
        this.camera            = new THREE.OrthographicCamera( -0.5, 0.5, 0.5, -0.5, 1, 100000 );
        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = 1024; // Totally arbitrary
        this.domeScene.add( this.camera );

        this.setup();
    }

    get domeAngle() {
        return this._domeAngle;
    }

    set domeAngle(domeAngle) {
        this._domeAngle = domeAngle;
        this.reset();
    }

    get gridResolution() {
        return this._gridResolution;
    }

    set gridResolution(gridResolution) {
        this._gridResolution = gridResolution;
        this.reset();
    }

    get mapResolution() {
        return this._mapResolution;
    }

    set mapResolution(mapResolution) {
        this._mapResolution = mapResolution;
        this.reset();
    }

    get showGrid() {
        return this._showGrid;
    }

    set showGrid(showGrid) {
        this._showGrid = showGrid;
        this.reset();
    }

    setup() {
        // Cube camera - To film the real scene
        this.cubeCamera            = new THREE.CubeCamera( 1, 100000, this._mapResolution );
        this.cubeCamera.position.x = 0;
        this.cubeCamera.position.y = 0;
        this.cubeCamera.position.z = 0;
        this.cubeCamera.rotation.x = -Math.PI / 2; // Had to rotate, I don't understand the mapping maths

        // Preview wireframe, just for debug
        if ( this._showGrid ) {
            this.wireframeGeometry        = new THREE.PlaneBufferGeometry( 1, 1, this._gridResolution, this._gridResolution );
            this.wireframeMaterial        = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } );
            this.wireframeMesh            = new THREE.Mesh( this.wireframeGeometry, this.wireframeMaterial );
            this.wireframeMesh.position.z = 10; // It just has to be above the rest
            this.domeScene.add( this.wireframeMesh );
        }

        // Plane onto which we'll project the dome master
        this.domeGeometry = new THREE.PlaneBufferGeometry( 1, 1, this._gridResolution, this._gridResolution );

        // Mapped vertices
        const vertices    = this.domeGeometry.attributes.position.array;
        const domeMap     = new Float32Array( vertices.length );
        const vertexCount = vertices.length;

        // Mapping setup
        const PI_2 = Math.PI / 2;

        /**
         * Dome Sphere radius
         * @type {number}
         */
        const sphere_radius = 1;

        /**
         * Radius of the bottom part of the dome
         * Not really helpful because you don't know if it past 180 degrees or not
         * @type {number}
         */
        const collar_radius = Math.sin( ( this._domeAngle * ( Math.PI / 180 ) ) - PI_2 );//0.45;

        /**
         * Some distance, don't know really what's going on here
         * @type {number}
         */
        const distance = Math.sqrt( sphere_radius * sphere_radius - collar_radius * collar_radius );

        // Map each vertex
        for ( var i = 0; i < vertexCount; i += 3 ) {
            const delta = new THREE.Vector2( vertices[i], vertices[i + 1] );
            const theta = Math.atan2( -delta.y, delta.x );
            let phi     = Math.PI * delta.length(); // PI_2 * delta.length() / screenRadius;
            // NOTE: Why would I want the borders to be crappy? if ( phi > PI_2 ) phi = PI_2;
            var f = distance * Math.sin( phi );
            var e = distance * Math.cos( phi ) + Math.sqrt( sphere_radius * sphere_radius - f * f );
            var l = e * Math.cos( phi );
            var h = e * Math.sin( phi );
            var z = l - distance;

            domeMap[i]     = h * Math.cos( theta ) / sphere_radius;
            domeMap[i + 1] = h * Math.sin( theta ) / sphere_radius;
            domeMap[i + 2] = z / sphere_radius;
        }

        // Setup geometry + mesh
        this.domeGeometry.addAttribute( 'domeMap', new THREE.BufferAttribute( domeMap, 3 ) );

        // Dome materials, with shaders handling the mapping
        this.domeMaterial = new THREE.ShaderMaterial( {
            shading: THREE.FlatShading, // Not sure it really changes anything on a custom shader
            vertexShader:   DomeVertex,
            fragmentShader: DomeFragment,
            uniforms:       {
                map: { type: 't', value: this.cubeCamera.renderTarget.texture }
            }
        } );
        this.domeMesh = new THREE.Mesh( this.domeGeometry, this.domeMaterial );
        this.domeScene.add( this.domeMesh );
    }

    tearDown() {
        if ( this.domeMesh ) {
            this.domeScene.remove( this.domeMesh );
        }
        this.domeMesh = null;
        this.domeGeometry = null;
        if ( this.domeMaterial ) {
            this.domeMaterial.dispose();
        }
        this.domeMaterial = null;

        if ( this.wireframeMesh ) {
            this.domeScene.remove( this.wireframeMesh );
        }
        this.wireframeMesh = null;
        this.wireframeGeometry = null;
        if ( this.wireframeMaterial ) {
            this.wireframeMaterial.dispose();
        }
        this.wireframeMaterial = null;
    }

    reset() {
        this.tearDown();
        this.setup();
    }

    render( scene ) {
        super.render(scene);
        
        // Update cube cam
        this.cubeCamera.updateCubeMap( this.renderer, scene.scene );
        // Render dome at full size
        const size = this.renderer.getSize();
        this.renderer.setViewport( 0, 0, size.width, size.height );
        this.renderer.setScissorTest( false );
        this.renderer.render( this.domeScene, this.camera );

        // Update preview camera controls
        this.controls.update();
        // Render in a corner
        this.renderer.setViewport( 12, 12, 256, 256 );
        this.renderer.setScissor( 12, 12, 256, 256 );
        this.renderer.setScissorTest( true );
        this.renderer.render( scene.scene, this.previewCamera );
    }

}