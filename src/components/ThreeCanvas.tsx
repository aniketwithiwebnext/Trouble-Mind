import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
// @ts-ignore
import streetwearHero from '../assets/images/streetwear_hero_photoshoot_1781992227563.jpg';

export default function ThreeCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGlSupported, setWebGlSupported] = useState(true);
  const [viewMode, setViewMode] = useState<'lookbook' | '3d'>('lookbook');
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

  const hotspots = [
    {
      id: 1,
      x: '52%',
      y: '22%',
      title: 'Dense Storm Hood',
      desc: 'Double-layered 450GSM customized hood for unstructured form.'
    },
    {
      id: 2,
      x: '38%',
      y: '45%',
      title: 'Boxy Drop Shoulders',
      desc: 'Dropped shoulder seams and high-chest width for extreme modern fit.'
    },
    {
      id: 3,
      x: '55%',
      y: '78%',
      title: 'Anti-Wear Weave',
      desc: 'Extra-ribbed lock cuffs to prevent fraying and maintain design integrity.'
    }
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Basic Setup
    const width = containerRef.current.clientWidth || 400;
    const height = containerRef.current.clientHeight || 400;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
      console.warn("WebGL not supported, falling back.");
      setWebGlSupported(false);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    
    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 8;

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xffffff, 1.5, 100);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x737373, 1.2, 100);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    const neonLight = new THREE.PointLight(0xa3a3a3, 2, 50);
    neonLight.position.set(0, 0, 2);
    scene.add(neonLight);

    // 4. Mesh creation: A core sphere, surrounding rings, and a particle cloud
    // Group to hold everything for holistic mouse/scroll animation
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Core Wireframe Sphere
    const sphereGeometry = new THREE.SphereGeometry(1.8, 24, 24);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x171717,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
      shininess: 90,
      specular: 0x737373
    });
    const coreSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    modelGroup.add(coreSphere);

    // Inner Solid core
    const innerGeo = new THREE.IcosahedronGeometry(0.8, 1);
    const innerMat = new THREE.MeshPhongMaterial({
      color: 0xd4d4d4,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    modelGroup.add(innerCore);

    // Surrounding Satellite Rings (Orbital Rings of "Mind Conflict")
    const ringGroup = new THREE.Group();
    modelGroup.add(ringGroup);

    const ringCount = 3;
    const rings: THREE.LineLoop[] = [];

    for (let i = 0; i < ringCount; i++) {
      const radius = 2.4 + i * 0.4;
      const segments = 64;
      const ringGeometry = new THREE.BufferGeometry();
      const points: THREE.Vector3[] = [];

      for (let j = 0; j <= segments; j++) {
        const theta = (j / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, 0));
      }

      ringGeometry.setFromPoints(points);
      const ringMaterial = new THREE.LineBasicMaterial({
        color: i % 2 === 0 ? 0xffffff : 0x525252,
        transparent: true,
        opacity: 0.6 - i * 0.15,
      });

      const ringLine = new THREE.LineLoop(ringGeometry, ringMaterial);
      // Randomize ring orientations
      ringLine.rotation.x = Math.random() * Math.PI;
      ringLine.rotation.y = Math.random() * Math.PI;
      ringGroup.add(ringLine);
      rings.push(ringLine);
    }

    // Particle Cloud (representing scattered thoughts)
    const particleCount = 180;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      // Distribute randomly in a spherical shell
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 3 + Math.random() * 2; // radius between 3 and 5

      positions[i] = r * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = r * Math.cos(phi);
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Simple round texture fallback
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xa3a3a3,
      size: 0.05,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true
    });

    const starParticles = new THREE.Points(particleGeometry, particleMaterial);
    modelGroup.add(starParticles);

    // Mouse Tracking values (target values for smooth lerp interpolation)
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    let targetScrollY = 0;
    let currentScrollY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      // Get relative coordinates from -1 to 1
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      mouseX = (x / rect.width) * 2 - 1;
      mouseY = -(y / rect.height) * 2 + 1;
    };

    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    // 5. Animation loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Slow idle rotations
      coreSphere.rotation.y = elapsedTime * 0.15;
      coreSphere.rotation.x = elapsedTime * 0.08;
      innerCore.rotation.y = -elapsedTime * 0.25;
      innerCore.rotation.z = elapsedTime * 0.1;

      starParticles.rotation.y = elapsedTime * 0.03;

      // Spin rings slightly differently
      rings.forEach((ring, idx) => {
        ring.rotation.z += 0.005 * (idx + 1);
        ring.rotation.x += 0.002 * (idx + 1);
      });

      // Mouse Lerp
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Rotate group with mouse movement
      modelGroup.rotation.y = targetX * 0.8;
      modelGroup.rotation.x = -targetY * 0.8;

      // Scroll physics integration
      currentScrollY += (targetScrollY - currentScrollY) * 0.08;
      // Modify scale & deep camera translation as you scroll
      const scrollFactor = Math.min(currentScrollY / 1500, 1);
      modelGroup.position.y = scrollFactor * 1.5;
      modelGroup.position.z = -scrollFactor * 1.0;
      
      // Ring modulation based on scroll
      rings.forEach((ring, idx) => {
        ring.scale.setScalar(1 + scrollFactor * 0.4 * (idx + 1) * 0.2);
      });

      renderer.render(scene, camera);
    };

    animate();

    // 6. Resize handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
      if (containerRef.current && renderer.domElement) {
        try {
          containerRef.current.removeChild(renderer.domElement);
        } catch (e) {
          // Ignore
        }
      }
      // Dispose materials & geometries
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  if (!webGlSupported) {
    // Elegant fallback if WebGL is disabled or missing
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-transparent backdrop-blur-md border border-white/5 rounded-none p-6 text-center">
        <div className="w-16 h-16 rounded-none border border-dashed border-zinc-500 animate-spin flex items-center justify-center mb-4">
          <span className="text-zinc-500 font-mono text-xs">MIND SYSTEM</span>
        </div>
        <h4 className="text-lg font-sans font-semibold text-white tracking-tight uppercase">INDIVIDUALITY MATRIX</h4>
        <p className="text-xs text-neutral-400 mt-2 max-w-xs">Interactive 3D Matrix is running in eco hardware mode. Feel the resilience of Troubled Mind.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[380px] md:min-h-[440px] flex flex-col justify-between" id="canvas3d-container">
      {/* 3D WebGL render layer */}
      <div 
        ref={containerRef} 
        className={`w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing transition-opacity duration-500 bg-neutral-950/25 ${
          viewMode === '3d' ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
        }`} 
      />
      
      {/* 3D floating overlay metrics */}
      {viewMode === '3d' && (
        <>
          <div className="absolute top-4 left-4 font-mono text-[10px] text-zinc-500 space-y-1 select-none pointer-events-none z-20">
            <div>SYS_MODEL: RESILIENCE.01</div>
            <div>RENDER: LERP_STABILIZED</div>
            <div>FPS: 60 / GL_TRUE</div>
          </div>
          <div className="absolute bottom-12 right-4 font-mono text-[10px] text-zinc-500 text-right select-none pointer-events-none z-20">
            <div>DRAG TO ROTATE</div>
            <div>SCROLL TO EXPAND MODEL</div>
          </div>
        </>
      )}

      {/* Streetwear custom lookbook picture overlay matching the business model */}
      {viewMode === 'lookbook' && (
        <div className="absolute inset-0 pb-10 overflow-hidden flex items-center justify-center bg-zinc-950/60 group/lookbook animate-fade-in select-none z-10">
          {/* Brutal corner anchors */}
          <div className="absolute top-3 left-3 text-zinc-650 font-mono text-[8px] pointer-events-none tracking-widest">+ CRSHR_L01</div>
          <div className="absolute top-3 right-3 text-zinc-650 font-mono text-[8px] pointer-events-none tracking-widest">CRSHR_R01 +</div>
          <div className="absolute bottom-12 left-3 text-zinc-650 font-mono text-[8px] pointer-events-none tracking-widest">+ FLUSH_B01</div>
          <div className="absolute bottom-12 right-3 text-zinc-650 font-mono text-[8px] pointer-events-none tracking-widest">FLUSH_B02 +</div>

          {/* Picture itself */}
          <img
            src={streetwearHero}
            alt="Troubled Mind Premium Streetwear Lookbook"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover grayscale opacity-85 group-hover/lookbook:opacity-100 group-hover/lookbook:scale-102 transition-all duration-700"
          />

          {/* Smooth modern shadows */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

          {/* Premium Tag */}
          <div className="absolute top-6 left-6 font-mono text-[9px] tracking-widest text-white bg-[#0e0e0e]/90 border border-white/10 px-2 py-0.5 uppercase">
            <span>DROP_01: ANTIOCH HEAVY APPAREL</span>
          </div>

          {/* Interactive spot guides */}
          {hotspots.map((spot) => (
            <div
              key={spot.id}
              className="absolute z-20 cursor-pointer"
              style={{ left: spot.x, top: spot.y }}
              onMouseEnter={() => setActiveHotspot(spot.id)}
              onMouseLeave={() => setActiveHotspot(null)}
              onClick={() => setActiveHotspot(activeHotspot === spot.id ? null : spot.id)}
            >
              {/* Outer pulsing ping */}
              <div className="relative flex items-center justify-center">
                <span className="absolute inline-flex h-4 w-4 rounded-none bg-white opacity-40 animate-ping" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-none bg-white border border-black" />
              </div>

              {/* Popup */}
              <div className={`absolute left-5 top-1/2 -translate-y-1/2 w-44 p-2 bg-[#0a0a0a] border border-white/10 text-left font-mono transition-all duration-300 pointer-events-none select-none ${
                activeHotspot === spot.id ? 'opacity-100 translate-x-1 scale-100' : 'opacity-0 translate-x-0 scale-95'
              }`}>
                <div className="text-[9px] text-zinc-350 font-bold uppercase tracking-widest">{spot.title}</div>
                <div className="text-[8px] text-zinc-500 mt-1 leading-normal font-light uppercase tracking-wider">{spot.desc}</div>
              </div>
            </div>
          ))}

          {/* Caption Overlay */}
          <div className="absolute bottom-14 left-6 right-6 flex items-end justify-between font-mono pointer-events-none select-none">
            <div className="text-left space-y-0.5">
              <span className="text-[8px] text-zinc-500 block uppercase tracking-widest">DIRECT SECTOR BUSINESS</span>
              <span className="text-[10px] text-white font-bold uppercase tracking-wider">Premium heavyweight blanks</span>
            </div>
            <div className="text-[8px] text-zinc-650 tracking-wider text-right uppercase max-w-[150px]">
              FORGED ON THE TENNESSEE DIRECT-TO-BUYER STRATEGY
            </div>
          </div>
        </div>
      )}

      {/* Styled high-contrast toggle layout centered on the bottom margin */}
      <div className="w-full bg-[#030303]/95 border-t border-white/5 py-1.5 flex justify-center items-center gap-2 relative z-35 mt-auto min-h-[36px]">
        <button
          type="button"
          onClick={() => setViewMode('lookbook')}
          className={`flex items-center gap-1.5 px-3 py-1 font-mono text-[9px] tracking-widest uppercase transition-all cursor-pointer ${
            viewMode === 'lookbook'
              ? 'bg-white text-black font-extrabold'
              : 'text-zinc-500 hover:text-white bg-transparent border border-transparent'
          }`}
        >
          [ LOOKBOOK ASSIST ]
        </button>
        <span className="text-zinc-700 text-[8px] font-mono select-none font-bold">•</span>
        <button
          type="button"
          onClick={() => setViewMode('3d')}
          className={`flex items-center gap-1.5 px-3 py-1 font-mono text-[9px] tracking-widest uppercase transition-all cursor-pointer ${
            viewMode === '3d'
              ? 'bg-white text-black font-extrabold'
              : 'text-zinc-500 hover:text-white bg-transparent border border-transparent'
          }`}
        >
          [ 3D BLUEPRINT ]
        </button>
      </div>
    </div>
  );
}
