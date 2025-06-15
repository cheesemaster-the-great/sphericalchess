function setupControls() {
    const canvas = app.renderer.domElement;
    
    // Mouse events
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('wheel', onWheel);
    
    // Touch events for mobile
    canvas.addEventListener('touchstart', onTouchStart);
    canvas.addEventListener('touchmove', onTouchMove);
    canvas.addEventListener('touchend', onTouchEnd);
    
    // Prevent context menu
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
}

function onMouseDown(event) {
    app.isDragging = true;
    app.autoRotate = false;
    app.previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
}

function onMouseMove(event) {
    if (app.isDragging) {
        const deltaMove = {
            x: event.clientX - app.previousMousePosition.x,
            y: event.clientY - app.previousMousePosition.y
        };
        
        app.rotationVelocity.y = deltaMove.x * 0.01;
        app.rotationVelocity.x = deltaMove.y * 0.01;
        
        app.earthMesh.rotation.y += app.rotationVelocity.y;
        app.earthMesh.rotation.x += app.rotationVelocity.x;
        
        // Clamp X rotation to prevent flipping
        app.earthMesh.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, app.earthMesh.rotation.x));
        
        app.previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }
}

function onMouseUp() {
    app.isDragging = false;
    // Resume auto-rotation after a delay
    setTimeout(() => {
        if (!app.isDragging) {
            app.autoRotate = true;
        }
    }, 2000);
}

function onWheel(event) {
    const zoomSpeed = 0.1;
    const minDistance = 1.5;
    const maxDistance = 10;
    
    app.camera.position.z += event.deltaY * zoomSpeed * 0.01;
    app.camera.position.z = Math.max(minDistance, Math.min(maxDistance, app.camera.position.z));
}

// Touch events
function onTouchStart(event) {
    if (event.touches.length === 1) {
        app.isDragging = true;
        app.autoRotate = false;
        app.previousMousePosition = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
        };
    }
}

function onTouchMove(event) {
    if (event.touches.length === 1 && app.isDragging) {
        event.preventDefault();
        
        const deltaMove = {
            x: event.touches[0].clientX - app.previousMousePosition.x,
            y: event.touches[0].clientY - app.previousMousePosition.y
        };
        
        app.rotationVelocity.y = deltaMove.x * 0.01;
        app.rotationVelocity.x = deltaMove.y * 0.01;
        
        app.earthMesh.rotation.y += app.rotationVelocity.y;
        app.earthMesh.rotation.x += app.rotationVelocity.x;
        
        app.earthMesh.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, app.earthMesh.rotation.x));
        
        app.previousMousePosition = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
        };
    }
}

function onTouchEnd() {
    app.isDragging = false;
    setTimeout(() => {
        if (!app.isDragging) {
            app.autoRotate = true;
        }
    }, 2000);
}