// AR/VR Motion Graphics
let arVrScene, arVrCamera, arVrRenderer;
let arVrParticles = [];
let animationFrame;

function initARVRGraphics() {
    const canvas = document.getElementById('ar-vr-canvas');
    if (!canvas) return;

    // Scene setup
    arVrScene = new THREE.Scene();
    arVrCamera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
    arVrCamera.position.z = 500;

    // Renderer
    arVrRenderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    arVrRenderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    arVrRenderer.setPixelRatio(window.devicePixelRatio);

    // Create AR/VR grid effect
    const gridHelper = new THREE.GridHelper(1000, 50, 0x00ff88, 0x0066ff);
    gridHelper.material.opacity = 0.3;
    gridHelper.material.transparent = true;
    arVrScene.add(gridHelper);

    // Create floating geometric shapes
    const shapes = [];
    const geometries = [
        new THREE.BoxGeometry(50, 50, 50),
        new THREE.OctahedronGeometry(40),
        new THREE.TetrahedronGeometry(45),
        new THREE.IcosahedronGeometry(35)
    ];

    geometries.forEach((geometry, index) => {
        const material = new THREE.MeshStandardMaterial({
            color: index % 2 === 0 ? 0x00ff88 : 0x0066ff,
            emissive: index % 2 === 0 ? 0x00ff88 : 0x0066ff,
            emissiveIntensity: 0.5,
            metalness: 0.8,
            roughness: 0.2,
            transparent: true,
            opacity: 0.8
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
            (Math.random() - 0.5) * 800,
            (Math.random() - 0.5) * 800,
            (Math.random() - 0.5) * 800
        );
        mesh.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        mesh.userData = {
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            },
            floatSpeed: Math.random() * 0.02 + 0.01
        };
        shapes.push(mesh);
        arVrScene.add(mesh);
    });

    // Particle system for AR effect
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 500;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 1000;
        positions[i + 1] = (Math.random() - 0.5) * 1000;
        positions[i + 2] = (Math.random() - 0.5) * 1000;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
        size: 4,
        color: 0x00ff88,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    arVrScene.add(particleSystem);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    arVrScene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x00ff88, 1);
    directionalLight.position.set(0, 500, 500);
    arVrScene.add(directionalLight);

    // Animation loop
    function animate() {
        animationFrame = requestAnimationFrame(animate);

        // Rotate shapes
        shapes.forEach(shape => {
            shape.rotation.x += shape.userData.rotationSpeed.x;
            shape.rotation.y += shape.userData.rotationSpeed.y;
            shape.rotation.z += shape.userData.rotationSpeed.z;
            
            // Float animation
            shape.position.y += Math.sin(Date.now() * shape.userData.floatSpeed) * 0.5;
        });

        // Rotate particle system
        particleSystem.rotation.y += 0.001;

        // Rotate grid
        gridHelper.rotation.y += 0.002;

        // Camera movement for immersive effect
        const time = Date.now() * 0.0005;
        arVrCamera.position.x = Math.sin(time) * 100;
        arVrCamera.position.y = Math.cos(time * 0.7) * 100;
        arVrCamera.lookAt(arVrScene.position);

        arVrRenderer.render(arVrScene, arVrCamera);
    }

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        if (canvas && arVrCamera && arVrRenderer) {
            arVrCamera.aspect = canvas.offsetWidth / canvas.offsetHeight;
            arVrCamera.updateProjectionMatrix();
            arVrRenderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
        }
    });

    // Intersection Observer for performance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting && animationFrame) {
                cancelAnimationFrame(animationFrame);
                animationFrame = null;
            } else if (entry.isIntersecting && !animationFrame) {
                animate();
            }
        });
    }, { threshold: 0.1 });

    observer.observe(canvas);
}

// Initialize when Three.js is ready
function checkThreeJS() {
    if (typeof THREE !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initARVRGraphics);
        } else {
            initARVRGraphics();
        }
    } else {
        setTimeout(checkThreeJS, 100);
    }
}

checkThreeJS();
