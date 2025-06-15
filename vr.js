function setupVR() {
    app.vrButton = document.getElementById('vrButton');
    app.vrStatus = document.getElementById('vrStatus');
    
    // Check if WebXR is supported
    if ('xr' in navigator) {
        navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
            if (supported) {
                app.vrButton.disabled = false;
                app.vrButton.textContent = 'Enter VR';
                app.vrStatus.textContent = 'VR Ready! 🥽';
            } else {
                app.vrStatus.textContent = 'VR not supported - try WebXR emulator';
            }
        });
    } else {
        app.vrStatus.textContent = 'WebXR not available - try WebXR emulator';
    }

    app.vrButton.addEventListener('click', async () => {
        if (app.renderer.xr.isPresenting) {
            app.renderer.xr.getSession().end();
        } else {
            try {
                // Request VR session with proper options
                const session = await navigator.xr.requestSession('immersive-vr', {
                    optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking']
                });
                
                // Set reference space explicitly
                app.renderer.xr.setReferenceSpaceType('local-floor');
                
                // Try to set the session, fallback if local-floor not supported
                try {
                    await app.renderer.xr.setSession(session);
                } catch (error) {
                    console.warn('local-floor not supported, falling back to local');
                    app.renderer.xr.setReferenceSpaceType('local');
                    await app.renderer.xr.setSession(session);
                }
                
                app.vrButton.textContent = 'Exit VR';
                app.vrStatus.textContent = 'In VR Mode - Walk around! 🚶‍♂️';
                app.isVRMode = true;
                
                // Stop auto-rotation in VR mode
                app.autoRotate = false;
                
                session.addEventListener('end', () => {
                    app.vrButton.textContent = 'Enter VR';
                    app.vrStatus.textContent = 'VR Ready! 🥽';
                    app.isVRMode = false;
                    // Resume auto-rotation for desktop
                    app.autoRotate = true;
                });
                
            } catch (error) {
                console.error('Failed to start VR session:', error);
                app.vrStatus.textContent = 'Failed to start VR: ' + error.message;
            }
        }
    });

    // Setup VR controllers
    app.controller1 = app.renderer.xr.getController(0);
    app.controller1.addEventListener('selectstart', onControllerSelectStart);
    app.controller1.addEventListener('selectend', onControllerSelectEnd);
    app.scene.add(app.controller1);

    app.controller2 = app.renderer.xr.getController(1);
    app.controller2.addEventListener('selectstart', onControllerSelectStart);
    app.controller2.addEventListener('selectend', onControllerSelectEnd);
    app.scene.add(app.controller2);

    // Add controller models (simple rays)
    const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -1)
    ]);
    const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ 
        color: 0x00ff00,
        transparent: true,
        opacity: 0.5
    }));
    line.name = 'line';
    line.scale.z = 5;
    
    const line1 = line.clone();
    const line2 = line.clone();
    app.controller1.add(line1);
    app.controller2.add(line2);
}

function onControllerSelectStart(event) {
    const controller = event.target;
    const line = controller.getObjectByName('line');
    if (line) line.material.color.setHex(0xff0000);
    
    // Check if pointing at Earth
    const tempMatrix = new THREE.Matrix4();
    tempMatrix.identity().extractRotation(controller.matrixWorld);
    
    app.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    app.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);
    
    const intersects = app.raycaster.intersectObject(app.earthMesh);
    if (intersects.length > 0) {
        app.vrInteractionActive = true;
        app.vrInteractionStartPoint.copy(controller.position);
        app.earthMesh.quaternion.clone(app.vrInteractionStartRotation);
    }
}

function onControllerSelectEnd(event) {
    const controller = event.target;
    const line = controller.getObjectByName('line');
    if (line) line.material.color.setHex(0x00ff00);
    
    app.vrInteractionActive = false;
}

function handleVRInteraction() {
    if (!app.renderer.xr.isPresenting || !app.vrInteractionActive) return;
    
    // Handle controller-based Earth rotation
    [app.controller1, app.controller2].forEach(controller => {
        if (controller && app.vrInteractionActive) {
            // Calculate rotation based on controller movement
            const delta = new THREE.Vector3().subVectors(
                controller.position, 
                app.vrInteractionStartPoint
            );
            
            // Apply rotation with damping
            app.earthMesh.rotation.y = app.vrInteractionStartRotation.y + delta.x * 2;
            app.earthMesh.rotation.x = app.vrInteractionStartRotation.x + delta.y * 2;
            
            // Clamp X rotation
            app.earthMesh.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, app.earthMesh.rotation.x));
        }
    });
}