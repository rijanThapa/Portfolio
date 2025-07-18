import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const ThreeBackground = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0a0a, 1, 100);
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
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.5;
    rendererRef.current = renderer;

    currentMount.appendChild(renderer.domElement);

    // Create professional particle system
    const createParticleSystem = () => {
      const particleCount = 1000;
      const particles = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Position
        positions[i3] = (Math.random() - 0.5) * 100;
        positions[i3 + 1] = (Math.random() - 0.5) * 100;
        positions[i3 + 2] = (Math.random() - 0.5) * 100;

        // Color gradient from blue to purple
        const colorChoice = Math.random();
        if (colorChoice < 0.33) {
          colors[i3] = 0.23; // Blue
          colors[i3 + 1] = 0.51;
          colors[i3 + 2] = 0.96;
        } else if (colorChoice < 0.66) {
          colors[i3] = 0.54; // Purple
          colors[i3 + 1] = 0.36;
          colors[i3 + 2] = 0.96;
        } else {
          colors[i3] = 0.02; // Cyan
          colors[i3 + 1] = 0.71;
          colors[i3 + 2] = 0.83;
        }

        // Size
        sizes[i] = Math.random() * 3 + 1;
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
            
            // Add floating motion
            mvPosition.y += sin(time * 0.5 + position.x * 0.01) * 5.0;
            mvPosition.x += cos(time * 0.3 + position.y * 0.01) * 3.0;
            
            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
            
            // Fade based on distance
            vAlpha = 1.0 - (length(mvPosition.xyz) / 100.0);
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vAlpha;
          
          void main() {
            vec2 center = gl_PointCoord - vec2(0.5);
            float dist = length(center);
            
            if (dist > 0.5) discard;
            
            float alpha = (1.0 - dist * 2.0) * vAlpha * 0.8;
            gl_FragColor = vec4(vColor, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        vertexColors: true,
      });

      return new THREE.Points(particles, particleMaterial);
    };

    const particleSystem = createParticleSystem();
    scene.add(particleSystem);

    // Create geometric network
    const createGeometricNetwork = () => {
      const group = new THREE.Group();

      // Create nodes
      const nodeGeometry = new THREE.SphereGeometry(0.1, 8, 8);
      const nodeMaterial = new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.8,
      });

      const nodes = [];
      for (let i = 0; i < 50; i++) {
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.set(
          (Math.random() - 0.5) * 80,
          (Math.random() - 0.5) * 80,
          (Math.random() - 0.5) * 80
        );
        nodes.push(node);
        group.add(node);
      }

      // Create connections
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x60a5fa,
        transparent: true,
        opacity: 0.3,
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const distance = nodes[i].position.distanceTo(nodes[j].position);
          if (distance < 20) {
            const geometry = new THREE.BufferGeometry().setFromPoints([
              nodes[i].position,
              nodes[j].position,
            ]);
            const line = new THREE.Line(geometry, lineMaterial);
            group.add(line);
          }
        }
      }

      return { group, nodes };
    };

    const { group: networkGroup, nodes } = createGeometricNetwork();
    scene.add(networkGroup);

    // Create floating geometric shapes
    const createFloatingShapes = () => {
      const shapes = [];

      // Wireframe cubes
      for (let i = 0; i < 8; i++) {
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshBasicMaterial({
          color: 0x8b5cf6,
          wireframe: true,
          transparent: true,
          opacity: 0.4,
        });
        const cube = new THREE.Mesh(geometry, material);

        cube.position.set(
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 60
        );

        cube.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        );

        shapes.push(cube);
        scene.add(cube);
      }

      // Torus rings
      for (let i = 0; i < 4; i++) {
        const geometry = new THREE.TorusGeometry(3, 0.5, 8, 16);
        const material = new THREE.MeshBasicMaterial({
          color: 0x06b6d4,
          wireframe: true,
          transparent: true,
          opacity: 0.3,
        });
        const torus = new THREE.Mesh(geometry, material);

        torus.position.set(
          (Math.random() - 0.5) * 50,
          (Math.random() - 0.5) * 50,
          (Math.random() - 0.5) * 50
        );

        shapes.push(torus);
        scene.add(torus);
      }

      return shapes;
    };

    const floatingShapes = createFloatingShapes();

    // Create DNA helix
    const createDNAHelix = () => {
      const group = new THREE.Group();
      const helixGeometry = new THREE.SphereGeometry(0.2, 8, 8);
      const material1 = new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.8,
      });
      const material2 = new THREE.MeshBasicMaterial({
        color: 0x8b5cf6,
        transparent: true,
        opacity: 0.8,
      });

      for (let i = 0; i < 100; i++) {
        const sphere1 = new THREE.Mesh(helixGeometry, material1);
        const sphere2 = new THREE.Mesh(helixGeometry, material2);

        const angle = (i / 100) * Math.PI * 8;
        const y = (i / 100) * 40 - 20;

        sphere1.position.set(Math.cos(angle) * 5, y, Math.sin(angle) * 5);
        sphere2.position.set(
          Math.cos(angle + Math.PI) * 5,
          y,
          Math.sin(angle + Math.PI) * 5
        );

        group.add(sphere1);
        group.add(sphere2);
      }

      group.position.set(20, 0, -10);
      return group;
    };

    const dnaHelix = createDNAHelix();
    scene.add(dnaHelix);

    // Animation variables
    let time = 0;
    const clock = new THREE.Clock();

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      time = clock.getElapsedTime();

      // Update particle system
      if (particleSystem.material.uniforms) {
        particleSystem.material.uniforms.time.value = time;
      }

      // Animate floating shapes
      floatingShapes.forEach((shape, index) => {
        shape.rotation.x += 0.005 * (index % 2 === 0 ? 1 : -1);
        shape.rotation.y += 0.003 * (index % 3 === 0 ? 1 : -1);
        shape.rotation.z += 0.007 * (index % 4 === 0 ? 1 : -1);

        // Floating motion
        shape.position.y += Math.sin(time * 0.5 + index) * 0.02;
        shape.position.x += Math.cos(time * 0.3 + index) * 0.01;
      });

      // Animate network nodes
      nodes.forEach((node, index) => {
        node.position.y += Math.sin(time * 0.4 + index) * 0.01;
        node.position.x += Math.cos(time * 0.2 + index) * 0.005;
      });

      // Animate DNA helix
      dnaHelix.rotation.y += 0.01;
      dnaHelix.position.y = Math.sin(time * 0.3) * 5;

      // Camera gentle movement
      camera.position.x = Math.sin(time * 0.1) * 2;
      camera.position.y = Math.cos(time * 0.15) * 1;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!camera || !renderer) return;

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Enhanced mouse interaction
    const handleMouseMove = (event) => {
      if (!camera) return;

      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

      // Subtle camera movement
      camera.position.x += (mouseX * 3 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 2 - camera.position.y) * 0.05;

      // Animate particles based on mouse
      if (particleSystem) {
        particleSystem.rotation.x += mouseY * 0.0001;
        particleSystem.rotation.y += mouseX * 0.0001;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }

      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);

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

export default ThreeBackground;
