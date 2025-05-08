export default function Hero() {
  return (
    <section className="bg-gray-800 text-white py-20 px-8 overflow-hidden">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-12 md:mb-0">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fadeInLeft">
            Rijan Thapa
          </h1>

          <h2 className="text-2xl md:text-3xl mb-8 text-blue-400 animate-fadeInLeft animation-delay-200">
            Frontend Developer
          </h2>

          <p className="text-xl mb-8 max-w-2xl animate-fadeInLeft animation-delay-400">
            Passionate about creating responsive and user-friendly web
            applications using React and modern web technologies.
          </p>

          <div className="flex space-x-4 mb-8 animate-fadeIn animation-delay-600">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 transition-colors"
            >
              {/* <GitHub size={24} /> */}
              [GitHub]
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 transition-colors"
            >
              {/* <Linkedin size={24} /> */}
              [LinkedIn]
            </a>
            <a
              href="mailto:john@example.com"
              className="text-white hover:text-gray-300 transition-colors"
            >
              {/* <Mail size={24} /> */}
              [Email]
            </a>
          </div>

          <a
            href="#contact"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 animate-fadeIn animation-delay-800"
          >
            Get in Touch
          </a>
        </div>

        <div className="md:w-1/2 flex justify-center animate-fadeInRight animation-delay-400">
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-blue-500">
            {/* Replace with your actual image */}
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <img src="https://scontent.fktm7-1.fna.fbcdn.net/v/t1.6435-9/52905713_406693316757282_6874493330781110272_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeHK1R-LW3jAwt5WfSi_JJiFPsEV64if3b8-wRXriJ_dvztXXisM_Kzi3gD0kHeuV0ZJMTx7j9v3I4mq4vQOLxbS&_nc_ohc=HDLUi-wr1aAQ7kNvwGNMIic&_nc_oc=Admf9NPVHqlfE9EuWFVI16Wd4oyRk1O2wAvb8bf7ELb0fdKBp9iXQYtGYbffPmodeSZVRq9ffzn-WH8oh2c07YdJ&_nc_zt=23&_nc_ht=scontent.fktm7-1.fna&_nc_gid=q5g-LRzS3jswMgZwvcCBfg&oh=00_AfLNSRo9ufaQ5hyMMKnY0AU8OFm5Zo2x6Bli7p8lKDc5Vw&oe=68445BCC" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
