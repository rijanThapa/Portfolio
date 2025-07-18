import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const FloatingElements = () => {
  const mountRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 8;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(500, 500);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    currentMount.appendChild(renderer.domElement);

    // Create professional orbital system
    const createOrbitalSystem = () => {
      const group = new THREE.Group();

      // Main orbital rings with different materials
      const ringConfigs = [
        { radius: 2.5, color: 0x3b82f6, opacity: 0.6, speed: 0.5 },
        { radius: 3.2, color: 0x8b5cf6, opacity: 0.5, speed: -0.3 },
        { radius: 4.0, color: 0x06b6d4, opacity: 0.4, speed: 0.2 },
        { radius: 4.8, color: 0x10b981, opacity: 0.3, speed: -0.4 },
      ];

      const rings = [];

      ringConfigs.forEach((config, index) => {
        const geometry = new THREE.RingGeometry(
          config.radius,
          config.radius + 0.02,
          64
        );
        const material = new THREE.MeshBasicMaterial({
          color: config.color,
          transparent: true,
          opacity: config.opacity,
          side: THREE.DoubleSide,
        });
        const ring = new THREE.Mesh(geometry, material);
        ring.rotation.x = Math.PI / 2;
        ring.userData = { speed: config.speed };

        rings.push(ring);
        group.add(ring);

        // Add glowing effect
        const glowGeometry = new THREE.RingGeometry(
          config.radius - 0.05,
          config.radius + 0.07,
          64
        );
        const glowMaterial = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            color: { value: new THREE.Color(config.color) },
            opacity: { value: config.opacity * 0.3 },
          },
          vertexShader: `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform float time;
            uniform vec3 color;
            uniform float opacity;
            varying vec2 vUv;
            
            void main() {
              vec2 center = vUv - vec2(0.5);
              float dist = length(center);
              float pulse = sin(time * 2.0 + dist * 10.0) * 0.5 + 0.5;
              float alpha = (1.0 - dist * 2.0) * opacity * pulse;
              gl_FragColor = vec4(color, alpha);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
        });

        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.rotation.x = Math.PI / 2;
        glow.userData = { speed: config.speed, isGlow: true };

        rings.push(glow);
        group.add(glow);
      });

      return { group, rings };
    };

    const { group: orbitalGroup, rings } = createOrbitalSystem();
    scene.add(orbitalGroup);

    // Create floating tech symbols
    const createTechSymbols = () => {
      const symbols = [];
      const symbolConfigs = [
        { shape: "cube", size: 0.2, color: 0x3b82f6, position: [2, 1, 0] },
        { shape: "sphere", size: 0.15, color: 0x8b5cf6, position: [-2, -1, 0] },
        {
          shape: "octahedron",
          size: 0.18,
          color: 0x06b6d4,
          position: [1, -2, 0],
        },
        {
          shape: "tetrahedron",
          size: 0.2,
          color: 0x10b981,
          position: [-1, 2, 0],
        },
      ];

      symbolConfigs.forEach((config, index) => {
        let geometry;
        switch (config.shape) {
          case "cube":
            geometry = new THREE.BoxGeometry(
              config.size,
              config.size,
              config.size
            );
            break;
          case "sphere":
            geometry = new THREE.SphereGeometry(config.size, 16, 16);
            break;
          case "octahedron":
            geometry = new THREE.OctahedronGeometry(config.size);
            break;
          case "tetrahedron":
            geometry = new THREE.TetrahedronGeometry(config.size);
            break;
          default:
            geometry = new THREE.BoxGeometry(
              config.size,
              config.size,
              config.size
            );
            break;
        }

        const material = new THREE.MeshBasicMaterial({
          color: config.color,
          transparent: true,
          opacity: 0.7,
          wireframe: true,
        });

        const symbol = new THREE.Mesh(geometry, material);
        symbol.position.set(...config.position);
        symbol.userData = {
          originalPosition: new THREE.Vector3(...config.position),
          speed: 0.01 * (index + 1),
        };

        symbols.push(symbol);
        scene.add(symbol);
      });

      return symbols;
    };

    const techSymbols = createTechSymbols();

    // Create particle trail system
    const createParticleTrail = () => {
      const particleCount = 100;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const radius = 3 + Math.random() * 2;

        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = Math.sin(angle) * radius;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 2;

        // Color gradient
        const hue = (i / particleCount) * 0.7 + 0.5;
        colors[i * 3] = hue;
        colors[i * 3 + 1] = 0.7;
        colors[i * 3 + 2] = 1.0;

        sizes[i] = Math.random() * 2 + 1;
      }

      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

      const material = new THREE.PointsMaterial({
        size: 0.02,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
      });

      return new THREE.Points(geometry, material);
    };

    const particleTrail = createParticleTrail();
    scene.add(particleTrail);

    // Animation variables
    let time = 0;
    const clock = new THREE.Clock();

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      time = clock.getElapsedTime();

      // Animate orbital rings
      rings.forEach((ring, index) => {
        ring.rotation.z += ring.userData.speed * 0.01;

        // Update glow effect
        if (ring.userData.isGlow && ring.material.uniforms) {
          ring.material.uniforms.time.value = time;
        }
      });

      // Animate tech symbols
      techSymbols.forEach((symbol, index) => {
        symbol.rotation.x += symbol.userData.speed;
        symbol.rotation.y += symbol.userData.speed * 0.7;

        // Floating motion
        symbol.position.y =
          symbol.userData.originalPosition.y + Math.sin(time * 2 + index) * 0.3;
        symbol.position.x =
          symbol.userData.originalPosition.x +
          Math.cos(time * 1.5 + index) * 0.2;
      });

      // Animate particle trail
      particleTrail.rotation.z += 0.005;

      // Update particle positions for trail effect
      const positions = particleTrail.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 2] += 0.01;
        if (positions[i + 2] > 2) {
          positions[i + 2] = -2;
        }
      }
      particleTrail.geometry.attributes.position.needsUpdate = true;

      // Gentle camera movement
      camera.position.x = Math.sin(time * 0.3) * 0.5;
      camera.position.y = Math.cos(time * 0.2) * 0.3;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }

      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }

      // Clean up Three.js objects
      scene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });

      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 z-0"
      style={{
        pointerEvents: "none",
      }}
    />
  );
};

export default FloatingElements;
