// Three.js 3D Scene for Real-time Rendering
let scene, camera, renderer, particles, geometry, material;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

function init3DScene() {
    const canvas = document.getElementById('canvas-3d');
    if (!canvas) return;

    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 1000;

    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Create particle system
    const particleCount = 2000;
    geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 2000;
        positions[i + 1] = (Math.random() - 0.5) * 2000;
        positions[i + 2] = (Math.random() - 0.5) * 2000;

        // Colors based on gradient
        const color = new THREE.Color();
        if (Math.random() > 0.5) {
            color.setRGB(0, 1, 0.53); // Primary green
        } else {
            color.setRGB(0, 0.4, 1); // Secondary blue
        }
        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    material = new THREE.PointsMaterial({
        size: 3,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Add 3D objects
    const torusGeometry = new THREE.TorusGeometry(100, 30, 16, 100);
    const torusMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        emissive: 0x00ff88,
        emissiveIntensity: 0.5,
        metalness: 0.8,
        roughness: 0.2
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    scene.add(torus);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00ff88, 1, 1000);
    pointLight.position.set(0, 0, 500);
    scene.add(pointLight);

    // Mouse movement
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);

    animate();
}

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.1;
    mouseY = (event.clientY - windowHalfY) * 0.1;
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    if (particles) {
        particles.rotation.x += 0.0005;
        particles.rotation.y += 0.001;
    }

    if (scene.children.length > 1) {
        const torus = scene.children.find(child => child.type === 'Mesh');
        if (torus) {
            torus.rotation.x += 0.01;
            torus.rotation.y += 0.01;
            torus.position.x += (mouseX - torus.position.x) * 0.05;
            torus.position.y += (-mouseY - torus.position.y) * 0.05;
        }
    }

    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

// Initialize when DOM and Three.js are ready
function checkThreeJS() {
    if (typeof THREE !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init3DScene);
        } else {
            init3DScene();
        }
    } else {
        setTimeout(checkThreeJS, 100);
    }
}

checkThreeJS();
