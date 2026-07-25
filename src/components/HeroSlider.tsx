/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, ArrowDownCircle } from 'lucide-react';

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&q=80&w=1920',
    title: 'THE MAJESTY OF THE WILD',
    subtitle: 'EXPERIENCE EAST AFRICAS UNMATCHED SAVANNA KINGDOMS',
    accent: 'Serengeti, Tanzania'
  },
  {
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1920',
    title: 'COLOSSAL EARTH GIANTS',
    subtitle: 'ENCOUNTER MAJESTIC ELEPHANT HERDS AT THE FOOT OF KILIMANJARO',
    accent: 'Amboseli, Kenya'
  },
  {
    image: 'https://images.unsplash.com/photo-1581888227599-779811939961?auto=format&fit=crop&q=80&w=1920',
    title: 'INTO THE CLOUD FORESTS',
    subtitle: 'SIT WITH EMOTIONAL MOUNTAIN GORILLAS IN REVERENT SILENCE',
    accent: 'Bwindi Forest, Uganda'
  },
  {
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=1920',
    title: 'THE GREAT SOUL EXPEDITIONS',
    subtitle: 'REDEFINE YOUR CONNECTION WITH THE NATURAL COGNIZANT WORLD',
    accent: 'Maasai Mara, Kenya'
  }
];

interface HeroProps {
  onExplorePackages: () => void;
}

export default function HeroSlider({ onExplorePackages }: HeroProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % SLIDES.length);
    }, 5000); // Badilika kila sekunde 5

    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  return (
    <section id="hero-slider-section" className="relative w-full h-[85vh] overflow-hidden bg-stone-950">
      {/* Background Images Crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Main Photo */}
          <img
            src={SLIDES[index].image}
            alt={SLIDES[index].title}
            className="w-full h-full object-cover select-none"
            referrerPolicy="no-referrer"
          />
          {/* Glass Overlay Vignette for Elite Aesthetic */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-stone-950/60"></div>
        </motion.div>
      </AnimatePresence>

      {/* Floating Safari Core Narrative Box */}
      <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-16 max-w-7xl mx-auto z-10 text-white">
        {/* Empty row to push content down */}
        <div></div>

        {/* Central Display Information in Space Grotesk / Inter pairings */}
        <div className="max-w-3xl self-start space-y-4">
          <motion.p
            key={`sub-${index}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-xs md:text-sm text-amber-500 uppercase tracking-[0.4em] font-semibold"
          >
            {SLIDES[index].subtitle}
          </motion.p>
          
          <motion.h2
            key={`title-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight font-sans leading-tight uppercase text-stone-50"
          >
            {SLIDES[index].title}
          </motion.h2>

          <div className="w-20 h-[3px] bg-amber-600 rounded-full mt-2"></div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-6 pt-4"
          >
            <button
              id="hero-explore-btn"
              onClick={onExplorePackages}
              className="px-8 py-3.5 bg-emerald-700/95 hover:bg-emerald-600 border border-emerald-500/30 font-semibold tracking-wider font-mono text-xs uppercase rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              Discover Expeditions
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="text-stone-400 font-mono text-xs uppercase tracking-widest hidden sm:inline-block">
              Currently featuring: <span className="text-white font-semibold">{SLIDES[index].accent}</span>
            </span>
          </motion.div>
        </div>

        {/* Bottom Bar: Manual Controls & Scroll Tracker */}
        <div className="flex items-center justify-between border-t border-stone-850 pt-6">
          <div className="flex items-center gap-2">
            <button
              id="hero-prev-btn"
              onClick={handlePrev}
              className="p-3 border border-stone-800 rounded-full hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              id="hero-next-btn"
              onClick={handleNext}
              className="p-3 border border-stone-800 rounded-full hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-stone-500 font-mono text-xs">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-8 h-1 rounded-full transition-colors ${
                  i === index ? 'bg-amber-600' : 'bg-stone-800'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              ></button>
            ))}
          </div>

          {/* Prompt to pull downwards */}
          <button
            id="hero-scroll-btn"
            onClick={onExplorePackages}
            className="flex items-center gap-2 hover:text-amber-500 transition-colors text-stone-400 font-mono text-xs uppercase cursor-pointer"
          >
            <span>Scroll</span>
            <ArrowDownCircle className="w-4 h-4 animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
}
