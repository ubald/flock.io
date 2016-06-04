"use strict";

import Scene from "../engine/Scene";

if (__CLIENT__) {
    var THREE = require( "three" );
}

export default class TestScene extends Scene {
    constructor() {
        super();
    }

    init(world) {
        super.init(world);

        if ( __CLIENT__ ) {
            var texture   = new THREE.TextureLoader().load( "ash_uvgrid01.jpg" );
            this.material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide } );

            this.sphereGeometry = new THREE.SphereGeometry( 400, 64, 64 );
            this.sphereMesh = new THREE.Mesh( this.sphereGeometry, this.material );
            this.sphereMesh.receiveShadow = true;
            this.scene.add( this.sphereMesh );

            this.boxGeometry = new THREE.BoxGeometry( 100, 100, 100, 4, 4, 4 );
            this.boxMesh = new THREE.Mesh( this.boxGeometry, this.material );
            this.boxMesh.castShadow = true;
            this.boxMesh.position.y = 300;
            this.scene.add( this.boxMesh );

            var light = new THREE.SpotLight( 0xffffff, 1, 600, Math.PI/2, 0.5 );
            light.castShadow = true;
            light.position.set( 0, 0, 0 );
            light.rotation.x = -Math.PI / 2;
            /*light.shadow.mapSize.width = 1024;
            light.shadow.mapSize.height = 1024;

            light.shadow.camera.near = 50;
            light.shadow.camera.far = 4000;
            light.shadow.camera.fov = 100;
            light.shadow.bias = 0.4;*/
            //this.scene.add( light );

            this.acc = 0;
        }
    }

    update(dt) {
        super.update(dt);

        if ( __CLIENT__ ) {
            this.sphereMesh.rotation.y += dt * 0.1;

            this.acc += dt;
            this.boxMesh.position.x = Math.sin(this.acc/2)* 100;
            this.boxMesh.position.z = Math.cos(this.acc/2)* 100;
            this.boxMesh.position.y = Math.sin(this.acc)* 100 + 100;
            this.boxMesh.rotation.x += dt * 0.2;
            this.boxMesh.rotation.y += dt * 0.1;
        }
    }
}