import FULLTILT from "fulltilt";
var promise = new FULLTILT.getDeviceOrientation({ 'type': 'world' });
var deviceOrientation;
promise
    .then(function(controller) {
        // Store the returned FULLTILT.DeviceOrientation object
        deviceOrientation = controller;
    })
    .catch(function(message) {
        console.error(message);

        // Optionally set up fallback controls...
        // initManualControls();
    });