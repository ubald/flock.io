"use strict";

import "./client.less";
import Stats from "stats.js";
import {GUI} from "dat.gui";

import FlockIo from "./lib/FlockIo";
import DomeRenderer from "./client/DomeRenderer";
import DesktopRenderer from "./client/DesktopRenderer";

function main() {

    let showStats = false;

    // GAME
    let options = {};
    let renderer;

    // QUICK & DIRTY ROUTER
    switch ( location.pathname.substring( 1 ) ) {
        case 'dome':

            // GAME SETUP
            options.spectator = true;

            // RENDERER
            renderer = new DomeRenderer(210);

            // DAT.GUI
            const gui           = new GUI();
            //gui.remember( renderer );
            var domeRendererGUI = gui.addFolder( 'Dome Renderer' );
            domeRendererGUI.open();
            domeRendererGUI.add( renderer, 'north', 0, 360, 1 );
            domeRendererGUI.add( renderer, 'domeAngle', 230, 270, 1 );
            domeRendererGUI.add( renderer, 'showGrid' );
            domeRendererGUI.add( renderer, 'gridResolution', 8, 128, 1 );
            domeRendererGUI.add( renderer, 'mapResolution', [128, 256, 512, 1024, 2048, 4096] );
            domeRendererGUI.add( renderer, 'mainView', renderer.availableViews );
            domeRendererGUI.add( renderer, 'showDebugViews' );

            break;

        case 'desktop':
            // GAME SETUP
            options.desktop = true;

            // RENDERER
            renderer = new DesktopRenderer();

            break;

        case 'mobile':
        default:
            // GAME SETUP
            options.desktop = false;

            break;
    }

    // GAME SETUP
    options.renderer = renderer;
    const game = new FlockIo( options );

    // STATS
    if ( showStats ) {
        const stats = new Stats();
        stats.showPanel( 0 );
        document.body.appendChild( stats.dom );

        game.beforeUpdate = () => stats.begin();
        game.afterUpdate = () => stats.end();
    }

    // GAME INIT
    game.initialize();

    document.body.appendChild( renderer.renderer.domElement );
    function onWindowResize() {
        renderer.setSize( window.innerWidth, window.innerHeight );
    }

    window.addEventListener( 'resize', onWindowResize, false );
    onWindowResize();
}

if ( __DEV__ ) {
    // Webpack server relaunches forces us to wait a while otherwise the static resources aren't available
    window.addEventListener( "load", setTimeout.bind( this, main, 250 ) );
} else {
    document.addEventListener( "DOMContentLoaded", main.bind( this ) );
}