import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const MetallicSpheresBackground = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationIdRef = useRef(null);
  const spheresRef = useRef([]);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x2a2a2a, 50, 300);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 50);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x1a1a1a, 0.1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    currentMount.appendChild(renderer.domElement);

    // Lighting setup for realistic metallic look
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    // Main directional light (sunlight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(30, 50, 40);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    scene.add(directionalLight);

    // Rim light for metallic edge highlighting
    const rimLight = new THREE.DirectionalLight(0x87ceeb, 0.8);
    rimLight.position.set(-30, 20, 30);
    scene.add(rimLight);

    // Warm accent light
    const accentLight = new THREE.PointLight(0xffa500, 0.6, 100);
    accentLight.position.set(20, -20, 30);
    scene.add(accentLight);

    // Create environment map for reflections
    const createEnvironmentMap = () => {
      const envMapSize = 512;
      const renderTarget = new THREE.WebGLCubeRenderTarget(envMapSize);
      renderTarget.texture.type = THREE.HalfFloatType;

      // Create a simple environment using gradient
      const envScene = new THREE.Scene();

      // Sky gradient
      const skyGeometry = new THREE.SphereGeometry(100, 32, 16);
      const skyMaterial = new THREE.ShaderMaterial({
        uniforms: {
          topColor: { value: new THREE.Color(0x87ceeb) }, // Sky blue
          bottomColor: { value: new THREE.Color(0x2f4f4f) }, // Dark slate gray
          offset: { value: 33 },
          exponent: { value: 0.6 },
        },
        vertexShader: `
          varying vec3 vWorldPosition;
          void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 topColor;
          uniform vec3 bottomColor;
          uniform float offset;
          uniform float exponent;
          varying vec3 vWorldPosition;
          
          void main() {
            float h = normalize(vWorldPosition + offset).y;
            gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
          }
        `,
        side: THREE.BackSide,
      });

      const skyMesh = new THREE.Mesh(skyGeometry, skyMaterial);
      envScene.add(skyMesh);

      const cubeCamera = new THREE.CubeCamera(1, 1000, renderTarget);
      cubeCamera.update(renderer, envScene);

      return renderTarget.texture;
    };

    const envMap = createEnvironmentMap();

    // Metallic sphere material
    const createMetallicMaterial = (
      hue = 0.6,
      roughness = 0.1,
      metalness = 0.9
    ) => {
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(hue, 0.2, 0.7),
        metalness: metalness,
        roughness: roughness,
        envMap: envMap,
        envMapIntensity: 1.5,
        transparent: true,
        opacity: 0.95,
      });
    };

    // Create multiple metallic spheres with varying sizes and positions
    const spheres = [];
    const sphereCount = 150;

    for (let i = 0; i < sphereCount; i++) {
      // Varying sphere sizes - mostly small with some larger ones
      let radius;
      const sizeRandom = Math.random();
      if (sizeRandom < 0.7) {
        radius = 0.3 + Math.random() * 0.8; // Small spheres
      } else if (sizeRandom < 0.9) {
        radius = 1.2 + Math.random() * 1.5; // Medium spheres
      } else {
        radius = 2.0 + Math.random() * 2.0; // Large spheres
      }

      const geometry = new THREE.SphereGeometry(radius, 32, 24);

      // Vary the metallic properties
      const hue = 0.55 + Math.random() * 0.1; // Blue-ish metallic tones
      const roughness = 0.05 + Math.random() * 0.15;
      const metalness = 0.85 + Math.random() * 0.15;

      const material = createMetallicMaterial(hue, roughness, metalness);
      const sphere = new THREE.Mesh(geometry, material);

      // Position spheres in 3D space
      sphere.position.set(
        (Math.random() - 0.5) * 120,
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 100
      );

      // Enable shadows
      sphere.castShadow = true;
      sphere.receiveShadow = true;

      // Store animation data
      sphere.userData = {
        originalPosition: sphere.position.clone(),
        floatSpeed: 0.2 + Math.random() * 0.3,
        floatAmplitude: 0.5 + Math.random() * 1.5,
        rotationSpeed: 0.1 + Math.random() * 0.2,
        phase: Math.random() * Math.PI * 2,
        radius: radius,
      };

      spheres.push(sphere);
      scene.add(sphere);
    }

    spheresRef.current = spheres;

    // Create ground plane for reflections (invisible but casts shadows)
    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      transparent: true,
      opacity: 0.1,
      roughness: 0.8,
      metalness: 0.2,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -40;
    ground.receiveShadow = true;
    scene.add(ground);

    // Add some floating metallic particles for depth
    const createMetallicParticles = () => {
      const particleCount = 100;
      const particles = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        positions[i3] = (Math.random() - 0.5) * 200;
        positions[i3 + 1] = (Math.random() - 0.5) * 150;
        positions[i3 + 2] = (Math.random() - 0.5) * 150;

        // Metallic particle colors
        const metallic = 0.6 + Math.random() * 0.4;
        colors[i3] = metallic * 0.8; // R
        colors[i3 + 1] = metallic * 0.9; // G
        colors[i3 + 2] = metallic; // B

        sizes[i] = 0.5 + Math.random() * 1.5;
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
          mouse: { value: new THREE.Vector2(0.5, 0.5) },
        },
        vertexShader: `
          uniform float time;
          uniform vec2 mouse;
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          varying float vAlpha;
          
          void main() {
            vColor = color;
            
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            
            // Floating motion
            mvPosition.y += sin(time * 0.3 + position.x * 0.01) * 2.0;
            mvPosition.x += cos(time * 0.2 + position.y * 0.008) * 1.5;
            mvPosition.z += sin(time * 0.25 + position.z * 0.005) * 1.0;
            
            // Mouse interaction
            vec2 mouseInfluence = (mouse - 0.5) * 10.0;
            float mouseDistance = length(mvPosition.xy - mouseInfluence);
            float mouseEffect = smoothstep(15.0, 0.0, mouseDistance) * 0.3;
            mvPosition.xy += mouseInfluence * mouseEffect;
            
            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = size * (100.0 / -mvPosition.z);
            
            vAlpha = 1.0 - (length(mvPosition.xyz) / 150.0);
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vAlpha;
          
          void main() {
            vec2 center = gl_PointCoord - vec2(0.5);
            float dist = length(center);
            
            if (dist > 0.5) discard;
            
            // Metallic shine effect
            float shine = 1.0 - dist;
            shine = pow(shine, 2.0);
            
            float alpha = shine * vAlpha * 0.8;
            gl_FragColor = vec4(vColor * shine, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        vertexColors: true,
      });

      return new THREE.Points(particles, particleMaterial);
    };

    const metallicParticles = createMetallicParticles();
    scene.add(metallicParticles);

    // Animation variables
    let time = 0;
    const clock = new THREE.Clock();
    const targetMouse = new THREE.Vector2(0.5, 0.5);
    const smoothMouse = new THREE.Vector2(0.5, 0.5);

    // Mouse interaction
    const handleMouseMove = (event) => {
      targetMouse.x = event.clientX / window.innerWidth;
      targetMouse.y = 1.0 - event.clientY / window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      time = clock.getElapsedTime();

      // Smooth mouse interpolation
      smoothMouse.x += (targetMouse.x - smoothMouse.x) * 0.05;
      smoothMouse.y += (targetMouse.y - smoothMouse.y) * 0.05;

      // Update spheres
      spheres.forEach((sphere, index) => {
        const userData = sphere.userData;

        // Floating animation
        sphere.position.y =
          userData.originalPosition.y +
          Math.sin(time * userData.floatSpeed + userData.phase) *
            userData.floatAmplitude;

        sphere.position.x =
          userData.originalPosition.x +
          Math.cos(time * userData.floatSpeed * 0.7 + userData.phase) *
            (userData.floatAmplitude * 0.5);

        sphere.position.z =
          userData.originalPosition.z +
          Math.sin(time * userData.floatSpeed * 0.5 + userData.phase) *
            (userData.floatAmplitude * 0.3);

        // Rotation for light reflection variation
        sphere.rotation.x += userData.rotationSpeed * 0.01;
        sphere.rotation.y += userData.rotationSpeed * 0.008;
        sphere.rotation.z += userData.rotationSpeed * 0.005;

        // Mouse interaction - attract larger spheres more
        const mouseInfluence = (smoothMouse.x - 0.5) * 20;
        const mouseInfluenceY = (smoothMouse.y - 0.5) * 15;
        const influenceStrength = userData.radius / 3.0;

        sphere.position.x += mouseInfluence * influenceStrength * 0.1;
        sphere.position.y += mouseInfluenceY * influenceStrength * 0.1;
      });

      // Update particles
      metallicParticles.material.uniforms.time.value = time;
      metallicParticles.material.uniforms.mouse.value.copy(smoothMouse);

      // Update lights for dynamic lighting
      directionalLight.position.x = 30 + Math.sin(time * 0.1) * 10;
      directionalLight.position.z = 40 + Math.cos(time * 0.1) * 10;

      accentLight.position.x = 20 + Math.sin(time * 0.2) * 15;
      accentLight.position.z = 30 + Math.cos(time * 0.2) * 15;

      // Camera movement
      const mouseParallaxX = (smoothMouse.x - 0.5) * 5;
      const mouseParallaxY = (smoothMouse.y - 0.5) * 3;

      camera.position.x = mouseParallaxX + Math.sin(time * 0.05) * 2;
      camera.position.y = mouseParallaxY + Math.cos(time * 0.03) * 1;
      camera.lookAt(mouseParallaxX * 0.1, mouseParallaxY * 0.1, 0);

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

export default MetallicSpheresBackground;
