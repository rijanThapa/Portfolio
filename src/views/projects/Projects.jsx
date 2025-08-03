import { motion } from "framer-motion";
import { useState } from "react";
import {
  FaReact,
  FaJs,
  FaBootstrap,
  FaUsers,
  FaGraduationCap,
  FaSchool,
  FaPrint,
  FaBook,
} from "react-icons/fa";
import {
  SiNextdotjs,
  SiTypescript,
  SiAntdesign,
  SiReactquery,
  SiReduxsaga,
  SiMui,
} from "react-icons/si";
import MetallicSpheresBackground from "../../components/MetallicSpheresBackground";

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("all");

  const projects = [
    {
      id: 1,
      title: "RMS (School Management System)",
      category: "school-management",
      period: "2024/06 – present",
      description:
        "Developed a responsive and interactive UI for a School Management System using Next.js, Ant Design, React Query, and TypeScript.",
      features: [
        "Student enrollment and management",
        "Real-time attendance tracking system",
        "Grade management and reporting",
        "Real-time data updates for grade upgrades",
        "Student evaluations and activity logs",
        "Mobile-first responsive design",
      ],
      technologies: [
        { name: "Next.js", icon: SiNextdotjs, color: "text-gray-900" },
        { name: "TypeScript", icon: SiTypescript, color: "text-blue-600" },
        { name: "Ant Design", icon: SiAntdesign, color: "text-blue-500" },
        { name: "React Query", icon: SiReactquery, color: "text-red-500" },
      ],
      highlights: [
        "20% increase in user engagement",
        "Optimized performance across all devices",
        "Seamless real-time data synchronization",
        "Enhanced type safety with TypeScript",
      ],
      icon: FaGraduationCap,
      gradient: "from-blue-500 to-cyan-500",
      status: "In Progress",
    },
    {
      id: 2,
      title: "KMC (College Management System)",
      category: "college-management",
      period: "2024/06 – 2024/12",
      description:
        "Developed a responsive and interactive user interface for college management using React, JavaScript, Ant Design, and Redux Saga.",
      features: [
        "Comprehensive attendance tracking system",
        "Grade tracking and management",
        "College Wall for announcements",
        "Semester upgrade functionality",
        "Real-time data updates",
        "Complex state management",
      ],
      technologies: [
        { name: "React", icon: FaReact, color: "text-blue-500" },
        { name: "JavaScript", icon: FaJs, color: "text-yellow-500" },
        { name: "Ant Design", icon: SiAntdesign, color: "text-blue-500" },
        { name: "Redux Saga", icon: SiReduxsaga, color: "text-green-600" },
      ],
      highlights: [
        "Seamless user experience",
        "Efficient asynchronous data handling",
        "Optimized performance",
        "Complex state management with Redux Saga",
      ],
      icon: FaSchool,
      gradient: "from-purple-500 to-pink-500",
      status: "Completed",
    },
    {
      id: 3,
      title: "Tirupati Printing Press",
      category: "printing",
      period: "2024/04 – 2024/11",
      description:
        "Developed a responsive interface for a printing press management system with focus on identity card printing and request management.",
      features: [
        "Identity card management system",
        "Print request functionality for schools",
        "Student ID card printing workflow",
        "Push notification system",
        "Request tracking and management",
        "Responsive design with Bootstrap",
      ],
      technologies: [
        { name: "React", icon: FaReact, color: "text-blue-500" },
        { name: "JavaScript", icon: FaJs, color: "text-yellow-500" },
        { name: "Bootstrap", icon: FaBootstrap, color: "text-purple-600" },
      ],
      highlights: [
        "Streamlined printing workflow",
        "Real-time push notifications",
        "Efficient request management",
        "User-friendly interface",
      ],
      icon: FaPrint,
      gradient: "from-orange-500 to-red-500",
      status: "Completed",
    },
    {
      id: 4,
      title: "Nivid (School Management System)",
      category: "school-management",
      period: "2023/12 – 2024/05",
      description:
        "Developed a comprehensive school management system with multiple modules using React, JavaScript, Bootstrap, Material UI, and Zustand for state management.",
      features: [
        "Complete library management system",
        "Book inventory tracking",
        "User checkout and return system",
        "Schedule management for students and staff",
        "Visitor management system",
        "Entry and exit tracking",
      ],
      technologies: [
        { name: "React", icon: FaReact, color: "text-blue-500" },
        { name: "JavaScript", icon: FaJs, color: "text-yellow-500" },
        { name: "Bootstrap", icon: FaBootstrap, color: "text-purple-600" },
        { name: "Material UI", icon: SiMui, color: "text-blue-700" },
        { name: "Zustand", icon: FaReact, color: "text-orange-600" },
      ],
      highlights: [
        "Multi-module system architecture",
        "Efficient state management with Zustand",
        "Scalable component design",
        "Comprehensive visitor tracking",
      ],
      icon: FaBook,
      gradient: "from-green-500 to-teal-500",
      status: "Completed",
    },
  ];

  const categories = [
    { key: "all", label: "All Projects", count: projects.length },
    {
      key: "school-management",
      label: "School Management",
      count: projects.filter((p) => p.category === "school-management").length,
    },
    {
      key: "college-management",
      label: "College Management",
      count: projects.filter((p) => p.category === "college-management").length,
    },
    {
      key: "printing",
      label: "Printing Solutions",
      count: projects.filter((p) => p.category === "printing").length,
    },
  ];

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    hover: {
      y: -10,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  return (
    <section className="min-h-screen bg-black py-20 px-6 relative overflow-hidden">
      {/* Metallic Spheres Three.js Background Animation (covers whole section) */}
      <MetallicSpheresBackground />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.h2
            className="text-5xl lg:text-6xl font-bold mb-6 text-white"
            variants={itemVariants}
          >
            Featured Projects
          </motion.h2>
          <motion.p
            className="text-xl font-bold text-white max-w-3xl mx-auto mb-8"
            variants={itemVariants}
          >
            A showcase of my professional work in building scalable web
            applications, from school management systems to printing solutions,
            using modern React technologies.
          </motion.p>
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"
            variants={itemVariants}
          />
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {categories.map((category) => (
            <motion.button
              key={category.key}
              onClick={() => setActiveFilter(category.key)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeFilter === category.key
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.label} ({category.count})
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          className="grid md:grid-cols-2 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {filteredProjects.map((project) => {
            const IconComponent = project.icon;
            return (
              <motion.div
                key={project.id}
                className="group relative bg-white/0 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/10 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300"
                variants={cardVariants}
                whileHover="hover"
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      project.status === "In Progress"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                {/* Gradient Header */}
                <div
                  className={`h-32 bg-gradient-to-r ${project.gradient} relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute top-6 left-6 text-white">
                    <IconComponent className="text-4xl mb-2 opacity-90" />
                    <p className="text-sm font-medium opacity-80">
                      {project.period}
                    </p>
                  </div>
                  {/* Decorative Elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
                  <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/10 rounded-full"></div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-white font-bold mb-6 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Technologies Used
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {project.technologies.map((tech, index) => {
                        const TechIcon = tech.icon;
                        return (
                          <div
                            key={index}
                            className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                          >
                            <TechIcon className={`text-lg ${tech.color}`} />
                            <span className="text-sm font-bold text-white">
                              {tech.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Key Features */}
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      Key Features
                    </h4>
                    <ul className="space-y-2">
                      {project.features.slice(0, 3).map((feature, index) => (
                        <li
                          key={index}
                          className="text-sm font-bold text-white flex items-start"
                        >
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Highlights */}
                  <div className="border-t border-gray-100 pt-6">
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Project Highlights
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {project.highlights.map((highlight, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-100"
                        >
                          <p className="text-xs font-bold text-white text-center">
                            {highlight}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={itemVariants}
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Start Your Next Project?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              I'm always excited to work on new challenges and bring innovative
              ideas to life. Let's discuss how we can build something amazing
              together.
            </p>
            <motion.a
              href="#contact"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-50 transition-colors duration-300 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaUsers className="mr-2" />
              Let's Work Together
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
