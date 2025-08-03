import React from "react";
import Hero from "../hero/HeroSection";
import About from "../AboutMe/AboutMe";
import Skills from "../skills/Skill";
import Projects from "../projects/Projects";
import Contact from "../contact/Contact";

const LandaningPage = () => {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
    </>
  );
};

export default LandaningPage;
