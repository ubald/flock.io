"use strict";

import "./client.less";
import Stats from "stats.js";
import {GUI} from "dat.gui";

import FlockIo from "./lib/FlockIo";
import DomeRenderer from "./client/DomeRenderer";

function main() {
    // STATS
    const stats = new Stats();
    stats.showPanel( 0 );
    document.body.appendChild( stats.dom );

    // GAME
    const game = new FlockIo();
    const renderer = new DomeRenderer();
    game.renderer = renderer;
    game.beforeUpdate = () => stats.begin();
    game.afterUpdate = () => stats.end();
    game.initialize();

    document.body.appendChild( renderer.renderer.domElement );
    function onWindowResize() {
        renderer.setSize( window.innerWidth, window.innerHeight );
    }

    window.addEventListener( 'resize', onWindowResize, false );
    onWindowResize();

    // DAT.GUI
    const gui           = new GUI();
    //gui.remember( renderer );
    var domeRendererGUI = gui.addFolder( 'Dome Renderer' );
    domeRendererGUI.open();
    domeRendererGUI.add( renderer, 'domeAngle', 230, 270, 1 );
    domeRendererGUI.add( renderer, 'showGrid' );
    domeRendererGUI.add( renderer, 'gridResolution', 8, 128, 1 );
    domeRendererGUI.add( renderer, 'mapResolution', [128, 256, 512, 1024, 2048, 4096] );
    domeRendererGUI.add( renderer, 'mainView', renderer.availableViews );
    domeRendererGUI.add( renderer, 'showDebugViews' );
}

if ( __DEV__ ) {
    // Webpack server relaunches forces us to wait a while otherwise the static resources aren't available
    window.addEventListener( "load", setTimeout.bind( this, main, 250 ) );
} else {
    document.addEventListener( "DOMContentLoaded", main.bind( this ) );
}