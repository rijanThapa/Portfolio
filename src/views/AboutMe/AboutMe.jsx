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
                    2 years of experience
                  </span>{" "}
                  at Next Step, specializing in building responsive and
                  user-friendly web applications. I'm proficient in React.js,
                  JavaScript, and modern front-end technologies, passionate
                  about delivering high-quality, efficient code while staying
                  up-to-date with industry trends.
                </p>
                <p className="text-lg">
                  My expertise spans across Next.js, TypeScript, CSS, Ant
                  Design, React Query, Node.js, and state management solutions
                  like Zustand and Redux Saga. I have contributed to the
                  development of multiple school management systems, focusing on
                  optimizing performance and writing clean, maintainable code.
                </p>
                <p className="text-lg">
                  I'm ready to contribute my expertise in front-end development
                  to new and challenging projects, always excited to work with
                  innovative technologies and deliver exceptional user
                  experiences.
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
                          Frontend Developer
                        </h4>
                        <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">
                          Current
                        </span>
                      </div>
                      <p className="text-blue-600 font-semibold mb-2">
                        Next Step
                      </p>
                      <p className="text-gray-600 text-sm mb-3">
                        2024/06 – present • Banepa, Nepal
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        Contributed to the development of a school management
                        system using Next.js, TypeScript, Ant Design, and React
                        Query, focusing on optimizing performance and writing
                        clean, maintainable code, resulting in a 20% increase in
                        user engagement. Implemented Redux Saga for state
                        management to increase code readability and optimize the
                        project.
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
                        <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                          6 months
                        </span>
                      </div>
                      <p className="text-purple-600 font-semibold mb-2">
                        Next Step
                      </p>
                      <p className="text-gray-600 text-sm mb-3">
                        2023/12 – 2024/06 • Banepa, Nepal
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        Contributed to the development of a school management
                        system using React, Bootstrap, Material UI, Zustand for
                        state management, focusing on optimizing and
                        maintainable code.
                      </p>
                    </div>
                  </motion.div>

                  {/* Timeline Item 3 */}
                  <motion.div
                    className="relative pl-16"
                    variants={timelineItem}
                  >
                    <div className="absolute left-6 top-6 w-3 h-3 rounded-full bg-green-600 border-4 border-green-200 transform -translate-x-1/2 shadow-lg"></div>
                    <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl shadow-lg border border-green-100 hover:shadow-xl transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-xl text-gray-800">
                          Frontend Intern
                        </h4>
                        <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium">
                          4 months
                        </span>
                      </div>
                      <p className="text-green-600 font-semibold mb-2">
                        Axios Software
                      </p>
                      <p className="text-gray-600 text-sm mb-3">
                        2023/10 – 2024/01
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        During my internship at Axios Software, I developed
                        responsive web designs and integrated APIs to enhance
                        application functionality. My work was recognized, and I
                        was awarded a certificate for my contributions.
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
              number: "11+",
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
