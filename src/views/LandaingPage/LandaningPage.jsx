import React from "react";
import Hero from "../hero/HeroSection";
import About from "../AboutMe/AboutMe";
import Skills from "../skills/Skill";
import Projects from "../projects/Projects";
import Contact from "../contact/Contact";

const LandaningPage = () => {
  return (
    <>
      <section id="hero">
        <Hero />
      </section>
      <section id="about">
        <About />
      </section>
      <section id="skills">
        <Skills />
      </section>
      <section id="projects">
        <Projects />
      </section>
      <section id="contact">
        <Contact />
      </section>
    </>
  );
};

export default LandaningPage;
