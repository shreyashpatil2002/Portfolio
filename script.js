// Three.js 3D Background Setup
const init3DBackground = () => {
    const container = document.getElementById('canvas-container');
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    
    // Group to hold objects for group rotation
    const group = new THREE.Group();
    scene.add(group);
    
    // Materials
    const materialPrimary = new THREE.MeshPhysicalMaterial({
        color: 0x6366f1,
        metalness: 0.2,
        roughness: 0.1,
        transmission: 0.9,
        ior: 1.5,
        thickness: 0.5,
        transparent: true,
        opacity: 0.8
    });
    
    const materialSecondary = new THREE.MeshPhysicalMaterial({
        color: 0xa5b4fc,
        metalness: 0.5,
        roughness: 0.2,
        wireframe: true
    });

    // Shapes
    const geometries = [
        new THREE.IcosahedronGeometry(4, 0),
        new THREE.TorusGeometry(3, 1, 16, 100),
        new THREE.ConeGeometry(3, 6, 4),
        new THREE.OctahedronGeometry(4, 0)
    ];

    const objects = [];

    // Create scattered objects
    for (let i = 0; i < 15; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = Math.random() > 0.5 ? materialPrimary : materialSecondary;
        const mesh = new THREE.Mesh(geometry, material);
        
        // Random position around the center, slightly to the right to balance text
        mesh.position.x = (Math.random() - 0.2) * 50; 
        mesh.position.y = (Math.random() - 0.5) * 40;
        mesh.position.z = (Math.random() - 0.5) * 40 - 10;
        
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        
        const scale = Math.random() * 0.5 + 0.5;
        mesh.scale.set(scale, scale, scale);
        
        objects.push({
            mesh: mesh,
            rotSpeedX: (Math.random() - 0.5) * 0.01,
            rotSpeedY: (Math.random() - 0.5) * 0.01,
            floatSpeed: (Math.random() * 0.02) + 0.01,
            floatOffset: Math.random() * Math.PI * 2
        });
        
        group.add(mesh);
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x6366f1, 2, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xa5b4fc, 2, 100);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX) * 0.001;
        mouseY = (event.clientY - windowHalfY) * 0.001;
    });

    // Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
        requestAnimationFrame(animate);
        
        const time = clock.getElapsedTime();

        // Smooth mouse follow for camera/group
        targetX = mouseX * 2;
        targetY = mouseY * 2;
        
        group.rotation.x += 0.05 * (targetY - group.rotation.x);
        group.rotation.y += 0.05 * (targetX - group.rotation.y);

        // Animate individual objects
        objects.forEach(obj => {
            obj.mesh.rotation.x += obj.rotSpeedX;
            obj.mesh.rotation.y += obj.rotSpeedY;
            obj.mesh.position.y += Math.sin(time * obj.floatSpeed + obj.floatOffset) * 0.05;
        });

        // Parallax effect on scroll
        camera.position.y = -(window.scrollY * 0.01);

        renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

// Initial Animations with GSAP
const initAnimations = () => {
    // Hero Text Animation
    const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1 } });
    
    tl.to(".subtitle", { y: 0, opacity: 1, duration: 0.8 }, 0.5)
      .to(".title", { y: 0, opacity: 1, duration: 1 }, 0.7)
      .to(".description", { y: 0, opacity: 1, duration: 0.8 }, 1)
      .to(".cta-buttons", { y: 0, opacity: 1, duration: 0.8 }, 1.2)
      .to(".scroll-indicator", { opacity: 1, duration: 1 }, 2);

    // Navbar hide/show on scroll
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll <= 0) {
            navbar.style.transform = "translateY(0)";
        } else if (currentScroll > lastScroll) {
            navbar.style.transform = "translateY(-100%)";
        } else {
            navbar.style.transform = "translateY(0)";
        }
        lastScroll = currentScroll;
    });

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once animated if we don't want it to run again
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up');
    animatedElements.forEach(el => observer.observe(el));
};

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Only init 3D if Three.js loaded correctly
    if (typeof THREE !== 'undefined') {
        init3DBackground();
    } else {
        console.error("Three.js not loaded.");
    }
    
    if (typeof gsap !== 'undefined') {
        initAnimations();
    } else {
        console.error("GSAP not loaded.");
    }
});
