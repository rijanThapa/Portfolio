import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const Skill = () => {
  const skills = [
    "React",
    "Next.js",
    "JavaScript",
    "TypeScript",
    "HTML",
    "CSS",
    "Tailwind CSS",
    "Material UI",
    "Ant Design",
    "Redux",
    "React Native",
    "Zustand",
    "React Query",
    "Node.js",
    "Express",
    "NestJS",
    "Ruby on Rails"
  ];

  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.2 });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="bg-gray-950 py-16 px-6">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl font-extrabold text-white mb-12 text-center">
          My Skills
        </h2>

        <motion.div
          ref={containerRef}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-gray-800 text-white text-center rounded-xl p-5 font-medium shadow-lg hover:shadow-2xl transition-all hover:scale-105"
            >
              {skill}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skill;
