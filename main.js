// Initialize the application
function init() {
    // Setup the scene
    setupScene();
    
    // Create Earth
    createEarth();
    
    // Setup controls
    setupControls();
    
    // Setup VR
    setupVR();
    
    // Start animation loop
    app.renderer.setAnimationLoop(animate);
}

// Start the application
init();