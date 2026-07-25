/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import HeroSlider from './components/HeroSlider';
import PackageCard from './components/PackageCard';
import BookingModal from './components/BookingModal';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import Footer from './components/Footer';
import CountryDetailsPage from './components/CountryDetailsPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import AdminDashboard from './components/AdminDashboard';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Calendar, MapPin, X, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { Package } from './types';

function AppContent() {
  const { countries, packages, currentUser } = useApp();
  
  // Routing State
  const [activePage, setActivePage] = useState<string>('home');
  const [activeCountry, setActiveCountry] = useState<string>('tanzania');
  
  // Modals Visibility
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingPreSelectId, setBookingPreSelectId] = useState<string>('');
  const [selectedPkgDetails, setSelectedPkgDetails] = useState<Package | null>(null);

  // Accordion active state for Packages List Page
  const [activeAccordionId, setActiveAccordionId] = useState<string | null>(null);

  const handleOpenBooking = (packageId?: string) => {
    if (packageId) {
      setBookingPreSelectId(packageId);
    } else {
      setBookingPreSelectId(packages[0]?.id || '');
    }
    setBookingOpen(true);
  };

  const handleCountryCardClick = (id: string) => {
    setActiveCountry(id);
    setActivePage('country');
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-stone-900 flex flex-col font-sans select-none">
      
      {/* 1. Global Navigation Header Header */}
      <Header 
        activePage={activePage} 
        setActivePage={(page) => {
          setActivePage(page);
          setSelectedPkgDetails(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* 2. Main Page views dispatcher (with smooth page mount animations) */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          
          {/* =========================================
              A. HOME PAGE
             ========================================= */}
          {activePage === 'home' && (
            <motion.div
              key="page-home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-16 pb-12"
            >
              {/* Full Screen Image fading slider */}
              <HeroSlider onExplorePackages={() => {
                setActivePage('packages');
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }} />

              {/* Home Packages Section */}
              <section className="max-w-7xl mx-auto px-6 py-6 space-y-12">
                <div className="text-center space-y-3">
                  <p className="text-xs md:text-sm tracking-[0.4em] font-mono text-amber-800 uppercase font-bold">
                    curated safari experiences
                  </p>
                  <h2 id="home-packages-title" className="text-3xl md:text-5xl font-normal font-serif text-emerald-950 italic">
                    Bespoke luxury packages
                  </h2>
                  <div className="w-16 h-1 bg-amber-600 mx-auto rounded-full"></div>
                </div>

                {/* Packages Grid - Latest 3 packages only */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {packages.slice(0, 3).map((pkg) => (
                    <div key={pkg.id}>
                      <PackageCard
                        pkg={pkg}
                        onClick={() => setSelectedPkgDetails(pkg)}
                        onBook={() => handleOpenBooking(pkg.id)}
                      />
                    </div>
                  ))}
                </div>

                {/* More Packages CTA - links directly to the full Packages page */}
                <div className="flex justify-center pt-2">
                  <button
                    id="home-more-packages-btn"
                    onClick={() => {
                      setActivePage('packages');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-8 py-3.5 bg-emerald-950 hover:bg-emerald-850 text-white font-mono font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
                  >
                    More Packages
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </section>

              {/* Destination countries horizontal links banner */}
              <section className="bg-stone-50 border-y border-stone-100 py-16">
                <div className="max-w-7xl mx-auto px-6 space-y-12">
                  <div className="text-center space-y-3">
                    <p className="text-xs md:text-sm tracking-[0.4em] font-mono text-amber-800 uppercase font-bold">
                      legendary frontiers
                    </p>
                    <h3 className="text-2xl md:text-4xl font-normal font-serif text-emerald-950 italic">
                      East African kingdoms
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {countries.slice(0, 3).map((country) => (
                      <div
                        key={country.id}
                        id={`home-country-${country.id}`}
                        onClick={() => handleCountryCardClick(country.id)}
                        className="group relative h-72 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-stone-200"
                      >
                        <img
                          src={country.imageUrl}
                          alt={country.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent"></div>
                        <div className="absolute bottom-6 left-6 text-white">
                          <p className="text-[10px] uppercase font-mono tracking-widest text-amber-400 font-bold mb-1">Explore</p>
                          <h4 className="text-xl font-bold font-sans uppercase tracking-wide">{country.name} Safaris</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Visual trust features block */}
              <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 py-8 text-center sm:text-left">
                <div className="p-6 editorial-card rounded-2xl space-y-3">
                  <p className="text-emerald-800 font-mono text-xs font-bold uppercase tracking-wider">ECO POLICIES</p>
                  <h4 className="font-serif font-bold text-emerald-950 text-base italic">Carbon-Neutral Stays</h4>
                  <p className="text-xs text-stone-500 leading-relaxed font-sans">10% of reservation margins directly fund rainforest preservation and native school boards.</p>
                </div>
                <div className="p-6 editorial-card rounded-2xl space-y-3">
                  <p className="text-amber-500 font-mono text-xs font-bold uppercase tracking-wider">EXPERTISE</p>
                  <h4 className="font-serif font-bold text-emerald-950 text-base italic">Bespoke Native Guides</h4>
                  <p className="text-xs text-stone-500 leading-relaxed font-sans">Walk safely with certified rangers carrying 15+ years of predatory and bird tracking precision.</p>
                </div>
                <div className="p-6 editorial-card rounded-2xl space-y-3">
                  <p className="text-amber-700 font-mono text-xs font-bold uppercase tracking-wider">COMFORT</p>
                  <h4 className="font-serif font-bold text-emerald-950 text-base italic">Deluxe Land Cruisers</h4>
                  <p className="text-xs text-stone-500 leading-relaxed font-sans">Enjoy executive custom-fitted cruisers containing satellite Wi-Fi, drink fridges, and high roof pops.</p>
                </div>
              </section>
            </motion.div>
          )}

          {/* =========================================
              B. NATIONAL PARKS ROUTE LISTING VIEW
             ========================================= */}
          {activePage === 'parks' && (
            <motion.div
              key="page-parks"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-6 py-16 md:py-24 space-y-12"
            >
              <div className="text-center space-y-3">
                <p className="text-xs md:text-sm tracking-[0.4em] font-mono text-amber-800 uppercase font-bold">
                  experience the absolute crown
                </p>
                <h2 id="parks-headline" className="text-3xl md:text-5xl font-normal font-serif text-emerald-950 italic">
                  Legendary frontiers
                </h2>
                <div className="w-16 h-1 bg-amber-600 mx-auto rounded-full"></div>
                <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed font-mono">
                  Select one of our primary East African destinations below to explore detailed game drive descriptions, wildlife photography galleries, and local seasons.
                </p>
              </div>

              {/* Horizontal Countries list as requested */}
              <div id="countries-horizontal" className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4">
                {countries.map((c) => (
                  <div
                    key={c.id}
                    id={`country-card-${c.id}`}
                    onClick={() => handleCountryCardClick(c.id)}
                    className="group relative h-96 w-full rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-stone-200"
                  >
                    <img
                      src={c.imageUrl}
                      alt={c.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-stone-950/10"></div>
                    <div className="absolute bottom-8 left-8 text-white">
                      <p className="text-[10px] uppercase font-mono tracking-widest text-amber-500 font-bold mb-1">East Africa</p>
                      <h3 className="text-2xl font-extrabold font-sans uppercase tracking-wide">{c.name} Guide</h3>
                      <p className="text-[10px] text-stone-300 font-mono mt-1 uppercase flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Enter reserve guides <ArrowRight className="w-4.5 h-4.5" />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* =========================================
              C. COUNTRY EXCURSIONS PAGE VIEW (SERENGETI, ETC)
             ========================================= */}
          {activePage === 'country' && (
            <motion.div
              key="page-country-details"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CountryDetailsPage
                countryId={activeCountry}
                onBack={() => {
                  setActivePage('parks');
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                onBook={(tourTitle) => {
                  setBookingPreSelectId('custom-booking');
                  setBookingOpen(true);
                }}
              />
            </motion.div>
          )}

          {/* =========================================
              D. PACKAGES ACCORDION VIEW
             ========================================= */}
          {activePage === 'packages' && (
            <motion.div
              key="page-packages"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto px-6 py-16 md:py-24 space-y-12"
            >
              <div className="text-center space-y-3">
                <p className="text-xs md:text-sm tracking-[0.4em] font-mono text-amber-800 uppercase font-bold">
                  bespoke pricing structures
                </p>
                <h2 id="packages-headline" className="text-3xl md:text-5xl font-normal font-serif text-emerald-950 italic">
                  Bespoke expedition rates
                </h2>
                <div className="w-16 h-1 bg-amber-600 mx-auto rounded-full"></div>
                <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed font-mono">
                  Click on any accommodation bracket below to expand full itineraries, transport mediums, hotels, and services. Each package functions completely independently.
                </p>
              </div>

              {/* Accordion List Layout */}
              <div className="space-y-4">
                {packages.map((pkg) => {
                  const isOpen = activeAccordionId === pkg.id;

                  return (
                    <div
                      key={pkg.id}
                      id={`package-accordion-${pkg.id}`}
                      className="editorial-card rounded-2xl overflow-hidden transition-all bg-white"
                    >
                      {/* Accordion Bar Header */}
                      <button
                        id={`accordion-trigger-${pkg.id}`}
                        onClick={() => setActiveAccordionId(isOpen ? null : pkg.id)}
                        className="w-full flex items-center justify-between p-6 hover:bg-stone-50 transition-colors text-left cursor-pointer"
                      >
                        {/* Left Side: Package Price */}
                        <div className="flex items-center gap-4">
                          <span className="text-[#111827] font-mono text-lg font-bold bg-amber-500/10 text-amber-900 border border-amber-500/30 px-4 py-1.5 rounded-xl shrink-0">
                            ${pkg.price}
                          </span>
                          <span className="font-serif font-bold text-emerald-950 text-base md:text-lg italic tracking-tight">
                            {pkg.title}
                          </span>
                        </div>

                        {/* Right Side: Days */}
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-mono text-xs text-stone-500 font-semibold uppercase bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200">
                            {pkg.days} Days
                          </span>
                          <span className="text-stone-400 font-mono text-xs hidden sm:inline">
                            {isOpen ? 'Close' : 'Expand'}
                          </span>
                        </div>
                      </button>

                      {/* Smooth Expanded Section */}
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-stone-50/50 p-6 md:p-8 border-t border-stone-150 space-y-6"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            
                            {/* Itinerary lines */}
                            <div className="space-y-4">
                              <h4 className="text-xs font-mono font-bold tracking-widest text-[#111827] uppercase">Daily Program</h4>
                              <div className="space-y-4 border-l border-emerald-950/20 pl-4 ml-2">
                                {pkg.itinerary && pkg.itinerary.map((line) => (
                                  <div key={line.day} className="relative space-y-1">
                                    <div className="absolute -left-[23px] top-1.5 w-2 h-2 rounded-full bg-emerald-950 border border-emerald-400"></div>
                                    <h5 className="font-sans font-bold text-xs text-emerald-950 uppercase">Day {line.day}: {line.title}</h5>
                                    <p className="text-[11px] text-stone-500 leading-relaxed font-mono">{line.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Specifications */}
                            <div className="space-y-5 text-xs font-mono text-stone-600">
                              <div className="space-y-1.5">
                                <h4 className="font-bold text-[#111827] uppercase text-[10px]">Primary Destinations</h4>
                                <p className="text-xs">{pkg.destinations.join(' • ')}</p>
                              </div>
                              <div className="space-y-1.5">
                                <h4 className="font-bold text-[#111827] uppercase text-[10px]">Luxury Accommodations</h4>
                                <p className="text-xs text-stone-500 leading-relaxed">{pkg.accommodation}</p>
                              </div>
                              <div className="space-y-1.5">
                                <h4 className="font-bold text-[#111827] uppercase text-[10px]">Vehicular Transportation</h4>
                                <p className="text-xs text-stone-500 leading-relaxed">{pkg.transportation}</p>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                  <h4 className="font-bold text-emerald-850 uppercase text-[10px]">What's Included</h4>
                                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-stone-500">
                                    {pkg.included.map((inc, i) => <li key={i}>{inc}</li>)}
                                  </ul>
                                </div>
                                <div className="space-y-1.5">
                                  <h4 className="font-bold text-red-800 uppercase text-[10px]">What's Excluded</h4>
                                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-stone-400">
                                    {pkg.excluded.map((exc, i) => <li key={i}>{exc}</li>)}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Expansion booking button */}
                          <div className="pt-6 border-t border-stone-200 flex items-center justify-between flex-col sm:flex-row gap-4">
                            <p className="text-[10px] text-stone-400 font-mono">Each booking handles custom airport transitions from Kilimanjaro (JRO) or Jomo Kenyatta (NBO).</p>
                            <button
                              id={`accordion-book-${pkg.id}`}
                              onClick={() => handleOpenBooking(pkg.id)}
                              className="px-8 py-3 bg-emerald-950 text-white hover:bg-emerald-850 font-mono font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 cursor-pointer text-center"
                            >
                              Book Now
                            </button>
                          </div>

                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* =========================================
              E. ABOUT US ROUTE VIEW
             ========================================= */}
          {activePage === 'about' && (
            <motion.div
              key="page-about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AboutPage />
            </motion.div>
          )}

          {/* =========================================
              F. CONTACT ROUTE VIEW
             ========================================= */}
          {activePage === 'contact' && (
            <motion.div
              key="page-contact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ContactPage />
            </motion.div>
          )}

          {/* =========================================
              G. AUTHENTICATIONS GATEWAYS
             ========================================= */}
          {activePage === 'login' && (
            <motion.div
              key="page-login"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoginPage 
                onSuccess={() => setActivePage('home')} 
                onGoToRegister={() => setActivePage('register')} 
              />
            </motion.div>
          )}

          {activePage === 'register' && (
            <motion.div
              key="page-register"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <RegisterPage 
                onSuccess={() => setActivePage('home')} 
                onGoToLogin={() => setActivePage('login')} 
              />
            </motion.div>
          )}

          {/* =========================================
              H. ADMIN MANAGEMENT DASHBOARD ROUTE
             ========================================= */}
          {activePage === 'admin' && (
            <motion.div
              key="page-admin-dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AdminDashboard onBackToHome={() => setActivePage('home')} />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* 3. Global Fixed Elements */}
      <FloatingWhatsApp />
      
      {/* 4. Global Page Footer */}
      <Footer setActivePage={(page) => {
        setActivePage(page);
        setSelectedPkgDetails(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />

      {/* 5. Booking Modal Portal */}
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        preSelectedPkgId={bookingPreSelectId}
      />

      {/* 6. Comprehensive Selected Package Details Drawer modal */}
      <AnimatePresence>
        {selectedPkgDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPkgDetails(null)}
              className="absolute inset-0 bg-stone-950/80 backdrop-blur-md"
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white text-stone-900 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-stone-200 z-10 p-6 md:p-8"
            >
              <button
                id="details-close-btn"
                onClick={() => setSelectedPkgDetails(null)}
                className="absolute top-4 right-4 p-1.5 hover:bg-stone-100 rounded-full cursor-pointer border border-stone-200 bg-white"
              >
                <X className="w-5 h-5 text-stone-600" />
              </button>

              <div className="space-y-6">
                <div>
                  <p className="text-[10px] tracking-widest font-mono text-amber-700 font-bold uppercase mb-1">
                    EXCURSION PARAMETERS
                  </p>
                  <h3 className="text-xl md:text-3xl font-extrabold uppercase font-sans tracking-tight text-emerald-950 leading-tight">
                    {selectedPkgDetails.title}
                  </h3>
                  <p className="text-xs text-stone-400 font-mono mt-1 uppercase">
                    {selectedPkgDetails.days} Days • Rate starts at ${selectedPkgDetails.price} USD
                  </p>
                </div>

                <div className="h-56 rounded-2xl overflow-hidden border border-stone-200">
                  <img src={selectedPkgDetails.imageUrl} alt={selectedPkgDetails.title} className="w-full h-full object-cover" />
                </div>

                <div className="space-y-3">
                  <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-stone-600">Summary</h4>
                  <p className="text-xs text-stone-600 leading-relaxed font-sans">{selectedPkgDetails.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-mono pt-3 border-t border-stone-100">
                  <div>
                    <h5 className="font-bold text-stone-600 uppercase text-[10px] mb-1">Coverage</h5>
                    <p className="text-stone-500 overflow-hidden text-ellipsis whitespace-nowrap">{selectedPkgDetails.destinations.join(' • ')}</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-stone-600 uppercase text-[10px] mb-1">Vehicles</h5>
                    <p className="text-stone-500">{selectedPkgDetails.transportation}</p>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    id="details-book-btn"
                    onClick={() => {
                      const id = selectedPkgDetails.id;
                      setSelectedPkgDetails(null);
                      handleOpenBooking(id);
                    }}
                    className="flex-1 py-3 bg-emerald-950 hover:bg-emerald-850 text-white font-mono font-bold text-xs uppercase tracking-widest rounded-xl text-center active:scale-95 transition-all shadow-md cursor-pointer"
                  >
                    Reserve Now
                  </button>
                  <button
                    onClick={() => setSelectedPkgDetails(null)}
                    className="px-6 py-3 border border-stone-250 rounded-xl font-mono text-xs text-stone-600 hover:bg-stone-50 transition-colors uppercase cursor-pointer"
                  >
                    Exit
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
