import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const LiquidThreeBackground = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0a0a, 20, 150);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 25);

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
    renderer.toneMappingExposure = 0.6;
    rendererRef.current = renderer;

    currentMount.appendChild(renderer.domElement);

    // Realistic Water Drop Shader Material
    const waterDropMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        mouse: { value: new THREE.Vector2(0.5, 0.5) },
        colorA: { value: new THREE.Color(0x1e3a8a) }, // Deep Water Blue
        colorB: { value: new THREE.Color(0x3b82f6) }, // Bright Blue
        colorC: { value: new THREE.Color(0x93c5fd) }, // Light Blue
        refractionStrength: { value: 1.5 },
        opacity: { value: 0.7 },
      },
      vertexShader: `
        uniform float time;
        uniform vec2 mouse;
        
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        varying float vWaterEffect;
        varying vec3 vWorldPosition;
        
        // Water surface noise function
        float waterNoise(vec3 p) {
          return sin(p.x * 2.0 + time) * sin(p.y * 1.5 + time * 0.8) * sin(p.z * 1.2 + time * 0.6) * 0.3;
        }
        
        void main() {
          vUv = uv;
          vPosition = position;
          vNormal = normal;
          
          // Create water drop surface tension effect
          float surfaceTension = waterNoise(position * 3.0) * 0.1;
          
          // Mouse interaction for water ripples
          vec3 mouseInfluence = vec3(mouse.x - 0.5, mouse.y - 0.5, 0.0) * 4.0;
          float mouseDistance = length(position.xy - mouseInfluence.xy);
          float rippleEffect = sin(mouseDistance * 5.0 - time * 8.0) * 
                              exp(-mouseDistance * 0.5) * 0.3;
          
          // Combine surface effects
          float totalDisplacement = surfaceTension + rippleEffect;
          
          // Apply displacement for water drop shape
          vec3 newPosition = position + normal * totalDisplacement;
          
          vWaterEffect = totalDisplacement;
          vWorldPosition = (modelMatrix * vec4(newPosition, 1.0)).xyz;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 colorA;
        uniform vec3 colorB;
        uniform vec3 colorC;
        uniform vec2 mouse;
        uniform float opacity;
        uniform float refractionStrength;
        
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        varying float vWaterEffect;
        varying vec3 vWorldPosition;
        
        void main() {
          // Water drop refraction effect
          vec3 normal = normalize(vNormal);
          vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
          
          // Create realistic water refraction
          float fresnel = pow(1.0 - max(dot(normal, viewDirection), 0.0), 2.0);
          
          // Water color mixing based on depth and angle
          float depth = length(vPosition) * 0.1;
          vec3 waterColor = mix(colorA, colorB, depth);
          waterColor = mix(waterColor, colorC, fresnel);
          
          // Add surface highlights like real water
          float highlight = pow(max(dot(normal, normalize(vec3(1.0, 1.0, 1.0))), 0.0), 50.0);
          waterColor += vec3(1.0) * highlight * 0.8;
          
          // Surface tension effect
          float rim = 1.0 - abs(dot(normal, viewDirection));
          rim = pow(rim, 2.0);
          waterColor += vec3(0.3, 0.6, 1.0) * rim * 0.5;
          
          // Caustic-like pattern
          float caustic = sin(vPosition.x * 10.0 + time * 2.0) * 
                         sin(vPosition.y * 8.0 + time * 1.5) * 0.1 + 0.9;
          waterColor *= caustic;
          
          // Mouse interaction highlighting
          vec2 mousePos = mouse * 2.0 - 1.0;
          float mouseDistance = length(vPosition.xy - mousePos);
          float mouseGlow = smoothstep(3.0, 0.0, mouseDistance) * 0.3;
          waterColor += vec3(0.5, 0.8, 1.0) * mouseGlow;
          
          // Final alpha with water-like transparency
          float alpha = opacity * (0.4 + fresnel * 0.6);
          alpha *= smoothstep(0.0, 0.2, length(vUv - 0.5));
          
          gl_FragColor = vec4(waterColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    // Create realistic water drops with varying sizes
    const createWaterDrop = (scale, position, opacity = 1.0) => {
      const geometry = new THREE.SphereGeometry(scale, 32, 32);
      const material = waterDropMaterial.clone();
      material.uniforms.opacity.value = opacity * 0.8;
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(position);
      return mesh;
    };

    // Create falling water drops with physics from realistic ceiling positions
    const createFallingWaterDrop = (
      scale,
      startX,
      startY,
      fallSpeed = 1.0,
      opacity = 1.0
    ) => {
      const geometry = new THREE.SphereGeometry(scale, 16, 16);
      const material = waterDropMaterial.clone();
      material.uniforms.opacity.value = opacity * 0.8;
      const mesh = new THREE.Mesh(geometry, material);

      // Set initial position at realistic ceiling/roof height
      mesh.position.set(startX, startY, Math.random() * -5 - 2);

      // Add custom properties for realistic water drop physics
      mesh.userData = {
        fallSpeed: fallSpeed,
        initialY: startY,
        resetY: startY + 5, // Smaller reset range for realism
        swayAmplitude: Math.random() * 0.3 + 0.1, // Reduced sway for realism
        swaySpeed: Math.random() * 0.3 + 0.2,
        spawnPoint: { x: startX, y: startY }, // Remember original spawn point
        gravity: 0.98, // Add gravity acceleration
      };

      return mesh;
    };

    // Create array of falling drops from realistic ceiling points
    const fallingDrops = [];

    // Define realistic ceiling/roof spawn points where water would naturally drip
    const ceilingDripPoints = [
      { x: -15, y: 25 }, // Left side ceiling edge
      { x: -8, y: 28 }, // Left ceiling corner
      { x: 0, y: 30 }, // Center ceiling highest point
      { x: 8, y: 28 }, // Right ceiling corner
      { x: 15, y: 25 }, // Right side ceiling edge
      { x: -22, y: 22 }, // Far left overhang
      { x: 22, y: 22 }, // Far right overhang
      { x: -5, y: 27 }, // Left center ceiling
      { x: 5, y: 27 }, // Right center ceiling
      { x: -12, y: 26 }, // Left intermediate point
      { x: 12, y: 26 }, // Right intermediate point
      { x: -18, y: 24 }, // Left edge
      { x: 18, y: 24 }, // Right edge
      { x: -3, y: 29 }, // Near center left
      { x: 3, y: 29 }, // Near center right
    ];

    // Create drops from these realistic points
    ceilingDripPoints.forEach((point, index) => {
      const drop = createFallingWaterDrop(
        Math.random() * 0.2 + 0.08, // Smaller, more realistic drop sizes
        point.x + (Math.random() - 0.5) * 2, // Small random offset from exact point
        point.y,
        Math.random() * 0.3 + 0.6, // Realistic fall speed
        Math.random() * 0.5 + 0.5 // Good visibility
      );
      fallingDrops.push(drop);
      scene.add(drop);
    });

    // Create static water drops for background depth
    const staticDrops = [
      // Large background drops for ambiance
      createWaterDrop(4.5, new THREE.Vector3(0, 0, -15), 0.3),
      createWaterDrop(4.0, new THREE.Vector3(-20, 5, -18), 0.25),
      createWaterDrop(4.2, new THREE.Vector3(18, -3, -16), 0.28),
      createWaterDrop(3.8, new THREE.Vector3(-12, -8, -20), 0.22),

      // Medium background drops
      createWaterDrop(3.2, new THREE.Vector3(-8, 6, -12), 0.35),
      createWaterDrop(3.0, new THREE.Vector3(12, -5, -14), 0.32),
      createWaterDrop(2.8, new THREE.Vector3(-15, 0, -17), 0.3),

      // Small ambient drops
      createWaterDrop(2.0, new THREE.Vector3(-25, 10, -22), 0.2),
      createWaterDrop(1.8, new THREE.Vector3(22, -10, -19), 0.22),
      createWaterDrop(1.5, new THREE.Vector3(-18, -15, -25), 0.18),
      createWaterDrop(1.7, new THREE.Vector3(25, 8, -21), 0.19),
    ];

    staticDrops.forEach((drop) => scene.add(drop));

    // Create subtle professional particles covering full screen
    const createFloatingParticles = () => {
      const particleCount = 400;
      const particles = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Distribute particles across entire screen space
        positions[i3] = (Math.random() - 0.5) * 120;
        positions[i3 + 1] = (Math.random() - 0.5) * 120;
        positions[i3 + 2] = (Math.random() - 0.5) * 100;

        // Water-like color palette
        const colorChoice = Math.random();
        if (colorChoice < 0.4) {
          colors[i3] = 0.12; // Deep Water Blue
          colors[i3 + 1] = 0.35;
          colors[i3 + 2] = 0.54;
        } else if (colorChoice < 0.7) {
          colors[i3] = 0.23; // Bright Blue
          colors[i3 + 1] = 0.51;
          colors[i3 + 2] = 0.96;
        } else {
          colors[i3] = 0.58; // Light Blue
          colors[i3 + 1] = 0.77;
          colors[i3 + 2] = 0.99;
        }

        sizes[i] = Math.random() * 1.5 + 0.3;
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
        },
        vertexShader: `
          uniform float time;
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          varying float vAlpha;
          
          void main() {
            vColor = color;
            
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            
            // Enhanced floating motion with mouse responsiveness
            mvPosition.y += sin(time * 0.4 + position.x * 0.01) * 2.0;
            mvPosition.x += cos(time * 0.3 + position.y * 0.008) * 1.5;
            mvPosition.z += sin(time * 0.2 + position.z * 0.005) * 1.0;
            
            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = size * (150.0 / -mvPosition.z);
            
            vAlpha = 1.0 - (length(mvPosition.xyz) / 120.0);
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vAlpha;
          
          void main() {
            vec2 center = gl_PointCoord - vec2(0.5);
            float dist = length(center);
            
            if (dist > 0.5) discard;
            
            float alpha = (1.0 - dist * 2.0) * vAlpha * 0.4;
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

    const floatingParticles = createFloatingParticles();
    scene.add(floatingParticles);

    // Animation variables
    let time = 0;
    const clock = new THREE.Clock();
    const targetMouse = new THREE.Vector2(0.5, 0.5);
    const smoothMouse = new THREE.Vector2(0.5, 0.5);
    let lastDropSpawn = 0;
    const dropSpawnInterval = 3; // Spawn new drop every 3 seconds for realism

    // Mouse interaction with smooth movement
    const handleMouseMove = (event) => {
      targetMouse.x = event.clientX / window.innerWidth;
      targetMouse.y = 1.0 - event.clientY / window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      time = clock.getElapsedTime();

      // Smooth mouse interpolation for fluid movement
      smoothMouse.x += (targetMouse.x - smoothMouse.x) * 0.05;
      smoothMouse.y += (targetMouse.y - smoothMouse.y) * 0.05;

      // Calculate mouse influence for drops
      const mouseInfluenceX = (smoothMouse.x - 0.5) * 10;
      const mouseInfluenceY = (smoothMouse.y - 0.5) * 10;

      // Spawn new falling drops periodically from realistic ceiling points
      if (
        time - lastDropSpawn > dropSpawnInterval &&
        fallingDrops.length < 25
      ) {
        // Choose a random ceiling drip point for realism
        const dripPoint =
          ceilingDripPoints[
            Math.floor(Math.random() * ceilingDripPoints.length)
          ];

        const newDrop = createFallingWaterDrop(
          Math.random() * 0.15 + 0.08, // Small realistic drop size
          dripPoint.x + (Math.random() - 0.5) * 1.5, // Small variation from drip point
          dripPoint.y + Math.random() * 2, // Slight height variation
          Math.random() * 0.3 + 0.6, // Realistic fall speed
          Math.random() * 0.4 + 0.6 // Good visibility
        );
        fallingDrops.push(newDrop);
        scene.add(newDrop);
        lastDropSpawn = time;
      }

      // Update falling drops animation with realistic physics
      fallingDrops.forEach((drop, index) => {
        drop.material.uniforms.time.value = time;
        drop.material.uniforms.mouse.value.copy(smoothMouse);

        // Realistic falling animation with gravity acceleration
        drop.userData.fallSpeed *= drop.userData.gravity;
        drop.position.y -= drop.userData.fallSpeed * 0.3;

        // Natural swaying motion like real water drops
        drop.position.x +=
          Math.sin(time * drop.userData.swaySpeed + index) *
          drop.userData.swayAmplitude *
          0.01;

        // Reset to original spawn point when drop falls below screen
        if (drop.position.y < -25) {
          // Return to the original ceiling drip point
          drop.position.x =
            drop.userData.spawnPoint.x + (Math.random() - 0.5) * 1.5;
          drop.position.y = drop.userData.spawnPoint.y + Math.random() * 2;
          drop.position.z = Math.random() * -5 - 2;
          drop.userData.fallSpeed = Math.random() * 0.3 + 0.6; // Reset fall speed
        }

        // Mouse interaction - drops get slightly influenced by air currents
        const dropX = drop.position.x;
        const dropY = drop.position.y;
        const distanceFromMouse = Math.sqrt(
          Math.pow(dropX - mouseInfluenceX, 2) +
            Math.pow(dropY - mouseInfluenceY, 2)
        );
        const mouseEffect = Math.max(0, 1 - distanceFromMouse / 12) * 0.2;

        // Subtle air current effect from mouse movement
        if (mouseEffect > 0) {
          const airCurrentForce = mouseEffect * 0.005;
          drop.position.x += (mouseInfluenceX - dropX) * airCurrentForce;
        }

        // Minimal rotation for natural effect
        drop.rotation.z += 0.01;
      });

      // Update static background drops
      staticDrops.forEach((drop, index) => {
        drop.material.uniforms.time.value = time;
        drop.material.uniforms.mouse.value.copy(smoothMouse);

        // Gentle floating motion for background drops
        drop.position.y += Math.sin(time * 0.3 + index * 1.5) * 0.005;
        drop.position.x += Math.cos(time * 0.2 + index * 1.2) * 0.003;

        // Subtle rotation
        drop.rotation.x += 0.001 * (index % 2 === 0 ? 1 : -1);
        drop.rotation.y += 0.0015 * (index % 3 === 0 ? 1 : -1);
      });

      // Update particle system with mouse interaction
      floatingParticles.material.uniforms.time.value = time;

      // Mouse-responsive particle movement
      const positions = floatingParticles.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        const distanceFromMouse = Math.sqrt(
          Math.pow(x - mouseInfluenceX * 2, 2) +
            Math.pow(y - mouseInfluenceY * 2, 2)
        );
        const mouseEffect = Math.max(0, 1 - distanceFromMouse / 20);

        // Apply subtle mouse influence to particles
        positions[i] +=
          Math.sin(mouseInfluenceX * 0.05 + i) * mouseEffect * 0.1;
        positions[i + 1] +=
          Math.cos(mouseInfluenceY * 0.05 + i) * mouseEffect * 0.08;
      }
      floatingParticles.geometry.attributes.position.needsUpdate = true;

      // Subtle camera movement that doesn't interfere with falling drops
      camera.position.x = Math.sin(time * 0.02) * 1 + mouseInfluenceX * 0.1;
      camera.position.y = Math.cos(time * 0.015) * 0.5 + mouseInfluenceY * 0.05;
      camera.lookAt(mouseInfluenceX * 0.05, mouseInfluenceY * 0.05, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!camera || !renderer) return;

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);

      // Update material resolution for all drops
      fallingDrops.forEach((drop) => {
        drop.material.uniforms.resolution.value.set(
          window.innerWidth,
          window.innerHeight
        );
      });

      staticDrops.forEach((drop) => {
        drop.material.uniforms.resolution.value.set(
          window.innerWidth,
          window.innerHeight
        );
      });
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

export default LiquidThreeBackground;
