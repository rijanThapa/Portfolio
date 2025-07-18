import { motion } from "framer-motion";

export default function About() {
  // Enhanced animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6,
      },
    },
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8,
      },
    },
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8,
      },
    },
  };

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const timelineItem = {
    hidden: { opacity: 0, x: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6,
      },
    },
  };

  const skillBadge = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10,
      },
    },
  };

  return (
    <section className="relative py-20 px-4 bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>

      <div className="width mx-auto max-w-[90%] relative z-10">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            About Me
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Content - Personal Introduction */}
          <motion.div
            className="space-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInLeft}
          >
            {/* Profile Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-2xl">RT</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Rijan Thapa
                  </h3>
                  <p className="text-blue-600 font-medium">
                    Frontend Developer
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  I'm a passionate Frontend developer with{" "}
                  <span className="font-semibold text-blue-600">
                    1 year of experience
                  </span>{" "}
                  in building modern web applications. I specialize in creating
                  responsive, accessible, and performant user interfaces using
                  React, Next.js, and other cutting-edge technologies.
                </p>
                <p className="text-lg">
                  My journey in web development started with a fascination for
                  creating interactive user experiences. Over the years, I've
                  honed my skills in JavaScript, React, and related
                  technologies, always staying up-to-date with the latest trends
                  and best practices.
                </p>
                <p className="text-lg">
                  When I'm not coding, you can find me contributing to
                  open-source projects, writing technical blog posts, or
                  exploring new web technologies.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Professional Timeline */}
          <motion.div
            className="relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInRight}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
              <h3 className="text-2xl font-bold text-gray-800 mb-8">
                Professional Journey
              </h3>

              {/* Timeline Container */}
              <motion.div className="relative" variants={staggerContainer}>
                {/* Timeline vertical line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-600"></div>

                <div className="space-y-8">
                  {/* Timeline Item 1 */}
                  <motion.div
                    className="relative pl-16"
                    variants={timelineItem}
                  >
                    <div className="absolute left-6 top-6 w-3 h-3 rounded-full bg-blue-600 border-4 border-blue-200 transform -translate-x-1/2 shadow-lg"></div>
                    <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl shadow-lg border border-blue-100 hover:shadow-xl transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-xl text-gray-800">
                          Frontend Intern
                        </h4>
                        <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                          3 months
                        </span>
                      </div>
                      <p className="text-blue-600 font-semibold mb-2">
                        Axios Software
                      </p>
                      <p className="text-gray-600 text-sm mb-3">
                        Dec 24, 2023 - Mar 4, 2024
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        Gained hands-on experience with React.js and modern
                        frontend development practices. Contributed to
                        real-world projects and collaborated with senior
                        developers.
                      </p>
                    </div>
                  </motion.div>

                  {/* Timeline Item 2 */}
                  <motion.div
                    className="relative pl-16"
                    variants={timelineItem}
                  >
                    <div className="absolute left-6 top-6 w-3 h-3 rounded-full bg-purple-600 border-4 border-purple-200 transform -translate-x-1/2 shadow-lg"></div>
                    <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl shadow-lg border border-purple-100 hover:shadow-xl transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-xl text-gray-800">
                          Frontend Developer
                        </h4>
                        <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">
                          Current
                        </span>
                      </div>
                      <p className="text-purple-600 font-semibold mb-2">
                        NEXT Step
                      </p>
                      <p className="text-gray-600 text-sm mb-3">
                        Mar 10, 2024 - Present
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        Developing responsive web applications using React and
                        Next.js. Implementing state management solutions and
                        optimizing performance for enhanced user experiences.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          {[
            {
              number: "2+",
              label: "Years Experience",
              color: "from-blue-500 to-blue-600",
            },
            {
              number: "10+",
              label: "Projects Completed",
              color: "from-purple-500 to-purple-600",
            },
            {
              number: "5+",
              label: "Technologies",
              color: "from-green-500 to-green-600",
            },
            {
              number: "100%",
              label: "Client Satisfaction",
              color: "from-orange-500 to-orange-600",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 text-center"
              variants={skillBadge}
            >
              <div
                className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}
              >
                {stat.number}
              </div>
              <div className="text-gray-600 text-sm font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
