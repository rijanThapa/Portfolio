import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const SkillsThreeBackground = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffffff, 1, 100);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 30);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0xffffff, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    rendererRef.current = renderer;

    currentMount.appendChild(renderer.domElement);

    // Create professional particle system with subtle blue/gray tones
    const createParticleSystem = () => {
      const particleCount = 800;
      const particles = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Position
        positions[i3] = (Math.random() - 0.5) * 80;
        positions[i3 + 1] = (Math.random() - 0.5) * 80;
        positions[i3 + 2] = (Math.random() - 0.5) * 80;

        // Professional color palette - subtle blues and grays
        const colorChoice = Math.random();
        if (colorChoice < 0.4) {
          colors[i3] = 0.2; // Dark blue
          colors[i3 + 1] = 0.4;
          colors[i3 + 2] = 0.8;
        } else if (colorChoice < 0.7) {
          colors[i3] = 0.3; // Gray-blue
          colors[i3 + 1] = 0.5;
          colors[i3 + 2] = 0.7;
        } else {
          colors[i3] = 0.1; // Dark gray
          colors[i3 + 1] = 0.3;
          colors[i3 + 2] = 0.5;
        }

        // Size
        sizes[i] = Math.random() * 2 + 0.5;
      }

      particles.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      particles.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      particles.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

      const particleMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          pixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        },
        vertexShader: `
          uniform float time;
          uniform float pixelRatio;
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          varying float vAlpha;
          
          void main() {
            vColor = color;
            
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            
            // Gentle floating animation
            mvPosition.y += sin(time * 0.5 + position.x * 0.01) * 2.0;
            mvPosition.x += cos(time * 0.3 + position.y * 0.01) * 1.5;
            
            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
            
            vAlpha = 1.0 - (gl_Position.z / gl_Position.w + 1.0) * 0.3;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vAlpha;
          
          void main() {
            float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
            float strength = 1.0 - distanceToCenter * 2.0;
            strength = max(0.0, strength);
            
            vec3 finalColor = vColor * strength;
            float alpha = vAlpha * strength * 0.4;
            
            gl_FragColor = vec4(finalColor, alpha);
          }
        `,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      });

      const particleSystem = new THREE.Points(particles, particleMaterial);
      scene.add(particleSystem);

      return { particleSystem, particleMaterial };
    };

    // Create geometric shapes for professional look
    const createGeometricShapes = () => {
      const shapes = [];

      // Create wireframe geometries
      const geometries = [
        new THREE.TetrahedronGeometry(2, 0),
        new THREE.OctahedronGeometry(1.5, 0),
        new THREE.IcosahedronGeometry(1, 0),
      ];

      for (let i = 0; i < 15; i++) {
        const geometry =
          geometries[Math.floor(Math.random() * geometries.length)];
        const material = new THREE.MeshBasicMaterial({
          color: new THREE.Color(0.2, 0.4, 0.8),
          wireframe: true,
          transparent: true,
          opacity: 0.1,
        });

        const shape = new THREE.Mesh(geometry, material);
        shape.position.set(
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 60
        );

        shape.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        );

        shapes.push(shape);
        scene.add(shape);
      }

      return shapes;
    };

    const { particleSystem, particleMaterial } = createParticleSystem();
    const geometricShapes = createGeometricShapes();

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      const time = Date.now() * 0.001;

      // Update particle shader time
      particleMaterial.uniforms.time.value = time;

      // Rotate geometric shapes
      geometricShapes.forEach((shape, index) => {
        shape.rotation.x += 0.002 * (index % 2 === 0 ? 1 : -1);
        shape.rotation.y += 0.001 * (index % 3 === 0 ? 1 : -1);
        shape.rotation.z += 0.0015 * (index % 4 === 0 ? 1 : -1);
      });

      // Gentle rotation of particle system
      particleSystem.rotation.y += 0.0005;

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!rendererRef.current) return;

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }

      window.removeEventListener("resize", handleResize);

      if (currentMount && rendererRef.current) {
        currentMount.removeChild(rendererRef.current.domElement);
      }

      if (sceneRef.current) {
        sceneRef.current.clear();
      }

      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

export default SkillsThreeBackground;
