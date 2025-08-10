import React, { useState } from "react";

const scrollToSection = (id) => {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
};

const navItems = [
  { label: "Home", id: "hero" },
  { label: "About Me", id: "about" },
  { label: "Skills", id: "skills" },
  { label: "Projects", id: "projects" },
  { label: "Contact", id: "contact" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("hero");
              }}
              className="text-2xl font-bold text-white tracking-wide drop-shadow-lg"
            >
              MyPortfolio
            </a>
          </div>
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.id);
                }}
                className="text-white hover:text-cyan-400 transition-colors duration-200 font-medium px-3 py-2 rounded-lg"
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-gradient-to-b from-black/80 to-transparent px-4 pt-2 pb-4 absolute w-full">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(item.id);
                setMenuOpen(false);
              }}
              className="block text-white hover:text-cyan-400 transition-colors duration-200 font-medium py-2 border-b border-gray-700"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
