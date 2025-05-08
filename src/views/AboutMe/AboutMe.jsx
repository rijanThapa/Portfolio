export default function About() {
  return (
    <section className="py-20 px-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">About Me</h2>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Text Content */}
          <div className="md:w-1/2">
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
          </div>

          {/* Timeline */}
          <div className="md:w-1/2">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 h-full w-0.5 bg-blue-500 transform -translate-x-1/2"></div>

              {/* Timeline items */}
              <div className="space-y-8">
                {/* Axios Software Internship */}
                <div className="relative pl-12">
                  <div className="absolute left-4 w-3 h-3 rounded-full bg-blue-600 border-4 border-blue-300 transform -translate-x-1/2 top-1"></div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-bold text-xl mb-1">Frontend Intern</h3>
                    <p className="text-blue-600 font-medium mb-2">
                      Axios Software
                    </p>
                    <p className="text-gray-500 text-sm mb-2">
                      Dec 24, 2023 - Mar 4, 2024
                    </p>
                    <p className="text-gray-700">
                      Gained hands-on experience with React.js and modern
                      frontend development practices. Contributed to real-world
                      projects and collaborated with senior developers.
                    </p>
                  </div>
                </div>

                {/* NEXT Step Developer */}
                <div className="relative pl-12">
                  <div className="absolute left-4 w-3 h-3 rounded-full bg-blue-600 border-4 border-blue-300 transform -translate-x-1/2 top-1"></div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-bold text-xl mb-1">
                      Frontend Developer
                    </h3>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
