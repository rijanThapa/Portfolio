import { FaGithub, FaLinkedin, FaMedium, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";

const iconVariants = {
  hidden: { y: -60, opacity: 0 },
  visible: (i) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.3 + i * 0.2,
      type: "spring",
      stiffness: 120,
    },
  }),
};

export default function Hero() {
  return (
    <section className="bg-gray-900 text-white py-20 px-8 overflow-hidden">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        {/* Left Content */}
        <motion.div
          className="md:w-1/2 mb-12 md:mb-0"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Rijan Thapa
          </h1>

          <h2 className="text-2xl md:text-3xl mb-6 text-blue-400">
            Frontend Developer
          </h2>

          <p className="text-lg md:text-xl mb-6 max-w-2xl">
            I build responsive, engaging user interfaces using modern tools like
            React, Tailwind CSS, and more. Let's build something amazing.
          </p>

          {/* Social + Email Icons */}
          <div className="flex flex-wrap items-center gap-6 text-2xl mb-8">
            {[FaGithub, FaMedium, FaLinkedin].map((Icon, i) => (
              <motion.a
                key={i}
                href={
                  i === 0
                    ? "https://github.com/rijanThapa"
                    : i === 1
                    ? "https://medium.com/@rijan4568"
                    : "https://www.linkedin.com/in/rijan-thapa-136a84315/"
                }
                target="_blank"
                rel="noopener noreferrer"
                custom={i}
                initial="hidden"
                animate="visible"
                variants={iconVariants}
                className="hover:text-blue-400 transition-colors"
              >
                <Icon />
              </motion.a>
            ))}

            {/* Email (With Icon + Text) */}
            <motion.a
              href="mailto:rijan4568@gmail.com"
              className="flex items-center space-x-2 hover:text-blue-400 transition-colors text-base"
              custom={3}
              initial="hidden"
              animate="visible"
              variants={iconVariants}
            >
              <FaEnvelope className="text-2xl" />
              <span className="hidden sm:inline">rijan4568@gmail.com</span>
            </motion.a>
          </div>

          {/* CTA */}
          <motion.a
            href="#contact"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get in Touch
          </motion.a>
        </motion.div>

        {/* Right Side Image */}
        <motion.div
          className="md:w-1/2 flex justify-center"
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg shadow-blue-500/50">
            <img
              src="https://avatars.githubusercontent.com/u/62012463?v=4"
              alt="Rijan Thapa"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
