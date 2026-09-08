/**
 * LITTLE CANVAS — ANIMATIONS & 3D SYSTEM
 * Includes Three.js Interactive Hero Playground, GSAP Timelines, and Number Counters
 */

document.addEventListener('DOMContentLoaded', () => {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- 1. THREE.JS INTERACTIVE 3D PLAYGROUND ---
  const threeContainer = document.getElementById('three-canvas-container');
  if (threeContainer && window.THREE && !isReducedMotion && window.innerWidth > 768) {
    initThreeScene(threeContainer);
  }

  function initThreeScene(container) {
    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
      camera.position.z = 9;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
      dirLight.position.set(5, 8, 5);
      scene.add(dirLight);

      const pointLight = new THREE.PointLight(0xff5c8a, 2, 20);
      pointLight.position.set(-4, 3, 2);
      scene.add(pointLight);

      // Main Playground Group
      const mainGroup = new THREE.Group();
      scene.add(mainGroup);

      // 1. Paint Palette (Extruded rounded shape)
      const paletteShape = new THREE.Shape();
      paletteShape.moveTo(-1.8, -1.2);
      paletteShape.bezierCurveTo(-2.4, -0.6, -2.4, 1.2, -1.2, 1.8);
      paletteShape.bezierCurveTo(0.2, 2.2, 1.8, 1.6, 2.0, 0.4);
      paletteShape.bezierCurveTo(2.2, -0.8, 0.8, -1.8, -0.5, -1.8);
      paletteShape.bezierCurveTo(-1.2, -1.8, -1.5, -1.5, -1.8, -1.2);

      const extrudeSettings = { depth: 0.12, bevelEnabled: true, bevelSegments: 4, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 };
      const paletteGeo = new THREE.ExtrudeGeometry(paletteShape, extrudeSettings);
      const woodMat = new THREE.MeshStandardMaterial({ color: 0xF7D8A7, roughness: 0.35, metalness: 0.05 });
      const paletteMesh = new THREE.Mesh(paletteGeo, woodMat);
      paletteMesh.rotation.x = 0.2;
      paletteMesh.rotation.y = -0.3;
      mainGroup.add(paletteMesh);

      // Paint Drops on Palette
      const dropColors = [0xFF5C8A, 0x35C9FF, 0xFFD93D, 0x48D597, 0xA66CFF, 0xFF8A3D];
      const dropPositions = [
        [-1.0, 0.9, 0.2],
        [-0.3, 1.3, 0.2],
        [0.6, 1.1, 0.2],
        [1.3, 0.4, 0.2],
        [1.2, -0.5, 0.2],
        [0.4, -1.0, 0.2]
      ];

      dropPositions.forEach((pos, idx) => {
        const dropGeo = new THREE.CylinderGeometry(0.22, 0.26, 0.1, 16);
        const dropMat = new THREE.MeshStandardMaterial({ 
          color: dropColors[idx % dropColors.length], 
          roughness: 0.2, 
          metalness: 0.1 
        });
        const drop = new THREE.Mesh(dropGeo, dropMat);
        drop.position.set(pos[0], pos[1], pos[2]);
        drop.rotation.x = Math.PI / 2;
        paletteMesh.add(drop);
      });

      // 2. Floating Paint Brush
      const brushGroup = new THREE.Group();
      
      // Handle
      const handleGeo = new THREE.CylinderGeometry(0.08, 0.04, 3.2, 16);
      const handleMat = new THREE.MeshStandardMaterial({ color: 0x242044, roughness: 0.5 });
      const handleMesh = new THREE.Mesh(handleGeo, handleMat);
      brushGroup.add(handleMesh);

      // Ferrule
      const ferruleGeo = new THREE.CylinderGeometry(0.1, 0.08, 0.5, 16);
      const ferruleMat = new THREE.MeshStandardMaterial({ color: 0xE0E0E0, metalness: 0.8, roughness: 0.2 });
      const ferruleMesh = new THREE.Mesh(ferruleGeo, ferruleMat);
      ferruleMesh.position.y = 1.8;
      brushGroup.add(ferruleMesh);

      // Bristles
      const bristleGeo = new THREE.ConeGeometry(0.12, 0.7, 16);
      const bristleMat = new THREE.MeshStandardMaterial({ color: 0xFF5C8A, roughness: 0.4 });
      const bristleMesh = new THREE.Mesh(bristleGeo, bristleMat);
      bristleMesh.position.y = 2.4;
      brushGroup.add(bristleMesh);

      brushGroup.position.set(2.4, 1.2, 1.2);
      brushGroup.rotation.z = -Math.PI / 4;
      brushGroup.rotation.x = 0.4;
      mainGroup.add(brushGroup);

      // 3. Floating 3D Pencil
      const pencilGroup = new THREE.Group();
      const pencilBodyGeo = new THREE.CylinderGeometry(0.1, 0.1, 2.5, 6);
      const pencilBodyMat = new THREE.MeshStandardMaterial({ color: 0xFFD93D, roughness: 0.4 });
      const pencilBody = new THREE.Mesh(pencilBodyGeo, pencilBodyMat);
      pencilGroup.add(pencilBody);

      const tipWoodGeo = new THREE.ConeGeometry(0.1, 0.4, 6);
      const tipWoodMat = new THREE.MeshStandardMaterial({ color: 0xFBE2B5, roughness: 0.6 });
      const tipWood = new THREE.Mesh(tipWoodGeo, tipWoodMat);
      tipWood.position.y = 1.45;
      pencilGroup.add(tipWood);

      const leadGeo = new THREE.ConeGeometry(0.04, 0.15, 6);
      const leadMat = new THREE.MeshStandardMaterial({ color: 0x242044 });
      const lead = new THREE.Mesh(leadGeo, leadMat);
      lead.position.y = 1.62;
      pencilGroup.add(lead);

      pencilGroup.position.set(-2.6, -1.0, 1.5);
      pencilGroup.rotation.z = Math.PI / 3;
      pencilGroup.rotation.y = 0.5;
      mainGroup.add(pencilGroup);

      // 4. Colorful Floating Spheres
      const spheres = [];
      const sphereData = [
        { color: 0x35C9FF, size: 0.35, pos: [2.8, -1.6, 0.8] },
        { color: 0x48D597, size: 0.28, pos: [-2.2, 1.8, 0.5] },
        { color: 0xFF8A3D, size: 0.22, pos: [0.2, 2.4, -0.4] },
        { color: 0xA66CFF, size: 0.32, pos: [-1.4, -2.2, 0.2] }
      ];

      sphereData.forEach(d => {
        const sGeo = new THREE.SphereGeometry(d.size, 24, 24);
        const sMat = new THREE.MeshStandardMaterial({ 
          color: d.color, 
          roughness: 0.2, 
          metalness: 0.1 
        });
        const mesh = new THREE.Mesh(sGeo, sMat);
        mesh.position.set(d.pos[0], d.pos[1], d.pos[2]);
        mainGroup.add(mesh);
        spheres.push({ mesh, baseY: d.pos[1], speed: 1.5 + Math.random() });
      });

      // Mouse Parallax Interaction
      let targetRotX = 0;
      let targetRotY = 0;
      let targetPosX = 0;
      let targetPosY = 0;

      window.addEventListener('mousemove', (e) => {
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = -(e.clientY / window.innerHeight) * 2 + 1;
        targetRotY = nx * 0.35;
        targetRotX = -ny * 0.25;
        targetPosX = nx * 0.4;
        targetPosY = ny * 0.3;
      });

      // Render Loop
      let clock = new THREE.Clock();
      const animateThree = () => {
        const elapsed = clock.getElapsedTime();

        // Smooth damping
        mainGroup.rotation.y += (targetRotY - mainGroup.rotation.y) * 0.05;
        mainGroup.rotation.x += (targetRotX - mainGroup.rotation.x) * 0.05;
        mainGroup.position.x += (targetPosX - mainGroup.position.x) * 0.05;
        mainGroup.position.y += (targetPosY - mainGroup.position.y) * 0.05;

        // Idle floating
        paletteMesh.position.y = Math.sin(elapsed * 1.2) * 0.15;
        brushGroup.position.y = 1.2 + Math.cos(elapsed * 1.5) * 0.18;
        brushGroup.rotation.z = -Math.PI / 4 + Math.sin(elapsed * 1.8) * 0.08;
        pencilGroup.position.y = -1.0 + Math.sin(elapsed * 1.4) * 0.15;

        spheres.forEach(s => {
          s.mesh.position.y = s.baseY + Math.sin(elapsed * s.speed) * 0.2;
        });

        renderer.render(scene, camera);
        requestAnimationFrame(animateThree);
      };
      animateThree();

      // Resize Handler
      window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      });
    } catch (err) {
      console.warn('Three.js WebGL fallback activated:', err);
    }
  }

  // --- 2. GSAP ENTRANCE TIMELINES ---
  if (window.gsap && !isReducedMotion) {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Header Slide Down
    tl.from('.header-main', { y: -60, opacity: 0, duration: 0.8 })
      // Badge Fade In
      .from('.hero-badge-wrap', { scale: 0.7, opacity: 0, duration: 0.5 }, '-=0.3')
      // Headline lines reveal
      .from('.hero-title', { y: 40, opacity: 0, duration: 0.7 }, '-=0.2')
      // Description upward
      .from('.hero-desc', { y: 25, opacity: 0, duration: 0.6 }, '-=0.4')
      // Buttons scale in
      .from('.hero-cta-group .btn-toy', { scale: 0.85, opacity: 0, stagger: 0.15, duration: 0.5 }, '-=0.3')
      // Floating paper cards
      .from('.floating-card-item', { scale: 0, opacity: 0, stagger: 0.2, duration: 0.6, ease: 'back.out(1.7)' }, '-=0.3');

    // Scroll Reveal for Section Cards
    const scrollCards = document.querySelectorAll('.class-card, .instructor-card, .stat-sticker-card, .timeline-event-card');
    if ('IntersectionObserver' in window) {
      const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            gsap.fromTo(entry.target, 
              { y: 35, opacity: 0 }, 
              { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
            );
            cardObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      scrollCards.forEach(card => cardObserver.observe(card));
    }
  }

  // --- 3. ANIMATED NUMBER COUNTERS ---
  const statNumbers = document.querySelectorAll('[data-counter]');
  if (statNumbers.length > 0) {
    let countersStarted = false;

    const runCounters = () => {
      statNumbers.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-counter'), 10);
        const duration = 2000;
        const start = 0;
        const stepTime = 20;
        const steps = duration / stepTime;
        const increment = target / steps;
        let current = start;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.textContent = target + (counter.getAttribute('data-suffix') || '');
            clearInterval(timer);
          } else {
            counter.textContent = Math.floor(current) + (counter.getAttribute('data-suffix') || '');
          }
        }, stepTime);
      });
    };

    const statsSection = document.querySelector('.stats-section');
    if (statsSection && 'IntersectionObserver' in window) {
      const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !countersStarted) {
          countersStarted = true;
          runCounters();
        }
      }, { threshold: 0.25 });
      statsObserver.observe(statsSection);
    } else {
      runCounters();
    }
  }
});
