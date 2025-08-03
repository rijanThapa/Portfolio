import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const StereoProgressionBackground = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationIdRef = useRef(null);
  const stereoEffectRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0a0a, 10, 150);
    sceneRef.current = scene;

    // Camera setup for stereo effect
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
    renderer.toneMappingExposure = 1.0;
    rendererRef.current = renderer;

    currentMount.appendChild(renderer.domElement);

    // Stereo Effect Setup
    class StereoEffect {
      constructor(renderer) {
        this.renderer = renderer;
        this.eyeSeparation = 0.64;
        this.focalLength = 15;
        this.aspect = 1;

        // Create render targets for left and right eye
        this.renderTargetL = new THREE.WebGLRenderTarget(
          window.innerWidth / 2,
          window.innerHeight
        );
        this.renderTargetR = new THREE.WebGLRenderTarget(
          window.innerWidth / 2,
          window.innerHeight
        );

        // Create cameras for stereo effect
        this.cameraL = new THREE.PerspectiveCamera();
        this.cameraR = new THREE.PerspectiveCamera();

        this.update(camera);
      }

      update(camera) {
        const fov = camera.fov;
        const aspect = camera.aspect;
        const near = camera.near;
        const far = camera.far;

        const eyeSeparation = this.eyeSeparation / 2;

        // Left camera
        this.cameraL.fov = fov;
        this.cameraL.aspect = aspect;
        this.cameraL.near = near;
        this.cameraL.far = far;
        this.cameraL.position.copy(camera.position);
        this.cameraL.quaternion.copy(camera.quaternion);
        this.cameraL.translateX(-eyeSeparation);

        // Right camera
        this.cameraR.fov = fov;
        this.cameraR.aspect = aspect;
        this.cameraR.near = near;
        this.cameraR.far = far;
        this.cameraR.position.copy(camera.position);
        this.cameraR.quaternion.copy(camera.quaternion);
        this.cameraR.translateX(eyeSeparation);

        this.cameraL.updateProjectionMatrix();
        this.cameraR.updateProjectionMatrix();
      }

      render(scene, camera) {
        this.update(camera);

        const size = this.renderer.getSize(new THREE.Vector2());
        const halfWidth = size.width / 2;

        // Render left eye
        this.renderer.setScissorTest(true);
        this.renderer.setScissor(0, 0, halfWidth, size.height);
        this.renderer.setViewport(0, 0, halfWidth, size.height);
        this.renderer.render(scene, this.cameraL);

        // Render right eye
        this.renderer.setScissor(halfWidth, 0, halfWidth, size.height);
        this.renderer.setViewport(halfWidth, 0, halfWidth, size.height);
        this.renderer.render(scene, this.cameraR);

        this.renderer.setScissorTest(false);
      }

      setSize(width, height) {
        this.renderer.setSize(width, height);

        const halfWidth = width / 2;
        this.renderTargetL.setSize(halfWidth, height);
        this.renderTargetR.setSize(halfWidth, height);
      }
    }

    const stereoEffect = new StereoEffect(renderer);
    stereoEffectRef.current = stereoEffect;

    // Progressive Shader Material
    const progressionMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        mouse: { value: new THREE.Vector2(0.5, 0.5) },
        progress: { value: 0.0 },
        depthLayer: { value: 1.0 },
        colorStart: { value: new THREE.Color(0x0f172a) }, // Slate-900
        colorMid: { value: new THREE.Color(0x1e3a8a) }, // Blue-800
        colorEnd: { value: new THREE.Color(0x3b82f6) }, // Blue-500
        colorAccent: { value: new THREE.Color(0x60a5fa) }, // Blue-400
        stereoIntensity: { value: 1.0 },
      },
      vertexShader: `
        uniform float time;
        uniform vec2 mouse;
        uniform float progress;
        uniform float depthLayer;
        uniform float stereoIntensity;
        
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        varying float vProgress;
        varying float vDepth;
        varying vec3 vWorldPosition;
        
        // Progressive wave function
        float progressiveWave(vec3 p, float prog) {
          float wave1 = sin(p.x * 2.0 + time + prog * 6.28318) * 0.5;
          float wave2 = sin(p.y * 1.5 + time * 0.7 + prog * 4.0) * 0.3;
          float wave3 = sin(p.z * 1.8 + time * 0.5 + prog * 5.0) * 0.2;
          return wave1 + wave2 + wave3;
        }
        
        void main() {
          vUv = uv;
          vPosition = position;
          vNormal = normal;
          
          // Calculate progressive transformation
          float localProgress = progress + length(position) * 0.01;
          vProgress = localProgress;
          
          // Stereo depth displacement
          float stereoDisplacement = sin(position.x * 3.0 + time) * 
                                   stereoIntensity * depthLayer * 0.5;
          
          // Progressive wave displacement
          float waveDisplacement = progressiveWave(position, localProgress) * 
                                 (1.0 + localProgress) * 0.3;
          
          // Mouse interaction with stereo effect
          vec2 mouseInfluence = (mouse - 0.5) * 2.0;
          float mouseEffect = length(position.xy - mouseInfluence * 10.0);
          mouseEffect = 1.0 - smoothstep(0.0, 8.0, mouseEffect);
          
          // Combine all displacements
          vec3 displacement = normal * (waveDisplacement + stereoDisplacement);
          displacement += vec3(mouseInfluence * mouseEffect * depthLayer, 0.0);
          
          vec3 newPosition = position + displacement;
          
          vDepth = -newPosition.z;
          vWorldPosition = (modelMatrix * vec4(newPosition, 1.0)).xyz;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 colorStart;
        uniform vec3 colorMid;
        uniform vec3 colorEnd;
        uniform vec3 colorAccent;
        uniform vec2 mouse;
        uniform float progress;
        uniform float depthLayer;
        
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        varying float vProgress;
        varying float vDepth;
        varying vec3 vWorldPosition;
        
        void main() {
          vec3 normal = normalize(vNormal);
          vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
          
          // Progressive color mixing
          float colorProgress = vProgress * 0.5 + 0.5;
          vec3 baseColor = mix(colorStart, colorMid, colorProgress);
          baseColor = mix(baseColor, colorEnd, smoothstep(0.3, 0.8, colorProgress));
          
          // Fresnel effect for stereo depth perception
          float fresnel = pow(1.0 - max(dot(normal, viewDirection), 0.0), 2.0);
          baseColor = mix(baseColor, colorAccent, fresnel * 0.6);
          
          // Progressive pattern overlay
          float pattern1 = sin(vPosition.x * 8.0 + time + vProgress * 10.0) * 0.5 + 0.5;
          float pattern2 = sin(vPosition.y * 6.0 + time * 0.8 + vProgress * 8.0) * 0.5 + 0.5;
          float combinedPattern = pattern1 * pattern2;
          
          // Stereo depth highlighting
          float depthGlow = smoothstep(5.0, 15.0, vDepth) * 0.4;
          baseColor += colorAccent * depthGlow;
          
          // Progressive intensity based on progress
          float intensity = 0.7 + vProgress * 0.5;
          baseColor *= intensity;
          
          // Add progressive scanning lines effect
          float scanLine = sin(vPosition.y * 50.0 + time * 20.0 + vProgress * 30.0);
          scanLine = smoothstep(0.8, 1.0, scanLine) * 0.2;
          baseColor += colorAccent * scanLine;
          
          // Mouse interaction glow
          vec2 mousePos = mouse * 2.0 - 1.0;
          float mouseDistance = length(vPosition.xy - mousePos * 10.0);
          float mouseGlow = smoothstep(6.0, 0.0, mouseDistance) * 0.4;
          baseColor += colorEnd * mouseGlow;
          
          // Final alpha with depth-based transparency
          float alpha = 0.6 + fresnel * 0.3;
          alpha *= (0.5 + vProgress * 0.3);
          alpha *= smoothstep(0.0, 0.2, length(vUv - 0.5));
          
          gl_FragColor = vec4(baseColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // Create progression geometry layers
    const createProgressionLayer = (type, depth, scale, progressValue) => {
      let geometry;

      switch (type) {
        case "sphere":
          geometry = new THREE.SphereGeometry(5 * scale, 32, 24);
          break;
        case "torus":
          geometry = new THREE.TorusGeometry(6 * scale, 2 * scale, 16, 32);
          break;
        case "plane":
          geometry = new THREE.PlaneGeometry(12 * scale, 8 * scale, 24, 16);
          break;
        case "cylinder":
          geometry = new THREE.CylinderGeometry(
            4 * scale,
            4 * scale,
            10 * scale,
            24,
            8,
            true
          );
          break;
        case "icosahedron":
          geometry = new THREE.IcosahedronGeometry(5 * scale, 2);
          break;
        default:
          geometry = new THREE.SphereGeometry(5 * scale, 24, 16);
      }

      const material = progressionMaterial.clone();
      material.uniforms.depthLayer.value = Math.abs(depth) / 20.0;
      material.uniforms.progress.value = progressValue;

      // Vary colors based on progression
      const hue = progressValue * 0.3;
      material.uniforms.colorStart.value.setHSL(0.65 + hue * 0.1, 0.9, 0.2);
      material.uniforms.colorMid.value.setHSL(0.6 + hue * 0.1, 0.8, 0.4);
      material.uniforms.colorEnd.value.setHSL(0.58 + hue * 0.1, 0.7, 0.6);
      material.uniforms.colorAccent.value.setHSL(0.55 + hue * 0.1, 0.6, 0.8);

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.z = depth;

      return mesh;
    };

    // Create multiple progression layers
    const progressionLayers = [];
    const layerConfigs = [
      // Background progression layers
      { type: "sphere", depth: -40, scale: 1.5, progress: 0.0 },
      { type: "torus", depth: -35, scale: 1.2, progress: 0.1 },
      { type: "icosahedron", depth: -30, scale: 1.0, progress: 0.2 },
      { type: "plane", depth: -25, scale: 1.3, progress: 0.3 },

      // Middle progression layers
      { type: "cylinder", depth: -20, scale: 0.9, progress: 0.4 },
      { type: "sphere", depth: -15, scale: 0.8, progress: 0.5 },
      { type: "torus", depth: -10, scale: 0.7, progress: 0.6 },

      // Foreground progression layers
      { type: "icosahedron", depth: -5, scale: 0.6, progress: 0.7 },
      { type: "plane", depth: -2, scale: 0.5, progress: 0.8 },
      { type: "sphere", depth: 2, scale: 0.4, progress: 0.9 },
    ];

    layerConfigs.forEach((config, index) => {
      const layer = createProgressionLayer(
        config.type,
        config.depth,
        config.scale,
        config.progress
      );

      // Random positioning for varied composition
      layer.position.x = (Math.random() - 0.5) * 20;
      layer.position.y = (Math.random() - 0.5) * 15;

      // Store animation data
      layer.userData = {
        originalPosition: layer.position.clone(),
        animationSpeed: 0.3 + Math.random() * 0.4,
        rotationSpeed: 0.2 + Math.random() * 0.3,
        progressValue: config.progress,
        depthLayer: Math.abs(config.depth) / 20.0,
      };

      progressionLayers.push(layer);
      scene.add(layer);
    });

    // Create stereo particle system
    const createStereoParticles = () => {
      const particleCount = 300;
      const particles = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      const progress = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // 3D distribution for stereo effect
        positions[i3] = (Math.random() - 0.5) * 100;
        positions[i3 + 1] = (Math.random() - 0.5) * 80;
        positions[i3 + 2] = (Math.random() - 0.5) * 60;

        // Progressive color scheme
        const particleProgress = Math.random();
        progress[i] = particleProgress;

        const r = 0.1 + particleProgress * 0.4;
        const g = 0.3 + particleProgress * 0.5;
        const b = 0.6 + particleProgress * 0.4;

        colors[i3] = r;
        colors[i3 + 1] = g;
        colors[i3 + 2] = b;

        sizes[i] = 1.0 + Math.random() * 2.0;
      }

      particles.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      particles.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      particles.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
      particles.setAttribute(
        "progress",
        new THREE.BufferAttribute(progress, 1)
      );

      const particleMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          mouse: { value: new THREE.Vector2(0.5, 0.5) },
          stereoIntensity: { value: 1.0 },
        },
        vertexShader: `
          uniform float time;
          uniform vec2 mouse;
          uniform float stereoIntensity;
          attribute float size;
          attribute vec3 color;
          attribute float progress;
          varying vec3 vColor;
          varying float vAlpha;
          varying float vProgress;
          
          void main() {
            vColor = color;
            vProgress = progress;
            
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            
            // Stereo displacement effect
            float stereoOffset = sin(position.x * 2.0 + time) * stereoIntensity * 2.0;
            mvPosition.x += stereoOffset;
            
            // Progressive floating motion
            mvPosition.y += sin(time * 0.5 + position.x * 0.01 + progress * 6.28318) * (2.0 + progress * 3.0);
            mvPosition.x += cos(time * 0.3 + position.y * 0.008 + progress * 4.0) * (1.5 + progress * 2.0);
            mvPosition.z += sin(time * 0.4 + position.z * 0.005 + progress * 5.0) * progress * 2.0;
            
            // Mouse interaction with stereo effect
            vec2 mouseInfluence = (mouse - 0.5) * 20.0;
            float mouseDistance = length(mvPosition.xy - mouseInfluence);
            float mouseEffect = smoothstep(10.0, 0.0, mouseDistance) * 0.5;
            mvPosition.xy += mouseInfluence * mouseEffect;
            
            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = size * (150.0 / -mvPosition.z) * (1.0 + progress);
            
            vAlpha = 1.0 - (length(mvPosition.xyz) / 80.0);
            vAlpha *= (0.3 + progress * 0.7);
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vAlpha;
          varying float vProgress;
          
          void main() {
            vec2 center = gl_PointCoord - vec2(0.5);
            float dist = length(center);
            
            if (dist > 0.5) discard;
            
            // Progressive alpha with stereo glow
            float alpha = (1.0 - dist * 2.0) * vAlpha;
            alpha *= (0.4 + vProgress * 0.6);
            
            // Add stereo glow effect
            float glow = exp(-dist * 3.0) * vProgress * 0.3;
            
            gl_FragColor = vec4(vColor + vec3(glow), alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        vertexColors: true,
      });

      return new THREE.Points(particles, particleMaterial);
    };

    const stereoParticles = createStereoParticles();
    scene.add(stereoParticles);

    // Animation variables
    let time = 0;
    const clock = new THREE.Clock();
    const targetMouse = new THREE.Vector2(0.5, 0.5);
    const smoothMouse = new THREE.Vector2(0.5, 0.5);
    let globalProgress = 0;

    // Event handlers
    const handleMouseMove = (event) => {
      targetMouse.x = event.clientX / window.innerWidth;
      targetMouse.y = 1.0 - event.clientY / window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      time = clock.getElapsedTime();

      // Update global progress (cyclical)
      globalProgress = (Math.sin(time * 0.3) + 1.0) * 0.5;

      // Smooth mouse interpolation
      smoothMouse.x += (targetMouse.x - smoothMouse.x) * 0.1;
      smoothMouse.y += (targetMouse.y - smoothMouse.y) * 0.1;

      // Update progression layers
      progressionLayers.forEach((layer, index) => {
        const material = layer.material;
        const userData = layer.userData;

        // Update shader uniforms
        material.uniforms.time.value = time;
        material.uniforms.mouse.value.copy(smoothMouse);
        material.uniforms.progress.value =
          userData.progressValue + globalProgress * 0.3;
        material.uniforms.stereoIntensity.value =
          1.0 + Math.sin(time * 0.5) * 0.3;

        // Stereo movement animation
        const stereoOffset =
          Math.sin(time * userData.animationSpeed + index) *
          userData.depthLayer *
          2;
        layer.position.x = userData.originalPosition.x + stereoOffset;

        // Progressive vertical movement
        const progressOffset =
          Math.sin(time * 0.4 + userData.progressValue * 6.28) * 3;
        layer.position.y = userData.originalPosition.y + progressOffset;

        // Rotation animation
        layer.rotation.x += userData.rotationSpeed * 0.01;
        layer.rotation.y += userData.rotationSpeed * 0.008;
        layer.rotation.z += userData.rotationSpeed * 0.005;
      });

      // Update stereo particles
      stereoParticles.material.uniforms.time.value = time;
      stereoParticles.material.uniforms.mouse.value.copy(smoothMouse);
      stereoParticles.material.uniforms.stereoIntensity.value =
        1.0 + Math.sin(time * 0.7) * 0.4;

      // Camera stereo movement
      const stereoMotion = Math.sin(time * 0.3) * 0.5;
      camera.position.x = stereoMotion + (smoothMouse.x - 0.5) * 3;
      camera.position.y = (smoothMouse.y - 0.5) * 2;
      camera.lookAt(stereoMotion * 0.1, 0, 0);

      // Render with stereo effect
      stereoEffect.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!camera || !renderer) return;

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      stereoEffect.setSize(window.innerWidth, window.innerHeight);

      // Update resolution for all materials
      progressionLayers.forEach((layer) => {
        layer.material.uniforms.resolution.value.set(
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

      if (stereoEffect) {
        stereoEffect.renderTargetL.dispose();
        stereoEffect.renderTargetR.dispose();
      }

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

export default StereoProgressionBackground;
