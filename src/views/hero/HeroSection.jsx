

export default function Hero() {
  return (
    <section className="bg-gray-800 text-white py-32">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Rijan Thapa</h1>
        <h2 className="text-2xl md:text-3xl mb-8">Frontend Developer</h2>
        <p className="text-xl mb-8 max-w-2xl">
          Passionate about creating responsive and user-friendly web
          applications using React and modern web technologies.
        </p>
        <div className="flex space-x-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-300"
          >
            {/* <GitHub size={24} /> */}
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-300"
          >
            {/* <Linkedin size={24} /> */}
          </a>
          <a
            href="mailto:john@example.com"
            className="text-white hover:text-gray-300"
          >
            {/* <Mail size={24} /> */}
          </a>
        </div>
      </div>
    </section>
  );
}
