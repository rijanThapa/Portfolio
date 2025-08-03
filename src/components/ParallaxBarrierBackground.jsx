import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const ParallaxBarrierBackground = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0a0a, 50, 200);
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
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.8;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    currentMount.appendChild(renderer.domElement);

    // Professional-level falling water drops animation
    const createFallingWaterDrops = () => {
      const dropCount = 50;
      const drops = [];

      for (let i = 0; i < dropCount; i++) {
        // Create realistic teardrop geometry
        const dropGeometry = new THREE.SphereGeometry(
          0.08 + Math.random() * 0.25,
          12,
          10
        );

        // Professional water drop shader with advanced lighting
        const dropMaterial = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            opacity: { value: 0.85 + Math.random() * 0.15 },
            colorWater: { value: new THREE.Color(0x4a90e2) },
            colorHighlight: { value: new THREE.Color(0xffffff) },
            colorDeep: { value: new THREE.Color(0x1e3a8a) },
            lightDirection: {
              value: new THREE.Vector3(-0.5, 1.0, 0.8).normalize(),
            },
            refractiveIndex: { value: 1.33 },
            velocity: { value: new THREE.Vector3(0, 0, 0) },
            dropSize: { value: 1.0 },
            surfaceTension: { value: 0.8 },
          },
          vertexShader: `
            uniform float time;
            uniform vec3 velocity;
            uniform float dropSize;
            uniform float surfaceTension;
            
            varying vec3 vPosition;
            varying vec3 vNormal;
            varying vec3 vWorldPosition;
            varying vec3 vViewPosition;
            varying float vDeformation;
            
            // Advanced noise function for surface perturbation
            vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
            vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
            
            float snoise(vec3 v) {
              const vec2 C = vec2(1.0/6.0, 1.0/3.0);
              const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
              
              vec3 i = floor(v + dot(v, C.yyy));
              vec3 x0 = v - i + dot(i, C.xxx);
              
              vec3 g = step(x0.yzx, x0.xyz);
              vec3 l = 1.0 - g;
              vec3 i1 = min(g.xyz, l.zxy);
              vec3 i2 = max(g.xyz, l.zxy);
              
              vec3 x1 = x0 - i1 + C.xxx;
              vec3 x2 = x0 - i2 + C.yyy;
              vec3 x3 = x0 - D.yyy;
              
              i = mod289(i);
              vec4 p = permute(permute(permute(
                       i.z + vec4(0.0, i1.z, i2.z, 1.0))
                     + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                     + i.x + vec4(0.0, i1.x, i2.x, 1.0));
              
              float n_ = 0.142857142857;
              vec3 ns = n_ * D.wyz - D.xzx;
              
              vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
              
              vec4 x_ = floor(j * ns.z);
              vec4 y_ = floor(j - 7.0 * x_);
              
              vec4 x = x_ *ns.x + ns.yyyy;
              vec4 y = y_ *ns.x + ns.yyyy;
              vec4 h = 1.0 - abs(x) - abs(y);
              
              vec4 b0 = vec4(x.xy, y.xy);
              vec4 b1 = vec4(x.zw, y.zw);
              
              vec4 s0 = floor(b0)*2.0 + 1.0;
              vec4 s1 = floor(b1)*2.0 + 1.0;
              vec4 sh = -step(h, vec4(0.0));
              
              vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
              vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
              
              vec3 p0 = vec3(a0.xy, h.x);
              vec3 p1 = vec3(a0.zw, h.y);
              vec3 p2 = vec3(a1.xy, h.z);
              vec3 p3 = vec3(a1.zw, h.w);
              
              vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
              p0 *= norm.x;
              p1 *= norm.y;
              p2 *= norm.z;
              p3 *= norm.w;
              
              vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
              m = m * m;
              return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
            }
            
            void main() {
              vPosition = position;
              vNormal = normal;
              
              // Calculate velocity-based deformation (teardrop shape)
              float velocityMagnitude = length(velocity);
              float deformationFactor = velocityMagnitude * 0.1;
              
              // Teardrop deformation
              vec3 newPosition = position;
              if (position.y > 0.0) {
                // Top of drop - elongate based on velocity
                newPosition.y *= (1.0 + deformationFactor * 2.0);
                newPosition.xz *= (1.0 - deformationFactor * 0.3);
              } else {
                // Bottom of drop - compress slightly
                newPosition.y *= (1.0 - deformationFactor * 0.2);
                newPosition.xz *= (1.0 + deformationFactor * 0.1);
              }
              
              // Surface tension perturbation
              float surfaceNoise = snoise(position * 8.0 + time * 2.0) * 0.02 * surfaceTension;
              newPosition += normal * surfaceNoise;
              
              // Oscillation from surface tension
              float oscillation = sin(time * 15.0 + position.y * 10.0) * 0.005 * surfaceTension;
              newPosition += normal * oscillation;
              
              vDeformation = deformationFactor + abs(surfaceNoise) * 5.0;
              vWorldPosition = (modelMatrix * vec4(newPosition, 1.0)).xyz;
              
              vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
              vViewPosition = mvPosition.xyz;
              
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            uniform float time;
            uniform float opacity;
            uniform vec3 colorWater;
            uniform vec3 colorHighlight;
            uniform vec3 colorDeep;
            uniform vec3 lightDirection;
            uniform float refractiveIndex;
            uniform float dropSize;
            
            varying vec3 vPosition;
            varying vec3 vNormal;
            varying vec3 vWorldPosition;
            varying vec3 vViewPosition;
            varying float vDeformation;
            
            void main() {
              vec3 normal = normalize(vNormal);
              vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
              vec3 lightDir = normalize(lightDirection);
              
              // Advanced Fresnel calculation
              float fresnel = pow(1.0 - max(dot(normal, viewDirection), 0.0), 2.5);
              float fresnelStrong = pow(1.0 - max(dot(normal, viewDirection), 0.0), 0.8);
              
              // Refraction simulation
              vec3 refractedView = refract(-viewDirection, normal, 1.0 / refractiveIndex);
              float refractIntensity = length(refractedView);
              
              // Caustic patterns
              float caustic = sin(vPosition.x * 15.0 + time * 3.0) * 
                             sin(vPosition.y * 12.0 + time * 2.5) * 
                             sin(vPosition.z * 18.0 + time * 4.0);
              caustic = pow(abs(caustic), 2.0) * 0.3;
              
              // Professional lighting model
              float NdotL = max(dot(normal, lightDir), 0.0);
              vec3 halfVector = normalize(lightDir + viewDirection);
              float NdotH = max(dot(normal, halfVector), 0.0);
              float specular = pow(NdotH, 64.0) * 0.8;
              
              // Subsurface scattering approximation
              float thickness = 1.0 - vDeformation;
              vec3 subsurface = colorWater * pow(max(dot(-lightDir, viewDirection), 0.0), 2.0) * thickness * 0.4;
              
              // Color composition
              vec3 waterColor = mix(colorDeep, colorWater, fresnelStrong * 0.7 + 0.3);
              waterColor = mix(waterColor, colorHighlight, fresnel * 0.6);
              
              // Add lighting effects
              waterColor += colorHighlight * specular;
              waterColor += subsurface;
              waterColor += caustic * colorWater;
              
              // Surface tension highlights
              float surfaceGlow = smoothstep(0.8, 1.0, fresnel) * 0.4;
              waterColor += colorHighlight * surfaceGlow;
              
              // Depth-based color variation
              float depth = length(vViewPosition) * 0.01;
              waterColor = mix(waterColor, colorDeep, depth * 0.2);
              
              // Dynamic opacity based on viewing angle and deformation
              float alpha = opacity * (0.5 + fresnel * 0.4) * (0.8 + vDeformation * 0.2);
              alpha *= smoothstep(0.0, 0.1, NdotL + 0.2);
              
              gl_FragColor = vec4(waterColor, alpha);
            }
          `,
          transparent: true,
          side: THREE.DoubleSide,
          blending: THREE.NormalBlending,
          depthWrite: false,
        });

        const drop = new THREE.Mesh(dropGeometry, dropMaterial);

        // Sophisticated starting positions with clustering
        const clusterCenter = new THREE.Vector3(
          (Math.random() - 0.5) * 80,
          70 + Math.random() * 30,
          (Math.random() - 0.5) * 60
        );

        drop.position.set(
          clusterCenter.x + (Math.random() - 0.5) * 20,
          clusterCenter.y + Math.random() * 10,
          clusterCenter.z + (Math.random() - 0.5) * 15
        );

        // Advanced physics simulation data
        drop.userData = {
          originalX: drop.position.x,
          velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 0.5,
            0,
            (Math.random() - 0.5) * 0.2
          ),
          acceleration: new THREE.Vector3(0, -9.8, 0),
          mass: 0.8 + Math.random() * 0.4,
          dragCoefficient: 0.47,
          terminalVelocity: 8 + Math.random() * 4,
          swayAmplitude: 0.3 + Math.random() * 0.7,
          swaySpeed: 0.8 + Math.random() * 0.4,
          resetY: clusterCenter.y,
          phase: Math.random() * Math.PI * 2,
          scale: 0.6 + Math.random() * 0.8,
          rotationSpeed: new THREE.Vector3(
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.01,
            (Math.random() - 0.5) * 0.015
          ),
          surfaceTension: 0.6 + Math.random() * 0.4,
          lifeTime: 0,
          maxLifeTime: 8 + Math.random() * 4,
        };

        drop.scale.setScalar(drop.userData.scale);
        drops.push(drop);
        scene.add(drop);
      }

      return drops;
    };

    const fallingWaterDrops = createFallingWaterDrops();

    // Professional ripple effect with advanced wave propagation
    const createRippleEffect = (position, intensity = 1.0) => {
      const rippleGeometry = new THREE.RingGeometry(0.05, 6, 32);
      const rippleMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          startTime: { value: 0 },
          opacity: { value: 0.9 * intensity },
          colorRipple: { value: new THREE.Color(0x4a90e2) },
          colorHighlight: { value: new THREE.Color(0x87ceeb) },
          intensity: { value: intensity },
          waveSpeed: { value: 12.0 + Math.random() * 8.0 },
          waveFrequency: { value: 8.0 + Math.random() * 4.0 },
        },
        vertexShader: `
          uniform float time;
          uniform float startTime;
          uniform float intensity;
          varying vec2 vUv;
          varying float vRadius;
          varying float vIntensity;
          
          void main() {
            vUv = uv;
            vRadius = length(position.xy);
            
            float elapsed = time - startTime;
            
            // Wave height calculation
            float waveHeight = sin(vRadius * 15.0 - elapsed * 20.0) * 
                              exp(-elapsed * 2.0) * 
                              exp(-vRadius * 0.5) * 
                              intensity * 0.1;
            
            vIntensity = abs(waveHeight) * 10.0;
            
            vec3 newPosition = position;
            newPosition.z += waveHeight;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform float startTime;
          uniform float opacity;
          uniform vec3 colorRipple;
          uniform vec3 colorHighlight;
          uniform float intensity;
          uniform float waveSpeed;
          uniform float waveFrequency;
          
          varying vec2 vUv;
          varying float vRadius;
          varying float vIntensity;
          
          void main() {
            float elapsed = time - startTime;
            
            // Multiple wave interference
            float wave1 = sin(vRadius * waveFrequency - elapsed * waveSpeed) * 0.5 + 0.5;
            float wave2 = sin(vRadius * (waveFrequency * 1.3) - elapsed * (waveSpeed * 0.8)) * 0.3 + 0.7;
            float wave3 = sin(vRadius * (waveFrequency * 0.7) - elapsed * (waveSpeed * 1.2)) * 0.2 + 0.8;
            
            float combinedWave = wave1 * wave2 * wave3;
            
            // Distance attenuation
            float attenuation = exp(-vRadius * 0.3) * exp(-elapsed * 1.5);
            
            // Edge enhancement
            float edgeGlow = smoothstep(0.0, 0.3, vRadius) * smoothstep(1.0, 0.7, vRadius);
            
            // Color mixing
            vec3 rippleColor = mix(colorRipple, colorHighlight, combinedWave * 0.6 + 0.4);
            rippleColor += colorHighlight * edgeGlow * 0.4;
            rippleColor += colorHighlight * vIntensity * 0.3;
            
            // Dynamic opacity
            float alpha = opacity * combinedWave * attenuation * intensity;
            alpha += edgeGlow * attenuation * 0.2;
            
            gl_FragColor = vec4(rippleColor, alpha);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const ripple = new THREE.Mesh(rippleGeometry, rippleMaterial);
      ripple.position.copy(position);
      ripple.position.y = -35; // Ground level
      ripple.rotation.x = -Math.PI / 2;

      // Add slight randomization for natural look
      ripple.rotation.z = Math.random() * Math.PI * 2;

      ripple.userData = {
        startTime: clock.getElapsedTime(),
        duration: 3.5,
        intensity: intensity,
      };

      scene.add(ripple);
      return ripple;
    };

    const rippleEffects = [];

    // Professional splash particle system with advanced physics
    const createSplashParticles = () => {
      const particleCount = 200;
      const particles = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const velocities = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      const lifetimes = new Float32Array(particleCount);
      const rotations = new Float32Array(particleCount);
      const masses = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Start particles off-screen
        positions[i3] = 0;
        positions[i3 + 1] = -100;
        positions[i3 + 2] = 0;

        velocities[i3] = 0;
        velocities[i3 + 1] = 0;
        velocities[i3 + 2] = 0;

        // Professional water particle color palette
        const colorVariation = Math.random();
        if (colorVariation < 0.3) {
          // Deep water blue
          colors[i3] = 0.1 + Math.random() * 0.2;
          colors[i3 + 1] = 0.3 + Math.random() * 0.3;
          colors[i3 + 2] = 0.6 + Math.random() * 0.4;
        } else if (colorVariation < 0.7) {
          // Sky blue water
          colors[i3] = 0.3 + Math.random() * 0.3;
          colors[i3 + 1] = 0.6 + Math.random() * 0.3;
          colors[i3 + 2] = 0.8 + Math.random() * 0.2;
        } else {
          // Bright highlight
          colors[i3] = 0.7 + Math.random() * 0.3;
          colors[i3 + 1] = 0.9 + Math.random() * 0.1;
          colors[i3 + 2] = 1.0;
        }

        sizes[i] = 0.3 + Math.random() * 1.5;
        lifetimes[i] = 0;
        rotations[i] = Math.random() * Math.PI * 2;
        masses[i] = 0.5 + Math.random() * 1.0;
      }

      particles.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      particles.setAttribute(
        "velocity",
        new THREE.BufferAttribute(velocities, 3)
      );
      particles.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      particles.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
      particles.setAttribute(
        "lifetime",
        new THREE.BufferAttribute(lifetimes, 1)
      );
      particles.setAttribute(
        "rotation",
        new THREE.BufferAttribute(rotations, 1)
      );
      particles.setAttribute("mass", new THREE.BufferAttribute(masses, 1));

      const particleMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          gravity: { value: -9.8 },
          airResistance: { value: 0.98 },
        },
        vertexShader: `
          uniform float time;
          uniform float gravity;
          uniform float airResistance;
          
          attribute float size;
          attribute vec3 color;
          attribute vec3 velocity;
          attribute float lifetime;
          attribute float rotation;
          attribute float mass;
          
          varying vec3 vColor;
          varying float vAlpha;
          varying float vRotation;
          varying float vLifeProgress;
          
          void main() {
            vColor = color;
            vRotation = rotation + time * 2.0;
            vLifeProgress = lifetime / 3.0;
            
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            
            // Advanced fade calculation
            float lifeFade = smoothstep(3.0, 0.0, lifetime);
            float sizeFade = smoothstep(0.0, 0.5, lifetime) * lifeFade;
            
            // Shimmer effect
            float shimmer = sin(time * 8.0 + position.x * 0.1) * 0.2 + 0.8;
            
            vAlpha = lifeFade * shimmer;
            
            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = size * (80.0 / -mvPosition.z) * sizeFade * (1.0 + shimmer * 0.3);
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vAlpha;
          varying float vRotation;
          varying float vLifeProgress;
          
          void main() {
            vec2 center = gl_PointCoord - vec2(0.5);
            
            // Rotate the particle
            float c = cos(vRotation);
            float s = sin(vRotation);
            center = vec2(c * center.x - s * center.y, s * center.x + c * center.y);
            
            float dist = length(center);
            
            if (dist > 0.5) discard;
            
            // Professional particle shape with soft edges
            float edgeSoftness = smoothstep(0.5, 0.3, dist);
            float coreIntensity = smoothstep(0.3, 0.0, dist);
            
            // Color variation based on lifetime
            vec3 finalColor = vColor;
            finalColor += vec3(0.3, 0.5, 0.8) * coreIntensity * 0.4;
            finalColor += vec3(1.0) * coreIntensity * vLifeProgress * 0.3;
            
            float alpha = (edgeSoftness + coreIntensity * 0.5) * vAlpha;
            
            gl_FragColor = vec4(finalColor, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        vertexColors: true,
      });

      return new THREE.Points(particles, particleMaterial);
    };

    const splashParticles = createSplashParticles();
    scene.add(splashParticles);

    // Professional splash effect with realistic particle dynamics
    const createSplash = (position, intensity = 1.0) => {
      const positions = splashParticles.geometry.attributes.position.array;
      const velocities = splashParticles.geometry.attributes.velocity.array;
      const lifetimes = splashParticles.geometry.attributes.lifetime.array;
      const masses = splashParticles.geometry.attributes.mass.array;
      const rotations = splashParticles.geometry.attributes.rotation.array;

      // Professional splash with multiple particle types
      const particleTypes = [
        { count: 15, speed: 6, spread: 1.2, lifetime: 2.5 }, // Primary splash
        { count: 10, speed: 4, spread: 0.8, lifetime: 2.0 }, // Secondary droplets
        { count: 8, speed: 2, spread: 0.5, lifetime: 1.5 }, // Fine mist
      ];

      particleTypes.forEach((type) => {
        for (let i = 0; i < type.count; i++) {
          const particleIndex = Math.floor(
            Math.random() * (positions.length / 3)
          );
          const i3 = particleIndex * 3;

          if (lifetimes[particleIndex] <= 0) {
            // Position with slight randomization
            positions[i3] = position.x + (Math.random() - 0.5) * 1.5;
            positions[i3 + 1] = position.y + Math.random() * 0.5;
            positions[i3 + 2] = position.z + (Math.random() - 0.5) * 1.5;

            // Realistic splash physics
            const angle = Math.random() * Math.PI * 2;
            const elevation = Math.random() * Math.PI * 0.3 + Math.PI * 0.1; // 10-40 degrees up
            const speed = type.speed * (0.7 + Math.random() * 0.6) * intensity;

            velocities[i3] =
              Math.cos(angle) * Math.cos(elevation) * speed * type.spread;
            velocities[i3 + 1] = Math.sin(elevation) * speed;
            velocities[i3 + 2] =
              Math.sin(angle) * Math.cos(elevation) * speed * type.spread;

            lifetimes[particleIndex] =
              type.lifetime * (0.8 + Math.random() * 0.4);
            masses[particleIndex] = 0.5 + Math.random() * 1.0;
            rotations[particleIndex] = Math.random() * Math.PI * 2;
          }
        }
      });

      splashParticles.geometry.attributes.position.needsUpdate = true;
      splashParticles.geometry.attributes.velocity.needsUpdate = true;
      splashParticles.geometry.attributes.lifetime.needsUpdate = true;
      splashParticles.geometry.attributes.mass.needsUpdate = true;
      splashParticles.geometry.attributes.rotation.needsUpdate = true;
    };

    // Animation variables
    let time = 0;
    const clock = new THREE.Clock();
    const targetMouse = new THREE.Vector2(0.5, 0.5);
    const smoothMouse = new THREE.Vector2(0.5, 0.5);

    // Mouse event handlers
    const handleMouseMove = (event) => {
      targetMouse.x = event.clientX / window.innerWidth;
      targetMouse.y = 1.0 - event.clientY / window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      time = clock.getElapsedTime();

      // Smooth interpolation for mouse movement
      smoothMouse.x += (targetMouse.x - smoothMouse.x) * 0.08;
      smoothMouse.y += (targetMouse.y - smoothMouse.y) * 0.08;

      // Professional water drop physics simulation
      fallingWaterDrops.forEach((drop, index) => {
        const userData = drop.userData;

        // Update shader uniforms with enhanced parameters
        drop.material.uniforms.time.value = time;
        drop.material.uniforms.velocity.value.copy(userData.velocity);
        drop.material.uniforms.dropSize.value = userData.scale;
        drop.material.uniforms.surfaceTension.value = userData.surfaceTension;

        // Advanced physics simulation
        userData.lifeTime += 0.016;

        // Air resistance calculation
        const velocityMagnitude = userData.velocity.length();
        const dragForce =
          userData.dragCoefficient * velocityMagnitude * velocityMagnitude;
        const dragDirection = userData.velocity
          .clone()
          .normalize()
          .multiplyScalar(-1);

        // Apply forces (gravity + air resistance)
        const totalForce = userData.acceleration.clone();
        if (velocityMagnitude > 0) {
          totalForce.add(
            dragDirection.multiplyScalar(dragForce / userData.mass)
          );
        }

        // Terminal velocity limiting
        if (velocityMagnitude > userData.terminalVelocity) {
          userData.velocity
            .normalize()
            .multiplyScalar(userData.terminalVelocity);
        } else {
          userData.velocity.add(totalForce.clone().multiplyScalar(0.016));
        }

        // Wind effects and atmospheric turbulence
        const windInfluence = new THREE.Vector3(
          Math.sin(time * 0.5 + userData.phase) * 0.1,
          0,
          Math.cos(time * 0.3 + userData.phase * 1.2) * 0.05
        );
        userData.velocity.add(windInfluence);

        // Update position based on velocity
        drop.position.add(userData.velocity.clone().multiplyScalar(0.016));

        // Advanced swaying motion with turbulence
        const swayX =
          Math.sin(time * userData.swaySpeed + userData.phase) *
          userData.swayAmplitude;
        const swayZ =
          Math.cos(time * userData.swaySpeed * 0.7 + userData.phase * 1.5) *
          userData.swayAmplitude *
          0.5;

        drop.position.x = userData.originalX + swayX;
        drop.position.z += swayZ * 0.01;

        // Realistic rotation with physics
        drop.rotation.x +=
          userData.rotationSpeed.x * (1 + velocityMagnitude * 0.1);
        drop.rotation.y +=
          userData.rotationSpeed.y * (1 + velocityMagnitude * 0.05);
        drop.rotation.z +=
          userData.rotationSpeed.z * (1 + velocityMagnitude * 0.08);

        // Ground collision detection with splash intensity
        if (drop.position.y < -35) {
          const impactVelocity = Math.abs(userData.velocity.y);
          const splashIntensity = Math.min(impactVelocity / 8.0, 2.0);

          // Create multi-layered effects
          createSplash(drop.position, splashIntensity);

          // Multiple ripple effects for realistic impact
          const ripple = createRippleEffect(drop.position, splashIntensity);
          rippleEffects.push(ripple);

          if (splashIntensity > 0.8) {
            setTimeout(() => {
              const ripple2 = createRippleEffect(
                drop.position,
                splashIntensity * 0.6
              );
              rippleEffects.push(ripple2);
            }, 100);
          }
          if (splashIntensity > 1.2) {
            setTimeout(() => {
              const ripple3 = createRippleEffect(
                drop.position,
                splashIntensity * 0.3
              );
              rippleEffects.push(ripple3);
            }, 250);
          }

          // Reset drop with new characteristics
          drop.position.y = userData.resetY + (Math.random() - 0.5) * 15;
          drop.position.x = userData.originalX + (Math.random() - 0.5) * 25;
          drop.position.z = (Math.random() - 0.5) * 60;

          // Reset physics
          userData.velocity.set(
            (Math.random() - 0.5) * 0.3,
            0,
            (Math.random() - 0.5) * 0.2
          );
          userData.lifeTime = 0;
          userData.swayAmplitude = 0.3 + Math.random() * 0.7;
          userData.swaySpeed = 0.8 + Math.random() * 0.4;
          userData.phase = Math.random() * Math.PI * 2;
        }

        // Lifecycle management
        if (userData.lifeTime > userData.maxLifeTime) {
          // Respawn drop
          drop.position.y = userData.resetY + Math.random() * 20;
          drop.position.x = userData.originalX + (Math.random() - 0.5) * 30;
          drop.position.z = (Math.random() - 0.5) * 50;
          userData.lifeTime = 0;
          userData.velocity.set(
            (Math.random() - 0.5) * 0.4,
            0,
            (Math.random() - 0.5) * 0.3
          );
        }

        // Dynamic scale based on velocity (surface tension effects)
        const velocityScale = 1.0 + velocityMagnitude * 0.02;
        const tensionScale =
          1.0 +
          Math.sin(time * 20.0 + userData.phase) *
            userData.surfaceTension *
            0.05;
        drop.scale.setScalar(userData.scale * velocityScale * tensionScale);
      });

      // Professional splash particle physics
      const positions = splashParticles.geometry.attributes.position.array;
      const velocities = splashParticles.geometry.attributes.velocity.array;
      const lifetimes = splashParticles.geometry.attributes.lifetime.array;
      const masses = splashParticles.geometry.attributes.mass.array;
      const rotations = splashParticles.geometry.attributes.rotation.array;

      for (let i = 0; i < lifetimes.length; i++) {
        if (lifetimes[i] > 0) {
          const i3 = i * 3;

          // Advanced physics simulation
          const mass = masses[i];
          const dragCoefficient = 0.6;

          // Current velocity magnitude for drag calculation
          const vx = velocities[i3];
          const vy = velocities[i3 + 1];
          const vz = velocities[i3 + 2];
          const velocityMagnitude = Math.sqrt(vx * vx + vy * vy + vz * vz);

          // Air resistance
          if (velocityMagnitude > 0) {
            const dragForce =
              dragCoefficient * velocityMagnitude * velocityMagnitude;
            const dragScale = dragForce / (mass * velocityMagnitude);

            velocities[i3] -= vx * dragScale * 0.016;
            velocities[i3 + 1] -= vy * dragScale * 0.016;
            velocities[i3 + 2] -= vz * dragScale * 0.016;
          }

          // Enhanced gravity with mass influence
          velocities[i3 + 1] -= 9.8 * mass * 0.016;

          // Wind turbulence
          const turbulence = 0.5;
          velocities[i3] += (Math.random() - 0.5) * turbulence * 0.016;
          velocities[i3 + 2] += (Math.random() - 0.5) * turbulence * 0.016;

          // Update positions with enhanced integration
          positions[i3] += velocities[i3] * 0.016;
          positions[i3 + 1] += velocities[i3 + 1] * 0.016;
          positions[i3 + 2] += velocities[i3 + 2] * 0.016;

          // Ground collision with bouncing
          if (positions[i3 + 1] < -35) {
            positions[i3 + 1] = -35;
            velocities[i3 + 1] *= -0.3; // Reduced bounce
            velocities[i3] *= 0.7; // Friction
            velocities[i3 + 2] *= 0.7;
          }

          // Update rotation
          rotations[i] += velocityMagnitude * 0.1 * 0.016;

          // Lifetime decay with atmospheric effects
          const altitudeEffect = Math.max(0.5, (positions[i3 + 1] + 50) / 100);
          lifetimes[i] -= 0.016 * altitudeEffect;

          if (lifetimes[i] <= 0) {
            positions[i3 + 1] = -100; // Move off-screen
            velocities[i3] = 0;
            velocities[i3 + 1] = 0;
            velocities[i3 + 2] = 0;
          }
        }
      }

      splashParticles.geometry.attributes.position.needsUpdate = true;
      splashParticles.geometry.attributes.velocity.needsUpdate = true;
      splashParticles.geometry.attributes.lifetime.needsUpdate = true;
      splashParticles.geometry.attributes.mass.needsUpdate = true;
      splashParticles.geometry.attributes.rotation.needsUpdate = true;
      splashParticles.material.uniforms.time.value = time;

      // Update ripple effects
      rippleEffects.forEach((ripple, index) => {
        ripple.material.uniforms.time.value = time;

        // Remove ripple after duration
        if (time - ripple.userData.startTime > ripple.userData.duration) {
          scene.remove(ripple);
          ripple.geometry.dispose();
          ripple.material.dispose();
          rippleEffects.splice(index, 1);
        }
      });

      // Professional camera work with cinematic movement
      const cameraParallaxX = (smoothMouse.x - 0.5) * 3;
      const cameraParallaxY = (smoothMouse.y - 0.5) * 2;

      // Cinematic camera breathing effect
      const breathingX = Math.sin(time * 0.3) * 0.2;
      const breathingY = Math.cos(time * 0.4) * 0.15;
      const breathingZ = Math.sin(time * 0.2) * 0.5;

      // Dynamic focus pull based on scene activity
      const focusDistance = 50 + Math.sin(time * 0.1) * 5;

      // Enhanced camera positioning with smooth transitions
      camera.position.x = cameraParallaxX + breathingX;
      camera.position.y = cameraParallaxY + breathingY;
      camera.position.z = focusDistance + breathingZ;

      // Professional look-at with slight anticipation
      const lookAtX = cameraParallaxX * 0.15 + Math.sin(time * 0.2) * 0.5;
      const lookAtY = cameraParallaxY * 0.1 + Math.cos(time * 0.15) * 0.3;
      const lookAtZ = Math.sin(time * 0.1) * 2;

      camera.lookAt(lookAtX, lookAtY, lookAtZ);

      // Dynamic field of view for cinematic effect
      camera.fov = 75 + Math.sin(time * 0.05) * 2;
      camera.updateProjectionMatrix();

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

export default ParallaxBarrierBackground;
