function createEarth() {
    // Create sphere geometry
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    
    // Load Earth texture
    const textureLoader = new THREE.TextureLoader();
    
    // Create a simple Earth-like texture using canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#4a90e2');      // Ocean blue
    gradient.addColorStop(0.3, '#2e7d32');    // Forest green
    gradient.addColorStop(0.5, '#8bc34a');    // Light green
    gradient.addColorStop(0.7, '#ffeb3b');    // Desert yellow
    gradient.addColorStop(0.9, '#795548');    // Mountain brown
    gradient.addColorStop(1, '#ffffff');      // Ice white
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add continents
    ctx.fillStyle = '#2e7d32';
    drawContinent(ctx, 200, 150, 300, 200); // Europe/Africa
    drawContinent(ctx, 100, 300, 200, 150); // Americas
    drawContinent(ctx, 600, 200, 250, 180); // Asia
    drawContinent(ctx, 800, 350, 150, 100); // Australia
    
    // Add islands
    for (let i = 0; i < 20; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 20 + 5;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    const canvasTexture = new THREE.CanvasTexture(canvas);
    canvasTexture.wrapS = THREE.RepeatWrapping;
    canvasTexture.wrapT = THREE.RepeatWrapping;
    
    // Create material
    const material = new THREE.MeshPhongMaterial({
        map: canvasTexture,
        shininess: 0.1,
        transparent: false
    });
    
    // Create mesh
    app.earthMesh = new THREE.Mesh(geometry, material);
    app.scene.add(app.earthMesh);
    
    // Try to load a real Earth texture, fallback to canvas texture
    textureLoader.load(
        'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
        (texture) => {
            app.earthMesh.material.map = texture;
            app.earthMesh.material.needsUpdate = true;
            document.getElementById('loading').style.display = 'none';
        },
        undefined,
        (error) => {
            // Fallback to canvas texture
            app.earthMesh.material.map = canvasTexture;
            app.earthMesh.material.needsUpdate = true;
            document.getElementById('loading').style.display = 'none';
        }
    );
    
    // Hide loading text after a delay if texture doesn't load
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
    }, 3000);
}

function drawContinent(ctx, x, y, width, height) {
    ctx.beginPath();
    ctx.ellipse(x, y, width/2, height/2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Add irregular edges
    for (let i = 0; i < 5; i++) {
        const offsetX = (Math.random() - 0.5) * width;
        const offsetY = (Math.random() - 0.5) * height;
        const size = Math.random() * 50 + 20;
        ctx.beginPath();
        ctx.arc(x + offsetX, y + offsetY, size, 0, Math.PI * 2);
        ctx.fill();
    }
}