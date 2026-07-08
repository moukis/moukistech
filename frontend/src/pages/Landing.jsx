import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero, { Marquee } from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import About from "@/components/sections/About";
import Testimonials from "@/components/sections/Testimonials";
import Gallery from "@/components/sections/Gallery";
import StoreFaq from "@/components/sections/StoreFaq";
import Contact from "@/components/sections/Contact";
import useLenis from "@/hooks/useLenis";

export default function Landing() {
  useLenis();
  useEffect(() => {
    document.title = "Moukis tech — Réparation d'ordinateurs portables de confiance";
    const hash = window.location.hash;
    if (hash) setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" }), 200);
  }, []);

  return (
    <div className="bg-[#050507] text-white overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <About />
        <Testimonials />
        <Gallery />
        <StoreFaq />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
