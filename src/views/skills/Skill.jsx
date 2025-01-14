import React from "react";

const Skill = () => {
  const skills = [
    "React",
    "Next.js",
    "JavaScript",
    "Typescript",
    "HTML",
    "CSS",
    "Tailwind CSS",
    "Material UI",
    "Ant Design",
    "Redux",
    "React Native",
    "Zustand",
    "Redux",
    "React Query",
    "Node js",
    "Express",
    "NEST",
  ];

  return (
    <>
      <section className="bg-gray-900 py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-white">Skill</h2>
          <div className="grid grid-cols-6 md:grid-cols-4 gap-4">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="bg-gray-800 text-white rounded-lg p-4 shadow transform transition-all duration-500 ease-in-out hover:scale-105 animate__animated animate__fadeIn animate__delay-1s"
                style={{ animationDelay: `${index * 0.1}s` }} 
              >
                {skill}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Skill;
