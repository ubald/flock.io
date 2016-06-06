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

    _showDebugViews = true;
    _mainView       = 'scene';

    /**
     * Create a Dome Renderer
     *
     * @param {float} domeAngle - Dome angle in degrees (ex: 180 or 210)
     * @param {float} domeAngle - Dome angle in degrees (ex: 180 or 210)
     * @param {int} gridResolution - Resolution of the grid onto which the cube map is projected (grid size)
     * @param {int} mapResolution - Cube map resolution (pixels per face)
     */
    constructor( domeAngle = 180, gridResolution = 64, mapResolution = 1024 ) {
        super( new THREE.WebGLRenderer( { antialias: true } ) );

        this._domeAngle      = domeAngle;
        this._showGrid       = false;
        this._gridResolution = gridResolution;
        this._mapResolution  = mapResolution;

        this.camera = null;

        // Create the scene into which we'll render the dome master
        this.domeScene = new THREE.Scene();

        // Preview Camera - Monitor to preview what happens in the scene
        this.debugCamera            = new THREE.PerspectiveCamera( 90, 1, 0.01, 100000 );
        this.debugCamera.position.z = 20;
        this.controls               = new THREE.OrbitControls( this.debugCamera, this._renderer.domElement );

        // Orthographic Camera - To capture the projected cube map
        this.domeCamera            = new THREE.OrthographicCamera( -0.5, 0.5, 0.5, -0.5, 0.01, 100000 );
        this.domeCamera.position.x = 0;
        this.domeCamera.position.y = 0;
        this.domeCamera.position.z = 1024; // Totally arbitrary
        this.domeScene.add( this.domeCamera );

        this.setup();
    }

    get domeAngle() {
        return this._domeAngle;
    }

    set domeAngle( domeAngle ) {
        this._domeAngle = domeAngle;
        this.reset();
    }

    get gridResolution() {
        return this._gridResolution;
    }

    set gridResolution( gridResolution ) {
        this._gridResolution = gridResolution;
        this.reset();
    }

    get mapResolution() {
        return this._mapResolution;
    }

    set mapResolution( mapResolution ) {
        this._mapResolution = mapResolution;
        this.reset();
    }

    get showGrid() {
        return this._showGrid;
    }

    set showGrid( showGrid ) {
        this._showGrid = showGrid;
        this.reset();
    }

    get mainView() {
        return this._mainView;
    }

    set mainView( view ) {
        this._mainView = view;
        this.updateCameras();
        this.updateSizes();
    }

    get availableViews() {
        return ['dome', 'scene', 'debug'];
    }

    get showDebugViews() {
        return this._showDebugViews;
    }

    set showDebugViews( debug ) {
        this._showDebugViews = debug;
        this.updateSizes();
    }

    _mainCamera   = null;
    _debugCameraA = null;
    _debugCameraB = null;

    updateCameras() {
        switch ( this._mainView ) {
            case 'dome':
                this._mainCamera   = this.domeCamera;
                this._debugCameraA = this.debugCamera;
                this._debugCameraB = this._camera;
                break;
            case 'scene':
                this._mainCamera   = this._camera;
                this._debugCameraA = this.debugCamera;
                this._debugCameraB = this.domeCamera;
                break;
            case 'debug':
                this._mainCamera   = this.debugCamera;
                this._debugCameraA = this.domeCamera;
                this._debugCameraB = this._camera;
                break;
        }
        this.updateSizes()
    }

    updateSizes() {
        super.updateSizes();
        if ( this._mainCamera ) {
            this._mainCamera.aspect = ( this._width - (this._height / 2) ) / this.height;
            this._mainCamera.updateProjectionMatrix();
        }
        if ( this._debugCameraA ) {
            this._debugCameraA.aspect = 1;
            this._debugCameraA.updateProjectionMatrix();
        }
        if ( this._debugCameraB ) {
            this._debugCameraB.aspect = 1;
            this._debugCameraB.updateProjectionMatrix();
        }
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
            shading:        THREE.FlatShading, // Not sure it really changes anything on a custom shader
            vertexShader:   DomeVertex,
            fragmentShader: DomeFragment,
            uniforms:       {
                map: { type: 't', value: this.cubeCamera.renderTarget.texture }
            }
        } );
        this.domeMesh     = new THREE.Mesh( this.domeGeometry, this.domeMaterial );
        this.domeScene.add( this.domeMesh );
    }

    tearDown() {
        if ( this.domeMesh ) {
            this.domeScene.remove( this.domeMesh );
        }
        this.domeMesh     = null;
        this.domeGeometry = null;
        if ( this.domeMaterial ) {
            this.domeMaterial.dispose();
        }
        this.domeMaterial = null;

        if ( this.wireframeMesh ) {
            this.domeScene.remove( this.wireframeMesh );
        }
        this.wireframeMesh     = null;
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
        super.render( scene );

        if ( this._showDebugViews ) {
            this.controls.update();
        }

        // Update cube cam
        this.cubeCamera.updateCubeMap( this._renderer, scene.stage );

        // Render full size viewer
        if ( this._showDebugViews ) {
            this._renderer.setViewport( (this._height / 2), 0, this._width - (this._height / 2), this._height );
            this._renderer.setScissor( (this._height / 2), 0, this._width - (this._height / 2), this._height );
            this._renderer.setScissorTest( true );
        } else {
            this._renderer.setScissorTest( false );
        }
        this._renderer.render( this._mainView == 'dome' ? this.domeScene : scene.stage, this._mainCamera );

        if ( this._showDebugViews ) {
            this._renderer.setViewport( 0, 0, this._height / 2, this._height / 2 );
            this._renderer.setScissor( 0, 0, this._height / 2, this._height / 2 );
            this._renderer.setScissorTest( true );
            this._renderer.render( this._mainView == 'debug' ? this.domeScene : scene.stage, this._debugCameraA );

            this._renderer.setViewport( 0, this._height / 2, this._height / 2, this._height / 2 );
            this._renderer.setScissor( 0, this._height / 2, this._height / 2, this._height / 2 );
            this._renderer.setScissorTest( true );
            this._renderer.render( this._mainView == 'scene' ? this.domeScene : scene.stage, this._debugCameraB );
            /*
            // Render mini viewer
            this.renderer.setViewport( 12, 12, 256, 256 );
            this.renderer.setScissor( 12, 12, 256, 256 );
            this.renderer.setScissorTest( true );
            if ( this.swapViewers ) {
                this.renderer.render( this.domeScene, this.domeCamera );
            } else {
                this.renderer.render( scene.stage, this.camera );
            }

            if ( scene.camera ) {
                this.renderer.setViewport( 12 + 256 + 12, 12, 256, 256 );
                this.renderer.setScissor( 12 + 256 + 12, 12, 256, 256 );
                this.renderer.setScissorTest( true );
                if ( this._showDebugCamera ) {
                    this.renderer.render( scene.stage, scene.camera );
                } else {
                    this.renderer.render( scene.stage, this.debugCamera );
                }
            }*/
        }
    }

}