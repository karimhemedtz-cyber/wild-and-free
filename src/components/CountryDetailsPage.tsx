/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, MapPin, Calendar, Compass, ArrowRight, Eye } from 'lucide-react';

interface CountryDetailsPageProps {
  countryId: string;
  onBack: () => void;
  onBook: (packageName: string) => void;
}

export default function CountryDetailsPage({ countryId, onBack, onBook }: CountryDetailsPageProps) {
  const { countries, parks } = useApp();
  const [activePhoto, setActivePhoto] = useState<{ [parkId: string]: string }>({});

  const country = countries.find(c => c.id === countryId);
  const countryParks = parks.filter(p => p.countryId === countryId);

  if (!country) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <p className="text-xl text-stone-600 font-mono">Country not found.</p>
        <button onClick={onBack} className="mt-4 px-6 py-2.5 bg-emerald-950 text-white font-mono rounded-lg cursor-pointer">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-white text-stone-900 pb-24">
      {/* Immersive Country Hero Header */}
      <div className="relative h-[400px] w-full overflow-hidden bg-stone-900">
        <img
          src={country.imageUrl}
          alt={country.name}
          className="w-full h-full object-cover select-none"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-stone-950/45 to-stone-950/20"></div>
        
        {/* Navigation & Titles */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-12 max-w-7xl mx-auto text-white z-10">
          <button
            id="country-back-btn"
            onClick={onBack}
            className="self-start px-4 py-2 bg-stone-950/50 backdrop-blur-md hover:bg-stone-950/80 rounded-full border border-white/10 flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest transition-all active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Parks
          </button>

          <div>
            <p className="text-xs md:text-sm text-yellow-500 font-mono font-bold tracking-[0.45em] uppercase mb-1">
              LUXURY EXPEDITIONS
            </p>
            <h1 id={`country-title-${country.id}`} className="text-4xl md:text-6xl font-normal font-serif italic text-stone-50">
              {country.name}
            </h1>
            <p className="text-xs md:text-sm max-w-xl text-stone-200 mt-2 font-mono uppercase tracking-wider">
              Explore legendary kingdoms, volcanic craters, and raw mountain forests.
            </p>
          </div>
        </div>
      </div>

      {/* Main National Parks Grid Display */}
      <div className="max-w-7xl mx-auto px-6 mt-16 space-y-24">
        {countryParks.length === 0 ? (
          <div className="py-20 text-center font-mono text-stone-500 text-sm">
            No national parks defined yet by our expedition administrators.
          </div>
        ) : (
          countryParks.map((park, parkIndex) => {
            const currentPhoto = activePhoto[park.id] || park.imageUrl;

            return (
              <motion.div
                key={park.id}
                id={`park-section-${park.id}`}
                viewport={{ once: true }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: parkIndex * 0.1 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-6 border-t border-stone-100 first:border-0"
              >
                {/* Left Side: Images and Gallery Grid (5 columns) */}
                <div className="lg:col-span-5 space-y-4">
                  {/* Main Active Photo Container */}
                  <div className="relative h-[320px] md:h-[400px] rounded-2xl overflow-hidden shadow-lg border border-stone-100 group">
                    <img
                      src={currentPhoto}
                      alt={park.name}
                      className="w-full h-full object-cover transition-all"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 to-transparent"></div>
                    <div className="absolute top-4 right-4 bg-stone-950/60 backdrop-blur-md px-3 py-1 text-white text-[10px] uppercase font-mono font-medium rounded-full flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> Active view
                    </div>
                  </div>

                  {/* Animal / Wildlife Gallery (Vertical thumbnail slider at the bottom if records exist) */}
                  {park.gallery && park.gallery.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[10px] tracking-widest text-stone-500 font-mono uppercase font-bold">
                        Wildlife & Scenery Gallery (Click to Swap)
                      </p>
                      <div className="flex h-20 gap-3 overflow-x-auto pb-1 scrollbar-thin">
                        {/* Default Main Cover Thumbnail */}
                        <button
                          onClick={() => setActivePhoto({ ...activePhoto, [park.id]: park.imageUrl })}
                          className={`relative h-16 w-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                            currentPhoto === park.imageUrl ? 'border-amber-500 scale-95 shadow-md' : 'border-stone-200'
                          }`}
                        >
                          <img src={park.imageUrl} alt="Cover" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </button>
                        
                        {/* Secondary Gallery Thumbnails */}
                        {park.gallery.map((url, imgIndex) => (
                          <button
                            key={imgIndex}
                            onClick={() => setActivePhoto({ ...activePhoto, [park.id]: url })}
                            className={`relative h-16 w-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                              currentPhoto === url ? 'border-amber-500 scale-95 shadow-md' : 'border-stone-200'
                            }`}
                          >
                            <img src={url} alt={`Gallery ${imgIndex}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Side: Narrative and Technical specifications (7 columns) */}
                <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Compass className="w-5 h-5 text-emerald-700" />
                      <span className="text-xs font-bold text-amber-800 font-mono uppercase tracking-[0.2em]">
                        {country.name} Crown Reserve
                      </span>
                    </div>

                    <h2 id={`park-name-${park.id}`} className="text-2xl md:text-3xl lg:text-4xl font-normal font-serif text-emerald-950 leading-tight italic">
                      {park.name}
                    </h2>

                    <p id={`park-desc-${park.id}`} className="text-stone-600 text-sm md:text-base leading-relaxed">
                      {park.description}
                    </p>

                    {/* Metadata boxes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      {park.location && (
                        <div id={`park-meta-location-${park.id}`} className="p-3 editorial-card rounded-xl flex items-start gap-2.5">
                          <MapPin className="w-4 h-4 text-emerald-800 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-[10px] text-stone-400 font-mono uppercase font-bold">Location</p>
                            <p className="text-xs text-stone-600 font-medium">{park.location}</p>
                          </div>
                        </div>
                      )}
                      
                      {park.bestSeason && (
                        <div id={`park-meta-season-${park.id}`} className="p-3 editorial-card rounded-xl flex items-start gap-2.5">
                          <Calendar className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-[10px] text-stone-400 font-mono uppercase font-bold">Best Season</p>
                            <p className="text-xs text-stone-600 font-medium">{park.bestSeason}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Activities List */}
                    <div className="space-y-2.5 pt-2">
                      <h4 className="text-xs font-bold text-stone-600 font-mono uppercase tracking-widest">
                        Exquisite Activities Offered:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {park.activities.map((act, actIndex) => (
                          <span
                            key={actIndex}
                            className="px-3.5 py-1.5 bg-emerald-50 text-emerald-950 rounded-lg text-xs font-mono font-medium border border-emerald-100/40"
                          >
                            {act}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* BOOK NOW Action row aligned directly to bottom */}
                  <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[11px] text-stone-500 font-mono leading-relaxed text-center sm:text-left max-w-sm">
                      Our private customized safaris encompass bespoke drivers, airport transfers, gourmet bush dining, and luxury lodge bookings for {park.name}.
                    </p>
                    <button
                      id={`park-book-btn-${park.id}`}
                      onClick={() => onBook(`${park.name} Private Luxury Safari`)}
                      className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-900 font-mono font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md hover:shadow-[0_4px_12px_rgba(245,158,11,0.2)] active:scale-95 shrink-0 flex items-center gap-2 cursor-pointer"
                    >
                      Book Now
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
