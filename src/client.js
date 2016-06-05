"use strict";

import "./client.less";
import io from "socket.io-client";
import Stats from "stats.js";
import {GUI} from "dat.gui";
import World from "./lib/engine/World";
import TestScene from "./lib/scenes/TestScene";
import DomeView from "./client/DomeRenderer";

// STATS
const stats = new Stats();
stats.showPanel( 0 );
document.body.appendChild( stats.dom );

// SOCKET.IO
const socket = io.connect();

// WORLD
const world = new World( 'flock.io', {
    renderer:     new DomeView(),
    beforeUpdate: () => stats.begin(),
    afterUpdate:  () => stats.end()
} );
document.body.appendChild( world.renderer.renderer.domElement );
function onWindowResize() {
    //world.camera.aspect = window.innerWidth / window.innerHeight;
    //world.camera.updateProjectionMatrix();
    world.renderer.renderer.setSize( window.innerWidth, window.innerHeight );
}
window.addEventListener( 'resize', onWindowResize, false );
onWindowResize();

// SCENE
world.scene = new TestScene();

// DAT.GUI
const gui = new GUI();
//gui.remember( world.renderer );
var domeRendererGUI = gui.addFolder( 'Dome Renderer' );
domeRendererGUI.open();
domeRendererGUI.add( world.renderer, 'domeAngle', 180, 270, 1 );
domeRendererGUI.add( world.renderer, 'showGrid' );
domeRendererGUI.add( world.renderer, 'gridResolution', 8, 128, 1 );
domeRendererGUI.add( world.renderer, 'mapResolution', [ 128, 256, 512, 1024, 2048, 4096] );
domeRendererGUI.add( world.renderer, 'swapViewers' );
domeRendererGUI.add( world.renderer, 'showDebugCamera' );
