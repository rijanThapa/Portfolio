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

    // Professional Liquid Drop Shader Material
    const liquidMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        mouse: { value: new THREE.Vector2(0.5, 0.5) },
        colorA: { value: new THREE.Color(0x1e40af) }, // Deep Blue
        colorB: { value: new THREE.Color(0x7c3aed) }, // Rich Purple
        colorC: { value: new THREE.Color(0x0891b2) }, // Professional Cyan
        amplitude: { value: 1.2 },
        frequency: { value: 1.2 },
        opacity: { value: 0.4 },
      },
      vertexShader: `
        uniform float time;
        uniform float amplitude;
        uniform float frequency;
        uniform vec2 mouse;
        
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        varying float vDisplacement;
        
        // Simplex noise function
        vec3 mod289(vec3 x) {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }
        
        vec4 mod289(vec4 x) {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }
        
        vec4 permute(vec4 x) {
          return mod289(((x*34.0)+1.0)*x);
        }
        
        vec4 taylorInvSqrt(vec4 r) {
          return 1.79284291400159 - 0.85373472095314 * r;
        }
        
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
          
          vec4 s0 = floor(b0) * 2.0 + 1.0;
          vec4 s1 = floor(b1) * 2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          
          vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
          
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
          vUv = uv;
          vPosition = position;
          
          // Create smooth liquid drop deformation
          float noise1 = snoise(position * frequency + time * 0.3);
          float noise2 = snoise(position * frequency * 1.5 + time * 0.2) * 0.6;
          float noise3 = snoise(position * frequency * 2.5 + time * 0.4) * 0.3;
          
          // Combine for organic liquid movement
          float displacement = (noise1 + noise2 + noise3) * amplitude * 0.5;
          
          // Add enhanced mouse interaction for professional feel
          vec3 mouseInfluence = vec3(mouse.x - 0.5, mouse.y - 0.5, 0.0) * 3.0;
          float mouseDistance = length(position.xy - mouseInfluence.xy);
          float mouseEffect = smoothstep(12.0, 0.0, mouseDistance) * 1.2;
          displacement += mouseEffect;
          
          // Create dynamic mouse-responsive deformation
          float mousePull = smoothstep(8.0, 0.0, mouseDistance) * 0.8;
          vec3 mouseDirection = normalize(mouseInfluence - position);
          displacement += mousePull * dot(normal, mouseDirection);
          
          // Create drop-like shape deformation
          float dropEffect = 1.0 + sin(position.y * 2.0 + time * 0.5) * 0.1;
          displacement *= dropEffect;
          
          // Apply displacement along normal for smooth liquid surface
          vec3 newPosition = position + normal * displacement;
          
          vDisplacement = displacement;
          vNormal = normal;
          
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
        
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        varying float vDisplacement;
        
        void main() {
          // Professional gradient color mixing with mouse influence
          float colorMix1 = sin(vPosition.x * 0.3 + time * 0.4) * 0.5 + 0.5;
          float colorMix2 = sin(vPosition.y * 0.2 + time * 0.3) * 0.5 + 0.5;
          float colorMix3 = sin(vDisplacement * 1.5 + time * 0.5) * 0.5 + 0.5;
          
          // Add mouse influence to color mixing
          vec2 mousePos = mouse * 2.0 - 1.0;
          float mouseDistance = length(vPosition.xy - mousePos);
          float mouseColorEffect = smoothstep(8.0, 0.0, mouseDistance);
          
          // Smooth color transitions for liquid drops with mouse interaction
          vec3 color = mix(colorA, colorB, smoothstep(0.0, 1.0, colorMix1 + mouseColorEffect * 0.3));
          color = mix(color, colorC, smoothstep(0.0, 1.0, colorMix2 * colorMix3 + mouseColorEffect * 0.2));
          
          // Enhanced fresnel for glass-like appearance with mouse highlighting
          vec3 viewDirection = normalize(cameraPosition - vPosition);
          float fresnel = pow(1.0 - dot(normalize(vNormal), viewDirection), 3.0);
          color += vec3(0.2, 0.4, 0.8) * fresnel * (0.5 + mouseColorEffect * 0.3);
          
          // Professional lighting effect with mouse responsiveness
          float brightness = 0.8 + vDisplacement * 0.3 + mouseColorEffect * 0.2;
          color *= brightness;
          
          // Sophisticated alpha with edge enhancement and mouse interaction
          float alpha = opacity * (0.6 + fresnel * 0.4 + mouseColorEffect * 0.1);
          alpha *= smoothstep(0.0, 1.0, 1.0 - length(vUv - 0.5) * 2.0);
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    // Create professional liquid drops with varying sizes
    const createLiquidDrop = (scale, position, opacity = 1.0) => {
      const geometry = new THREE.SphereGeometry(scale, 32, 32);
      const material = liquidMaterial.clone();
      material.uniforms.opacity.value = opacity;
      material.uniforms.amplitude.value = 1.2 * (scale / 3.0); // Scale amplitude with size
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(position);
      return mesh;
    };

    // Create elegant liquid drop arrangement covering the whole screen
    const drops = [
      // Large background drops
      createLiquidDrop(4.5, new THREE.Vector3(0, 0, -8), 0.3),
      createLiquidDrop(4.0, new THREE.Vector3(-15, 8, -12), 0.25),
      createLiquidDrop(4.2, new THREE.Vector3(12, -6, -10), 0.28),
      createLiquidDrop(3.8, new THREE.Vector3(-8, -10, -15), 0.22),
      createLiquidDrop(4.1, new THREE.Vector3(18, 5, -14), 0.26),
      
      // Medium central drops
      createLiquidDrop(3.2, new THREE.Vector3(-5, 3, -5), 0.4),
      createLiquidDrop(3.0, new THREE.Vector3(8, -2, -6), 0.38),
      createLiquidDrop(2.8, new THREE.Vector3(-12, 0, -8), 0.35),
      createLiquidDrop(3.1, new THREE.Vector3(5, 8, -7), 0.37),
      createLiquidDrop(2.9, new THREE.Vector3(-2, -7, -9), 0.36),
      
      // Screen edge drops for full coverage
      createLiquidDrop(3.5, new THREE.Vector3(-20, 12, -18), 0.2),
      createLiquidDrop(3.3, new THREE.Vector3(22, -8, -16), 0.22),
      createLiquidDrop(3.7, new THREE.Vector3(-18, -12, -20), 0.18),
      createLiquidDrop(3.4, new THREE.Vector3(20, 10, -17), 0.21),
      
      // Corner drops
      createLiquidDrop(2.5, new THREE.Vector3(-25, 15, -25), 0.15),
      createLiquidDrop(2.7, new THREE.Vector3(25, -15, -22), 0.17),
      createLiquidDrop(2.4, new THREE.Vector3(-22, -18, -28), 0.14),
      createLiquidDrop(2.6, new THREE.Vector3(24, 18, -24), 0.16),
      
      // Additional depth layers
      createLiquidDrop(2.2, new THREE.Vector3(-10, 6, -12), 0.32),
      createLiquidDrop(2.4, new THREE.Vector3(6, -4, -11), 0.34),
      createLiquidDrop(2.1, new THREE.Vector3(-6, -8, -13), 0.3),
      createLiquidDrop(2.3, new THREE.Vector3(11, 4, -10), 0.33),
      
      // Foreground accent drops
      createLiquidDrop(1.8, new THREE.Vector3(-3, 5, -3), 0.5),
      createLiquidDrop(1.9, new THREE.Vector3(4, -3, -2), 0.52),
      createLiquidDrop(1.7, new THREE.Vector3(-7, -1, -4), 0.48),
      createLiquidDrop(1.6, new THREE.Vector3(2, 7, -3), 0.46),
      
      // Small ambient drops
      createLiquidDrop(1.2, new THREE.Vector3(-15, 4, -18), 0.25),
      createLiquidDrop(1.4, new THREE.Vector3(14, -9, -19), 0.27),
      createLiquidDrop(1.3, new THREE.Vector3(-9, -15, -21), 0.23),
      createLiquidDrop(1.1, new THREE.Vector3(16, 12, -20), 0.24),
      createLiquidDrop(1.5, new THREE.Vector3(-13, 9, -16), 0.26),
      createLiquidDrop(1.0, new THREE.Vector3(10, -12, -23), 0.22),
    ];

    drops.forEach(drop => scene.add(drop));

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

        // Professional color palette
        const colorChoice = Math.random();
        if (colorChoice < 0.4) {
          colors[i3] = 0.12; // Deep Blue
          colors[i3 + 1] = 0.25;
          colors[i3 + 2] = 0.69;
        } else if (colorChoice < 0.7) {
          colors[i3] = 0.49; // Rich Purple
          colors[i3 + 1] = 0.23;
          colors[i3 + 2] = 0.93;
        } else {
          colors[i3] = 0.03; // Professional Cyan
          colors[i3 + 1] = 0.57;
          colors[i3 + 2] = 0.70;
        }

        sizes[i] = Math.random() * 1.5 + 0.3;
      }

      particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
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

    // Mouse interaction with smooth movement
    const handleMouseMove = (event) => {
      targetMouse.x = event.clientX / window.innerWidth;
      targetMouse.y = 1.0 - (event.clientY / window.innerHeight);
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

      // Update drop materials and positions
      drops.forEach((drop, index) => {
        drop.material.uniforms.time.value = time;
        drop.material.uniforms.mouse.value.copy(smoothMouse);
        
        // Mouse-responsive movement with magnetic effect
        const dropX = drop.position.x;
        const dropY = drop.position.y;
        const distanceFromMouse = Math.sqrt(
          Math.pow(dropX - mouseInfluenceX, 2) + 
          Math.pow(dropY - mouseInfluenceY, 2)
        );
        const mouseEffect = Math.max(0, 1 - distanceFromMouse / 20);
        
        // Magnetic attraction to mouse
        const attractionForce = mouseEffect * 0.02;
        const directionToMouse = {
          x: (mouseInfluenceX - dropX) * attractionForce,
          y: (mouseInfluenceY - dropY) * attractionForce
        };
        
        // Apply mouse influence to drop positions with smooth animation
        drop.position.x += Math.sin(mouseInfluenceX * 0.1 + index) * mouseEffect * 0.3 + directionToMouse.x;
        drop.position.y += Math.cos(mouseInfluenceY * 0.1 + index) * mouseEffect * 0.2 + directionToMouse.y;
        
        // Enhanced rotation with mouse influence
        drop.rotation.x += 0.001 * (index % 2 === 0 ? 1 : -1) + mouseEffect * 0.003;
        drop.rotation.y += 0.0015 * (index % 3 === 0 ? 1 : -1) + mouseEffect * 0.004;
        drop.rotation.z += 0.0005 * (index % 4 === 0 ? 1 : -1) + mouseEffect * 0.002;
        
        // Professional floating motion with enhanced mouse influence
        drop.position.y += Math.sin(time * 0.3 + index * 1.5) * 0.008 + mouseEffect * 0.015;
        drop.position.x += Math.cos(time * 0.2 + index * 1.2) * 0.005 + mouseEffect * 0.012;
        
        // Scale effect based on mouse proximity
        const baseScale = 1.0 + mouseEffect * 0.2;
        drop.scale.setScalar(baseScale);
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
        positions[i] += Math.sin(mouseInfluenceX * 0.05 + i) * mouseEffect * 0.1;
        positions[i + 1] += Math.cos(mouseInfluenceY * 0.05 + i) * mouseEffect * 0.08;
      }
      floatingParticles.geometry.attributes.position.needsUpdate = true;

      // Mouse-responsive camera movement
      camera.position.x = Math.sin(time * 0.05) * 2 + mouseInfluenceX * 0.3;
      camera.position.y = Math.cos(time * 0.04) * 1.5 + mouseInfluenceY * 0.2;
      camera.lookAt(mouseInfluenceX * 0.1, mouseInfluenceY * 0.1, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!camera || !renderer) return;

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      
      // Update material resolution
      drops.forEach(drop => {
        drop.material.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
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
