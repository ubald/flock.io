"use strict";

import "./client.less";
import World from "./lib/engine/World";
import TestScene from "./lib/scenes/TestScene";

const world = new World( 'flock.io' );
document.body.appendChild( world.renderer.domElement );
function onWindowResize() {
    world.camera.aspect = window.innerWidth / window.innerHeight;
    world.camera.updateProjectionMatrix();
    world.renderer.setSize( window.innerWidth, window.innerHeight );
}
window.addEventListener( 'resize', onWindowResize, false );
onWindowResize();

world.scene = new TestScene();


/*

 import THREE from "three";

 var scene, camera, renderer;
 var geometry, material, mesh;

 init();
 animate();

 function init() {

 scene = new THREE.Scene();

 //camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
 //camera.position.z = 1000;

 geometry = new THREE.BoxGeometry( 200, 200, 200 );
 material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

 mesh = new THREE.Mesh( geometry, material );
 scene.add( mesh );

 //renderer = new THREE.WebGLRenderer();
 //renderer.setSize( window.innerWidth, window.innerHeight );

 //document.body.appendChild( renderer.domElement );

 }

 function animate() {

 requestAnimationFrame( animate );

 mesh.rotation.x += 0.01;
 mesh.rotation.y += 0.02;

 renderer.render( scene, camera );
 }

 */



