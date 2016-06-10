"use strict";

import "./client.less";
import io from "socket.io-client";
import Stats from "stats.js";
import {GUI} from "dat.gui";
import World from "./lib/engine/World";
import DomeSkyScene from "./lib/scenes/DomeSkyScene";
import DomeRenderer from "./client/DomeRenderer";

function main() {
    // STATS
    const stats = new Stats();
    stats.showPanel( 0 );
    document.body.appendChild( stats.dom );

    // SOCKET.IO
    const socket = io.connect();

    // WORLD
    const world = new World( 'flock.io', {
        io: socket,
        renderer:     new DomeRenderer(),
        beforeUpdate: () => stats.begin(),
        afterUpdate:  () => stats.end()
    } );
    document.body.appendChild( world.renderer.renderer.domElement );
    function onWindowResize() {
        world.setSize( window.innerWidth, window.innerHeight );
    }

    window.addEventListener( 'resize', onWindowResize, false );
    onWindowResize();

    // SCENE
    world.scene = new DomeSkyScene();

    // DAT.GUI
    const gui           = new GUI();
    //gui.remember( world.renderer );
    var domeRendererGUI = gui.addFolder( 'Dome Renderer' );
    domeRendererGUI.open();
    domeRendererGUI.add( world.renderer, 'domeAngle', 230, 270, 1 );
    domeRendererGUI.add( world.renderer, 'showGrid' );
    domeRendererGUI.add( world.renderer, 'gridResolution', 8, 128, 1 );
    domeRendererGUI.add( world.renderer, 'mapResolution', [128, 256, 512, 1024, 2048, 4096] );
    domeRendererGUI.add( world.renderer, 'mainView', world.renderer.availableViews );
    domeRendererGUI.add( world.renderer, 'showDebugViews' );
}

if ( __DEV__ ) {
    // Webpack server relaunches forces us to wait a while otherwise the static resources aren't available
    window.addEventListener( "load", setTimeout.bind( this, main, 250 ) );
} else {
    document.addEventListener( "DOMContentLoaded", main.bind( this ) );
}