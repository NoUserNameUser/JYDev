"use client";

import { useEffect } from "react";
import Lenis from "lenis";

import Cursor from "@/components/Cursor";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Services from "@/components/Skills";
import Experience from "@/components/Work";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <>
      <Cursor />
      <Navigation />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Services />
        <Experience />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
