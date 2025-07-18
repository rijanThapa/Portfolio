import React, { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import * as THREE from "three";

const Skill = () => {
  const skills = [
    {
      name: "React",
      category: "Frontend",
      level: 95,
      icon: "⚛️",
      color: "#61DAFB",
    },
    {
      name: "Next.js",
      category: "Frontend",
      level: 90,
      icon: "▲",
      color: "#000000",
    },
    {
      name: "JavaScript",
      category: "Language",
      level: 95,
      icon: "🟨",
      color: "#F7DF1E",
    },
    {
      name: "TypeScript",
      category: "Language",
      level: 88,
      icon: "🔷",
      color: "#3178C6",
    },
    {
      name: "HTML",
      category: "Frontend",
      level: 98,
      icon: "🌐",
      color: "#E34F26",
    },
    {
      name: "CSS",
      category: "Frontend",
      level: 93,
      icon: "🎨",
      color: "#1572B6",
    },
    {
      name: "Tailwind CSS",
      category: "Frontend",
      level: 92,
      icon: "🎨",
      color: "#06B6D4",
    },
    {
      name: "Material UI",
      category: "Frontend",
      level: 85,
      icon: "🔵",
      color: "#0081CB",
    },
    {
      name: "Ant Design",
      category: "Frontend",
      level: 80,
      icon: "🐜",
      color: "#1890FF",
    },
    {
      name: "Redux",
      category: "State Management",
      level: 87,
      icon: "🔄",
      color: "#764ABC",
    },
    {
      name: "React Native",
      category: "Mobile",
      level: 82,
      icon: "📱",
      color: "#61DAFB",
    },
    {
      name: "Zustand",
      category: "State Management",
      level: 90,
      icon: "🐻",
      color: "#FF6B6B",
    },
    {
      name: "React Query",
      category: "Data Fetching",
      level: 88,
      icon: "🔍",
      color: "#FF4154",
    },
    {
      name: "Node.js",
      category: "Backend",
      level: 85,
      icon: "🟢",
      color: "#339933",
    },
    {
      name: "Express",
      category: "Backend",
      level: 88,
      icon: "🚀",
      color: "#000000",
    },
    {
      name: "NestJS",
      category: "Backend",
      level: 78,
      icon: "🔴",
      color: "#E0234E",
    },
    {
      name: "Ruby on Rails",
      category: "Backend",
      level: 75,
      icon: "💎",
      color: "#CC0000",
    },
  ];

  const containerRef = useRef(null);
  const threeRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.2 });
  const [, setHoveredSkill] = useState(null);

  // Three.js background setup
  useEffect(() => {
    if (!threeRef.current) return;

    const currentMount = threeRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    currentMount.appendChild(renderer.domElement);

    // Create floating geometric shapes
    const shapes = [];
    const geometries = [
      new THREE.TetrahedronGeometry(1),
      new THREE.OctahedronGeometry(1),
      new THREE.IcosahedronGeometry(1),
      new THREE.DodecahedronGeometry(1),
    ];

    for (let i = 0; i < 20; i++) {
      const geometry =
        geometries[Math.floor(Math.random() * geometries.length)];
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(
          Math.random() * 0.2 + 0.5, // Blue-purple hue
          0.7,
          0.5
        ),
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      shapes.push(mesh);
      scene.add(mesh);
    }

    // Create particle system
    const particleCount = 500;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

      const color = new THREE.Color();
      color.setHSL(Math.random() * 0.3 + 0.5, 0.8, 0.6);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particles.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    camera.position.z = 15;

    // Animation loop
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const time = Date.now() * 0.001;

      // Rotate shapes
      shapes.forEach((shape, index) => {
        shape.rotation.x += 0.005 * (index % 2 === 0 ? 1 : -1);
        shape.rotation.y += 0.008 * (index % 3 === 0 ? 1 : -1);
        shape.position.y += Math.sin(time + index) * 0.002;
      });

      // Rotate particle system
      particleSystem.rotation.y += 0.001;
      particleSystem.rotation.x += 0.0005;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      window.removeEventListener("resize", handleResize);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const categories = [...new Set(skills.map((skill) => skill.category))];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.8,
      rotateY: -20,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative bg-gray-950 py-20 px-6 overflow-hidden">
      {/* Three.js Background */}
      <div
        ref={threeRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-transparent to-blue-900/30"
        style={{ zIndex: 2 }}
      />

      <div
        className="relative container mx-auto max-w-7xl"
        style={{ zIndex: 3 }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Technical
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 ml-4">
              Expertise
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto mb-6"></div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Crafting digital experiences with cutting-edge technologies and
            modern development practices
          </p>
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          ref={containerRef}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
              onHoverStart={() => setHoveredSkill(index)}
              onHoverEnd={() => setHoveredSkill(null)}
            >
              <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 h-full shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:scale-105 hover:border-blue-400/50">
                {/* Skill Icon */}
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {skill.icon}
                </div>

                {/* Skill Name */}
                <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-blue-400 transition-colors duration-300">
                  {skill.name}
                </h3>

                {/* Category */}
                <p className="text-gray-400 text-sm mb-4 font-medium">
                  {skill.category}
                </p>

                {/* Skill Level Bar */}
                <div className="relative">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500">Proficiency</span>
                    <span className="text-xs text-blue-400 font-semibold">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      initial={{ width: "0%" }}
                      animate={
                        isInView
                          ? { width: `${skill.level}%` }
                          : { width: "0%" }
                      }
                      transition={{ duration: 1.5, delay: index * 0.1 }}
                    />
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none" />

                {/* Corner Decoration */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {skills.length}
              </div>
              <div className="text-gray-400 text-sm">Technologies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {categories.length}
              </div>
              <div className="text-gray-400 text-sm">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">5+</div>
              <div className="text-gray-400 text-sm">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">50+</div>
              <div className="text-gray-400 text-sm">Projects Completed</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skill;
