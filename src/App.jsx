import React, { useState } from "react";

import Header from "./components/Header";
import Loader from "./components/Loader";

import Hero from "./sections/Hero";
import StatsMarquee from "./sections/StatsMarquee";
import About from "./sections/About";
import Projects from "./sections/Projects";
import Approach from "./sections/Approach";
import Journey from "./sections/myJourney";
import CTA from "./sections/CTA";
import Footer from "./sections/Footer";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="app">

      {isLoading && (
        <Loader
          onComplete={() => setIsLoading(false)}
        />
      )}

      <Header />

      <Hero />

      <StatsMarquee />

      <About />

      <Projects />

      <Approach />

      <Journey />

      <CTA />

      <Footer />

    </div>
  );
}