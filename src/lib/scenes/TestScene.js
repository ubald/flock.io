"use strict";

import Scene from "../engine/Scene";

/*
import Body from "cannon/objects/Body"
import Plane from "cannon/shapes/Plane"
import Sphere from "cannon/shapes/Sphere"
import Vec3 from "cannon/math/Vec3"*/

export default class TestScene extends Scene {
    constructor() {
        super();
        
        // Setup our world
        /*var world = new World();
        world.gravity.set(0, 0, -9.82); // m/s²

        // Create a sphere
        var radius = 1; // m
        var sphereBody = new Body({
            mass: 5, // kg
            position: new Vec3(0, 0, 10), // m
            shape: new Sphere(radius)
        });
        world.addBody(sphereBody);

        // Create a plane
        var groundBody = new Body({
            mass: 0 // mass == 0 makes the body static
        });
        var groundShape = new Plane();
        groundBody.addShape(groundShape);
        world.addBody(groundBody);

        var fixedTimeStep = 1.0 / 60.0; // seconds
        var maxSubSteps = 3;

        // Start the simulation loop
        var lastTime;
        (function simloop(time){
            requestAnimationFrame(simloop);
            if(lastTime !== undefined){
                var dt = (time - lastTime) / 1000;
                world.step(fixedTimeStep, dt, maxSubSteps);
            }
            //console.log("Sphere z position: " + sphereBody.position.z);
            lastTime = time;
        })();*/
    }
    
    update() {
        super.update();
        
        
    }
}