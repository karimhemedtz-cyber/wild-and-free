/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { User, LogOut, ShieldAlert, Compass } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

interface HeaderProps {
  activePage: string;
  setActivePage: (page: string) => void;
  onOpenBooking: () => void;
}

export default function Header({ activePage, setActivePage, onOpenBooking }: HeaderProps) {
  const { currentUser, signOut } = useApp();

  return (
    <header className="w-full bg-white text-stone-900 border-b border-stone-100 sticky top-0 z-40">
      {/* Top Banner Row */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Empty left spacer to maintain perfect logo balance */}
        <div className="w-40 hidden md:block"></div>

        {/* Center Logo branding - Premium, elegant, italic */}
        <div 
          onClick={() => setActivePage('home')}
          className="flex-1 text-center cursor-pointer group select-none"
        >
          <h1 id="brand-title" className="font-serif italic text-2xl md:text-3xl lg:text-4xl tracking-widest text-emerald-950 font-bold uppercase transition-all duration-300 group-hover:text-amber-800">
            African Wise Warrior Safaris
          </h1>
          <p id="brand-tagline" className="text-[10px] tracking-[0.3em] font-mono font-medium text-amber-800 uppercase mt-1">
            Luxury Eco Expeditions • East Africa
          </p>
        </div>

        {/* Top Right: Authentication Area */}
        <div className="w-auto md:w-auto flex items-center justify-end gap-3 font-mono text-xs">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p id="user-greeting" className="font-semibold text-emerald-950">
                  {currentUser.fullName.split(' ')[0]}
                </p>
                <p id="user-role" className="text-[10px] text-amber-700 font-bold uppercase">
                  {currentUser.role}
                </p>
              </div>

              {currentUser.role === 'admin' && (
                <button
                  id="header-admin-btn"
                  onClick={() => setActivePage('admin')}
                  title="Admin Dashboard"
                  className="p-2 bg-amber-500/10 text-amber-800 rounded-full hover:bg-amber-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4" />
                </button>
              )}

              <button
                id="header-logout-btn"
                onClick={signOut}
                title="Log Out"
                className="p-2 bg-stone-100 text-stone-600 rounded-full hover:bg-stone-200 active:scale-95 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="header-login-btn"
                onClick={() => setActivePage('login')}
                className="px-3 py-1.5 font-medium text-stone-700 hover:text-emerald-950 transition-colors cursor-pointer"
              >
                Login
              </button>
              <button
                id="header-register-btn"
                onClick={() => setActivePage('register')}
                className="px-3 py-1.5 bg-emerald-950 text-white font-medium rounded-full hover:bg-emerald-850 active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Row - Positioned Below the Header */}
      <div className="w-full bg-stone-50 border-t border-stone-100">
        <nav className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-around text-xs md:text-sm tracking-widest font-medium uppercase text-stone-600">
          <button
            id="nav-parks"
            onClick={() => setActivePage('parks')}
            className={`cursor-pointer transition-all duration-200 py-1 border-b-2 hover:text-emerald-950 ${
              activePage === 'parks' || activePage === 'country'
                ? 'text-emerald-950 border-emerald-950 font-semibold' 
                : 'border-transparent text-stone-500'
            }`}
          >
            National Parks
          </button>
          
          <button
            id="nav-packages"
            onClick={() => setActivePage('packages')}
            className={`cursor-pointer transition-all duration-200 py-1 border-b-2 hover:text-emerald-950 ${
              activePage === 'packages'
                ? 'text-emerald-950 border-emerald-950 font-semibold' 
                : 'border-transparent text-stone-500'
            }`}
          >
            Packages
          </button>

          <button
            id="nav-about"
            onClick={() => setActivePage('about')}
            className={`cursor-pointer transition-all duration-200 py-1 border-b-2 hover:text-emerald-950 ${
              activePage === 'about'
                ? 'text-emerald-950 border-emerald-950 font-semibold' 
                : 'border-transparent text-stone-500'
            }`}
          >
            About Us
          </button>

          <button
            id="nav-contact"
            onClick={() => setActivePage('contact')}
            className={`cursor-pointer transition-all duration-200 py-1 border-b-2 hover:text-emerald-950 ${
              activePage === 'contact'
                ? 'text-emerald-950 border-emerald-950 font-semibold' 
                : 'border-transparent text-stone-500'
            }`}
          >
            Contact
          </button>
        </nav>
      </div>

      {/* Language Bar — sits right after the navigation bar.
          Only the translate function itself is exposed here (a clean
          "Select Language" control); none of Google's own UI is shown. */}
      <div className="w-full bg-white border-t border-stone-100">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-end">
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}
