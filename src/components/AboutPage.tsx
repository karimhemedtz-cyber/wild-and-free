/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Quote, Sparkles, Target, Compass, ChevronRight } from 'lucide-react';

export default function AboutPage() {
  const { settings } = useApp();
  const [index, setIndex] = useState(0);

  // Automatic slide timing
  useEffect(() => {
    if (!settings.aboutSliderImages || settings.aboutSliderImages.length === 0) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % settings.aboutSliderImages.length);
    }, 4500); // 4.5s slide change
    return () => clearInterval(interval);
  }, [settings.aboutSliderImages]);

  return (
    <div className="w-full bg-white text-stone-900 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Left Side: Story, Mission, Vision, Why Choose Us (7 Columns) */}
        <div className="lg:col-span-7 space-y-12">
          
          {/* Header block */}
          <div className="space-y-3">
            <p className="text-[11px] tracking-[0.4em] font-mono text-amber-800 uppercase font-bold">
              ESTABLISHED IN ARUSHA, EAST AFRICA
            </p>
            <h1 id="about-headline" className="text-3xl md:text-5xl font-normal font-serif text-emerald-950 leading-tight italic">
              Our ancestral story & DNA
            </h1>
            <div className="w-20 h-1 bg-amber-600 rounded-full"></div>
          </div>

          {/* Company Story */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <Quote className="w-10 h-10 text-amber-700/25 shrink-0" />
              <p id="about-story" className="text-stone-600 font-serif italic text-base md:text-lg leading-relaxed pt-1">
                "{settings.aboutStory}"
              </p>
            </div>
          </div>

          {/* Mission & Vision (2 grid cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* Mission */}
            <div className="p-6 editorial-card rounded-2xl space-y-3 relative overflow-hidden group">
              <div className="absolute top-2 right-2 p-1 text-emerald-800 bg-emerald-50 rounded-full">
                <Target className="w-4 h-4" />
              </div>
              <h3 className="font-serif italic font-bold text-sm tracking-widest text-emerald-950 uppercase flex items-center gap-2">
                Our Mission
              </h3>
              <p id="about-mission" className="text-xs text-stone-500 leading-relaxed">
                {settings.aboutMission}
              </p>
            </div>

            {/* Vision */}
            <div className="p-6 editorial-card rounded-2xl space-y-3 relative overflow-hidden group">
              <div className="absolute top-2 right-2 p-1 text-amber-750 bg-amber-50 rounded-full">
                <Compass className="w-4 h-4" />
              </div>
              <h3 className="font-serif italic font-bold text-sm tracking-widest text-[#111827] uppercase flex items-center gap-2">
                Our Vision
              </h3>
              <p id="about-vision" className="text-xs text-stone-500 leading-relaxed">
                {settings.aboutVision}
              </p>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="space-y-4">
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-stone-500">
              Why African Wise Warrior Safaris?
            </h3>
            <div className="space-y-3">
              {settings.aboutWhyUs && settings.aboutWhyUs.map((point, pIndex) => (
                <div key={pIndex} className="flex items-start gap-3 text-xs md:text-sm">
                  <div className="mt-1 flex items-center justify-center p-1 bg-emerald-50 text-emerald-800 rounded-full shrink-0">
                    <Sparkles className="w-3 h-3" />
                  </div>
                  <p id={`about-why-point-${pIndex}`} className="text-stone-600 font-mono font-medium leading-relaxed">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Automatic transition image slider (5 Columns) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-36">
          <div className="relative h-[480px] md:h-[550px] w-full rounded-3xl overflow-hidden shadow-2xl border border-stone-100 bg-stone-900 group">
            
            {/* Slide Container */}
            {settings.aboutSliderImages && settings.aboutSliderImages.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.img
                  key={index}
                  src={settings.aboutSliderImages[index]}
                  alt="African Savanna scenery"
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2 }}
                  className="w-full h-full object-cover select-none"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-500 font-mono text-xs">
                No slider images uploaded.
              </div>
            )}

            {/* Accent Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent"></div>

            {/* Slide indicators bottom-center */}
            <div className="absolute bottom-6 inset-x-0 flex items-center justify-center gap-2">
              {settings.aboutSliderImages && settings.aboutSliderImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`w-3.5 h-1.5 rounded-full transition-all cursor-pointer ${
                    i === index ? 'bg-amber-500 w-6' : 'bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Show slide ${i + 1}`}
                ></button>
              ))}
            </div>
          </div>
          
          <div className="p-4 bg-stone-50 border border-stone-100 rounded-2xl flex items-center justify-between text-xs font-mono">
            <span className="text-stone-500">EXPERIENCE THE IMMERSION</span>
            <span className="text-amber-800 font-semibold uppercase flex items-center gap-1.5">
              100% private safaris <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
