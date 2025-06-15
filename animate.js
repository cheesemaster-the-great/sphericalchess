function animate() {
    // Handle VR interactions
    handleVRInteraction();
    
    // Auto-rotation only in desktop mode
    if (app.autoRotate && !app.isDragging && !app.isVRMode) {
        app.earthMesh.rotation.y += 0.005;
    }
    
    // Apply momentum/damping to rotation (desktop only)
    if (!app.isDragging && !app.isVRMode) {
        app.rotationVelocity.x *= 0.95;
        app.rotationVelocity.y *= 0.95;
    }
    
    app.renderer.render(app.scene, app.camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    app.camera.aspect = window.innerWidth / window.innerHeight;
    app.camera.updateProjectionMatrix();
    app.renderer.setSize(window.innerWidth, window.innerHeight);
});