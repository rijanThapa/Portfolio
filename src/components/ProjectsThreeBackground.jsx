// ...existing code...
import React, { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";

const ProjectsThreeBackground = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationIdRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const geometryObjectsRef = useRef([]);
  const particleSystemRef = useRef(null);
  const lightRef = useRef(null);
  const mouseLineRef = useRef(null);

  // Memoized geometries for performance
  const geometries = useMemo(
    () => ({
      sphere: new THREE.SphereGeometry(0.7, 48, 48),
      torus: new THREE.TorusGeometry(1, 0.28, 32, 100),
      octahedron: new THREE.OctahedronGeometry(1.1),
      icosahedron: new THREE.IcosahedronGeometry(0.9, 1),
      box: new THREE.BoxGeometry(1.1, 1.1, 1.1),
    }),
    []
  );

  // Professional dark color scheme
  const colorSchemes = useMemo(
    () => ({
      all: {
        primary: new THREE.Color(0x00fff7), // Cyan
        secondary: new THREE.Color(0x7c3aed), // Purple
        accent: new THREE.Color(0x2563eb), // Blue
        glow: new THREE.Color(0xffffff),
      },
    }),
    []
  );

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;
    const rect = currentMount.getBoundingClientRect();

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    scene.fog = new THREE.Fog(0x050505, 18, 80);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      70,
      rect.width / rect.height,
      0.1,
      1000
    );
    camera.position.set(0, 0, 28);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      alpha: false,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(rect.width, rect.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x050505, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    currentMount.appendChild(renderer.domElement);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.18);
    scene.add(ambientLight);

    // Main moving spot light for glow
    const spotLight = new THREE.SpotLight(
      0xffffff,
      2.5,
      100,
      Math.PI / 4,
      0.7,
      1.5
    );
    spotLight.position.set(0, 20, 20);
    spotLight.castShadow = true;
    scene.add(spotLight);
    lightRef.current = spotLight;

    // Colorful point lights for accent
    const scheme = colorSchemes.all;
    const pointLight1 = new THREE.PointLight(scheme.primary, 1.2, 60);
    pointLight1.position.set(-15, 10, 10);
    scene.add(pointLight1);
    const pointLight2 = new THREE.PointLight(scheme.secondary, 1.2, 60);
    pointLight2.position.set(15, -10, 10);
    scene.add(pointLight2);
    const pointLight3 = new THREE.PointLight(scheme.accent, 1.1, 50);
    pointLight3.position.set(0, 15, -10);
    scene.add(pointLight3);

    // Create particle system
    const createParticleSystem = () => {
      const particleCount = 1200;
      const particles = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      const velocities = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 70;
        positions[i3 + 1] = (Math.random() - 0.5) * 70;
        positions[i3 + 2] = (Math.random() - 0.5) * 50;
        velocities[i3] = (Math.random() - 0.5) * 0.018;
        velocities[i3 + 1] = (Math.random() - 0.5) * 0.018;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.018;
        // Color: mostly cyan, some purple, some blue
        const colorChoice = Math.random();
        let selectedColor;
        if (colorChoice < 0.5) selectedColor = scheme.primary;
        else if (colorChoice < 0.8) selectedColor = scheme.secondary;
        else selectedColor = scheme.accent;
        colors[i3] = selectedColor.r;
        colors[i3 + 1] = selectedColor.g;
        colors[i3 + 2] = selectedColor.b;
        sizes[i] = Math.random() * 2.5 + 0.7;
      }
      particles.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      particles.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      particles.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
      particles.userData = { velocities };
      const particleMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          mouse: { value: new THREE.Vector2() },
        },
        vertexShader: `
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          uniform float time;
          uniform vec2 mouse;
          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            mvPosition.y += sin(time * 2.0 + position.x * 0.13) * 1.7;
            mvPosition.x += cos(time * 1.5 + position.z * 0.11) * 1.2;
            vec2 mouseEffect = mouse * 0.13;
            mvPosition.xy += mouseEffect;
            gl_PointSize = size * (260.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          uniform float time;
          void main() {
            vec2 center = gl_PointCoord - 0.5;
            float dist = length(center);
            if (dist > 0.5) discard;
            float alpha = 1.0 - (dist * 2.0);
            alpha *= (0.7 + 0.3 * sin(time * 3.0));
            gl_FragColor = vec4(vColor, alpha * 0.85);
          }
        `,
        transparent: true,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
      });
      const particleSystem = new THREE.Points(particles, particleMaterial);
      scene.add(particleSystem);
      particleSystemRef.current = particleSystem;
    };

    // Create floating geometric objects (glassy, glowing, metallic)
    const createGeometricObjects = () => {
      const objects = [];
      const objectCount = 14;
      const geometryTypes = Object.keys(geometries);
      for (let i = 0; i < objectCount; i++) {
        const geometryType = geometryTypes[i % geometryTypes.length];
        const geometry = geometries[geometryType];
        // Glassy, glowing, metallic material
        const material = new THREE.MeshPhysicalMaterial({
          color:
            i % 3 === 0
              ? scheme.primary
              : i % 3 === 1
              ? scheme.secondary
              : scheme.accent,
          metalness: 1.0,
          roughness: 0.08,
          transparent: true,
          opacity: 0.82,
          clearcoat: 1.0,
          clearcoatRoughness: 0.05,
          reflectivity: 1.0,
          transmission: 0.7,
          ior: 1.4,
          thickness: 1.2,
          sheen: 1.0,
          sheenColor: scheme.glow,
          envMapIntensity: 2.2,
          emissive: scheme.glow,
          emissiveIntensity: 0.13,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
          (Math.random() - 0.5) * 38,
          (Math.random() - 0.5) * 28,
          (Math.random() - 0.5) * 18
        );
        mesh.rotation.set(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        );
        const scale = 0.7 + Math.random() * 1.7;
        mesh.scale.setScalar(scale);
        mesh.userData = {
          rotationSpeed: {
            x: (Math.random() - 0.5) * 0.018,
            y: (Math.random() - 0.5) * 0.018,
            z: (Math.random() - 0.5) * 0.018,
          },
          floatSpeed: 0.6 + Math.random() * 1.2,
          floatRange: 2.2 + Math.random() * 2.7,
          originalY: mesh.position.y,
        };
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);
        objects.push(mesh);
      }
      geometryObjectsRef.current = objects;
    };

    // Create trailing line that follows the mouse
    const createMouseLine = () => {
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00fff7,
        linewidth: 2,
        transparent: true,
        opacity: 0.7,
      });
      const points = [];
      for (let i = 0; i < 20; i++) {
        points.push(new THREE.Vector3(0, 0, 0));
      }
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);
      mouseLineRef.current = { line, points };
    };

    createParticleSystem();
    createGeometricObjects();
    createMouseLine();

    // Mouse movement handler
    const handleMouseMove = (event) => {
      const rect = currentMount.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };
    currentMount.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    const animate = (time) => {
      animationIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = time * 0.001;
      // Update particle system
      if (particleSystemRef.current) {
        const material = particleSystemRef.current.material;
        material.uniforms.time.value = elapsedTime;
        material.uniforms.mouse.value.set(
          mouseRef.current.x,
          mouseRef.current.y
        );
        // Animate particles
        const positions =
          particleSystemRef.current.geometry.attributes.position.array;
        const velocities =
          particleSystemRef.current.geometry.userData.velocities;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i] += velocities[i];
          positions[i + 1] += velocities[i + 1];
          positions[i + 2] += velocities[i + 2];
          // Boundary check and reset
          if (Math.abs(positions[i]) > 35) velocities[i] *= -1;
          if (Math.abs(positions[i + 1]) > 35) velocities[i + 1] *= -1;
          if (Math.abs(positions[i + 2]) > 25) velocities[i + 2] *= -1;
        }
        particleSystemRef.current.geometry.attributes.position.needsUpdate = true;
      }
      // Update geometric objects
      geometryObjectsRef.current.forEach((object, index) => {
        const userData = object.userData;
        // Rotation animation
        object.rotation.x += userData.rotationSpeed.x;
        object.rotation.y += userData.rotationSpeed.y;
        object.rotation.z += userData.rotationSpeed.z;
        // Floating animation
        object.position.y =
          userData.originalY +
          Math.sin(elapsedTime * userData.floatSpeed + index) *
            userData.floatRange;
        // Mouse interaction
        const mouseInfluence = 0.5;
        object.position.x +=
          (mouseRef.current.x * mouseInfluence - object.position.x) * 0.02;
        object.position.z +=
          (mouseRef.current.y * mouseInfluence - object.position.z) * 0.02;
        // Pulsing effect
        const pulse = 1 + 0.09 * Math.sin(elapsedTime * 2 + index);
        object.scale.setScalar(object.scale.x * pulse);
      });

      // Update mouse trailing line
      if (mouseLineRef.current) {
        const { line, points } = mouseLineRef.current;
        // Shift points back
        for (let i = points.length - 1; i > 0; i--) {
          points[i].copy(points[i - 1]);
        }
        // Set new head to mouse position (projected into 3D)
        const mouse3D = new THREE.Vector3(
          mouseRef.current.x * 18,
          mouseRef.current.y * 12,
          0
        );
        points[0].copy(mouse3D);
        line.geometry.setFromPoints(points);
      }

      // Dynamic lighting
      if (lightRef.current) {
        lightRef.current.position.x = 13 * Math.cos(elapsedTime * 0.5);
        lightRef.current.position.z = 13 * Math.sin(elapsedTime * 0.5);
      }
      // Camera subtle movement
      camera.position.x +=
        (mouseRef.current.x * 2.2 - camera.position.x) * 0.018;
      camera.position.y +=
        (-mouseRef.current.y * 2.2 - camera.position.y) * 0.018;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    animate(0);

    // Handle resize
    const handleResize = () => {
      const rect = currentMount.getBoundingClientRect();
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
      renderer.setSize(rect.width, rect.height);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      currentMount.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometryObjectsRef.current.forEach((object) => {
        object.geometry.dispose();
        object.material.dispose();
      });
      if (particleSystemRef.current) {
        particleSystemRef.current.geometry.dispose();
        particleSystemRef.current.material.dispose();
      }
      if (mouseLineRef.current) {
        scene.remove(mouseLineRef.current.line);
        mouseLineRef.current.line.geometry.dispose();
        mouseLineRef.current.line.material.dispose();
      }
    };
  }, [colorSchemes, geometries]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

export default ProjectsThreeBackground;
