import { motion } from "framer-motion";

export default function About() {
  // Left text animation: slide in from left
  const leftVariants = {
    hidden: { opacity: 0, x: -80 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 80, damping: 20, duration: 1 },
    },
  };

  // Container variants (no stagger to control delay manually)
  const timelineContainerVariants = {
    hidden: {},
    visible: {},
  };

  // Timeline item animation: slide in from right (no delay)
  const timelineItemVariants = {
    hidden: { opacity: 0, x: 80 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 80, damping: 20 },
    },
  };

  // Timeline item animation: slide in from right with 2s delay
  const timelineItemVariantsDelayed = {
    hidden: { opacity: 0, x: 80 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 80, damping: 20, delay: 1 },
    },
  };

  return (
    <section className="py-20 px-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">About Me</h2>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Left Text */}
          <motion.div
            className="md:w-1/2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={leftVariants}
          >
            <p className="text-lg mb-4">
              I'm a passionate Frontend developer with 1 year of experience in
              building modern web applications. I specialize in creating
              responsive, accessible, and performant user interfaces using
              React, Next.js, and other cutting-edge technologies.
            </p>
            <p className="text-lg mb-4">
              My journey in web development started with a fascination for
              creating interactive user experiences. Over the years, I've honed
              my skills in JavaScript, React, and related technologies, always
              staying up-to-date with the latest trends and best practices in
              the field.
            </p>
            <p className="text-lg">
              When I'm not coding, you can find me contributing to open-source
              projects, writing technical blog posts, or exploring new web
              technologies.
            </p>
          </motion.div>

          {/* Timeline */}
          <motion.div
            className="md:w-1/2 relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={timelineContainerVariants}
          >
            {/* Timeline vertical line */}
            <div
              className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-500"
              style={{ transform: "translateX(-50%)" }}
            ></div>

            <div className="space-y-8 relative z-10">
              {/* Timeline Item 1 */}
              <motion.div
                className="relative pl-12"
                variants={timelineItemVariants} // no delay
              >
                <div className="absolute left-4 top-3 w-3 h-3 rounded-full bg-blue-600 border-4 border-blue-300 transform -translate-x-1/2"></div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="font-bold text-xl mb-1">Frontend Intern</h3>
                  <p className="text-blue-600 font-medium mb-2">
                    Axios Software
                  </p>
                  <p className="text-gray-500 text-sm mb-2">
                    Dec 24, 2023 - Mar 4, 2024
                  </p>
                  <p className="text-gray-700">
                    Gained hands-on experience with React.js and modern frontend
                    development practices. Contributed to real-world projects
                    and collaborated with senior developers.
                  </p>
                </div>
              </motion.div>

              {/* Timeline Item 2 */}
              <motion.div
                className="relative pl-12"
                variants={timelineItemVariantsDelayed} // 2 seconds delay here
              >
                <div className="absolute left-4 top-3 w-3 h-3 rounded-full bg-blue-600 border-4 border-blue-300 transform -translate-x-1/2"></div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="font-bold text-xl mb-1">Frontend Developer</h3>
                  <p className="text-blue-600 font-medium mb-2">NEXT Step</p>
                  <p className="text-gray-500 text-sm mb-2">
                    Mar 10, 2024 - Present
                  </p>
                  <p className="text-gray-700">
                    Developing responsive web applications using React and
                    Next.js. Implementing state management solutions and
                    optimizing performance.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
