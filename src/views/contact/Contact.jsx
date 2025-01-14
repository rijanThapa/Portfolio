export default function Contact() {
  return (
    <section className="bg-gray-900 text-white py-10 ps-8">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Contact Me</h2>
        <p className="text-lg mb-8">
          I'm always open to new opportunities and collaborations. Feel free to<br/>
          reach out to me via email or connect with me on social media.
        </p>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <a
            href="mailto:john@example.com"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Email Me
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
          >
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
