import CustomCursor from "@/components/effects/CustomCursor";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Education from "@/components/sections/Education";
import Projects from "@/components/sections/Projects";
import Achievements from "@/components/sections/Achievements";
import Contact from "@/components/sections/Contact";
import Testimonials from "@/components/sections/Testimonials";

export default function Home() {
  return (
    <main className="custom-cursor-area relative min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <CustomCursor />

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Education />
        <Projects />
        <Achievements />
        <Testimonials />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}