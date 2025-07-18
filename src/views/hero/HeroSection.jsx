import {
  FaGithub,
  FaLinkedin,
  FaMedium,
  FaEnvelope,
  FaDownload,
} from "react-icons/fa";
import { motion } from "framer-motion";
import ThreeBackground from "../../components/ThreeBackground";
import FloatingElements from "../../components/FloatingElements";
import TypingEffect from "../../components/TypingEffect";
import PerformanceOptimizer from "../../components/PerformanceOptimizer";
import "../../components/HeroAnimations.css";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

const iconVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i) => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay: 0.5 + i * 0.1,
      type: "spring",
      stiffness: 200,
    },
  }),
};

export default function Hero() {
  return (
    <PerformanceOptimizer>
      <section className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 relative overflow-hidden">
        {/* Three.js Background */}
        <ThreeBackground />

        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 opacity-20 z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950/30 to-purple-950/30"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-900/10 to-transparent"></div>
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        {/* Professional Floating Elements */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full mix-blend-multiply filter blur-3xl animate-pulse z-10"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000 z-10"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-full mix-blend-multiply filter blur-2xl animate-pulse delay-500 z-10"></div>

        <div className="w-[90%] mx-auto px-6 py-16 relative z-20">
          <motion.div
            className="flex flex-col lg:flex-row items-center justify-between min-h-screen gap-8 lg:gap-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Left Content */}
            <motion.div
              className="lg:w-1/2 mb-12 lg:mb-0 text-center lg:text-left"
              variants={itemVariants}
            >
              {/* Greeting */}
              <motion.p
                className="text-blue-400 text-lg font-medium mb-4 tracking-wide"
                variants={itemVariants}
              >
                Hello, I'm
              </motion.p>

              {/* Name with Gradient */}
              <TypingEffect
                text="Rijan Thapa"
                className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent leading-tight"
                delay={800}
              />

              {/* Title with Animation */}
              <motion.div className="mb-8" variants={itemVariants}>
                <h2 className="text-2xl lg:text-4xl font-semibold text-gray-200 mb-2">
                  Frontend Developer
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto lg:mx-0 rounded-full"></div>
              </motion.div>

              {/* Description */}
              <motion.p
                className="text-lg lg:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed"
                variants={itemVariants}
              >
                I craft beautiful, responsive, and user-friendly web experiences
                using modern technologies like React, Next.js, and Tailwind CSS.
                Let's bring your ideas to life.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 mb-12 justify-center lg:justify-start"
                variants={itemVariants}
              >
                <motion.a
                  href="#contact"
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden button-glow gradient-shift"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse opacity-0 group-hover:opacity-30"></span>
                  <span className="relative z-10">Get In Touch</span>
                </motion.a>

                <motion.a
                  href="/resume.pdf"
                  download
                  className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-400 border-2 border-blue-400 rounded-full hover:bg-blue-400 hover:text-white transition-all duration-300 transform hover:scale-105"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaDownload className="mr-2 text-sm" />
                  Download CV
                </motion.a>
              </motion.div>

              {/* Social Links */}
              <motion.div
                className="flex items-center gap-6 justify-center lg:justify-start"
                variants={itemVariants}
              >
                <span className="text-gray-400 text-sm font-medium">
                  Follow me:
                </span>
                <div className="flex gap-4">
                  {[
                    {
                      Icon: FaGithub,
                      href: "https://github.com/rijanThapa",
                      label: "GitHub",
                    },
                    {
                      Icon: FaMedium,
                      href: "https://medium.com/@rijan4568",
                      label: "Medium",
                    },
                    {
                      Icon: FaLinkedin,
                      href: "https://www.linkedin.com/in/rijan-thapa-136a84315/",
                      label: "LinkedIn",
                    },
                    {
                      Icon: FaEnvelope,
                      href: "mailto:rijan4568@gmail.com",
                      label: "Email",
                    },
                  ].map(({ Icon, href, label }, i) => (
                    <motion.a
                      key={i}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative p-3 text-gray-400 hover:text-white transition-colors duration-300 rounded-full hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600"
                      custom={i}
                      variants={iconVariants}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={label}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-0 group-hover:scale-100"></div>
                      <Icon className="relative z-10 text-xl" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Profile Image */}
            <motion.div
              className="lg:w-1/2 flex justify-center lg:justify-end"
              variants={itemVariants}
            >
              <div className="relative">
                {/* Three.js Floating Elements */}
                <div className="absolute inset-0 -m-8">
                  <FloatingElements />
                </div>

                {/* Glowing Border */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full p-1 animate-pulse">
                  <div className="bg-gray-900 rounded-full h-full w-full"></div>
                </div>

                {/* Profile Image */}
                <motion.div
                  className="relative w-80 h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden shadow-2xl shadow-blue-500/30 z-10"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  style={{
                    background:
                      "linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4)",
                    padding: "4px",
                  }}
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-gray-900">
                    <img
                      src="https://avatars.githubusercontent.com/u/62012463?v=4"
                      alt="Rijan Thapa - Frontend Developer"
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </motion.div>

                {/* Floating Tech Stack */}
                <div className="absolute -top-4 -right-4 bg-white/10 backdrop-blur-sm rounded-full p-4 border border-white/20 z-20 float-animation">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-white">
                      Available
                    </span>
                  </div>
                </div>

                {/* Floating Skills */}
                <motion.div
                  className="absolute -bottom-6 -left-6 bg-purple-600/20 backdrop-blur-sm rounded-lg p-3 border border-purple-400/30 z-20 float-animation sparkle"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2, duration: 0.5 }}
                  style={{ animationDelay: "0.5s" }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-xs font-medium text-purple-200">
                      React • Next.js • Tailwind
                    </span>
                  </div>
                </motion.div>

                {/* Experience Badge */}
                <motion.div
                  className="absolute -top-8 -left-8 bg-cyan-600/20 backdrop-blur-sm rounded-lg p-3 border border-cyan-400/30 z-20 float-animation"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2.5, duration: 0.5 }}
                  style={{ animationDelay: "1s" }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span className="text-xs font-medium text-cyan-200">
                      3+ Years Experience
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </PerformanceOptimizer>
  );
}
