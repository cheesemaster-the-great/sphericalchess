// Global app namespace
const app = {
    scene: null,
    camera: null,
    renderer: null,
    earthMesh: null,
    isDragging: false,
    previousMousePosition: { x: 0, y: 0 },
    rotationVelocity: { x: 0, y: 0 },
    autoRotate: true,
    isVRMode: false,
    vrInteractionActive: false,
    vrInteractionStartPoint: new THREE.Vector3(),
    vrInteractionStartRotation: new THREE.Quaternion()
};

function setupScene() {
    // Create scene
    app.scene = new THREE.Scene();
    
    // Create camera
    app.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    app.camera.position.set(0, 0, 3);
    
    // Create renderer
    app.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    app.renderer.setSize(window.innerWidth, window.innerHeight);
    app.renderer.setPixelRatio(window.devicePixelRatio);
    app.renderer.xr.enabled = true;
    document.body.appendChild(app.renderer.domElement);
    
    // Setup raycaster for VR interactions
    app.raycaster = new THREE.Raycaster();
    
    // Add lighting
    addLighting();
    
    // Add stars background
    addStars();
    
    // Add VR environment
    addVREnvironment();
}

function addLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    app.scene.add(ambientLight);
    
    // Directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    app.scene.add(directionalLight);
    
    // Add a subtle rim light
    const rimLight = new THREE.DirectionalLight(0x4a90e2, 0.3);
    rimLight.position.set(-5, 0, -5);
    app.scene.add(rimLight);
}

function addStars() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({ 
        color: 0xffffff, 
        size: 2,
        sizeAttenuation: false
    });
    
    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    app.scene.add(stars);
}

function addVREnvironment() {
    // Add a subtle floor grid for VR spatial reference
    const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
    gridHelper.position.y = -1.6;
    app.scene.add(gridHelper);
    
    // Add invisible floor for teleportation/movement reference
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x333333, 
        transparent: true, 
        opacity: 0.1,
        side: THREE.DoubleSide
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.6;
    app.scene.add(floor);
}