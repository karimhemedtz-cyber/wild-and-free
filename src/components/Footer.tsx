/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { Phone, Mail, MessageSquare, Compass, ShieldCheck } from 'lucide-react';

interface FooterProps {
  setActivePage: (page: string) => void;
}

export default function Footer({ setActivePage }: FooterProps) {
  const { settings } = useApp();

  return (
    <footer className="w-full bg-stone-950 text-stone-400 font-mono text-xs border-t border-stone-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Column 1: Branding and description */}
        <div className="space-y-4">
          <h3 
            onClick={() => setActivePage('home')}
            className="font-serif italic text-lg text-stone-50 font-bold uppercase tracking-wider cursor-pointer"
          >
            African Wise Warrior Safaris
          </h3>
          <p className="text-[11px] leading-relaxed text-stone-500">
            Enabling authentic, deeply customized luxury safari expeditions in East Africas most pristine reserves. Guided by ancient ancestral wisdom and modern luxury preservation.
          </p>
          <div className="flex items-center gap-2 text-[10px] text-amber-500 font-semibold uppercase">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Certified Luxury Operator
          </div>
        </div>

        {/* Column 2: Navigation links */}
        <div className="space-y-4">
          <h4 className="text-stone-300 font-bold uppercase tracking-widest text-xs">Excursions</h4>
          <ul className="space-y-2.5 text-[11px]">
            <li>
              <button onClick={() => setActivePage('parks')} className="hover:text-amber-500 transition-colors uppercase tracking-wider cursor-pointer text-left">
                National Parks Guide
              </button>
            </li>
            <li>
              <button onClick={() => setActivePage('packages')} className="hover:text-amber-500 transition-colors uppercase tracking-wider cursor-pointer text-left">
                Luxury Packages Rates
              </button>
            </li>
            <li>
              <button onClick={() => setActivePage('about')} className="hover:text-amber-500 transition-colors uppercase tracking-wider cursor-pointer text-left">
                Story & DNA
              </button>
            </li>
            <li>
              <button onClick={() => setActivePage('contact')} className="hover:text-amber-500 transition-colors uppercase tracking-wider cursor-pointer text-left">
                Contact Desk
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Countries Covered */}
        <div className="space-y-4">
          <h4 className="text-stone-300 font-bold uppercase tracking-widest text-xs">Countries Available</h4>
          <ul className="space-y-2.5 text-[11px] text-stone-500">
            <li className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-emerald-500" />
              Tanzania (Serengeti, Ngorongoro)
            </li>
            <li className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-emerald-500" />
              Kenya (Maasai Mara, Amboseli)
            </li>
            <li className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-emerald-500" />
              Uganda (Bwindi Gorillas, Queen Elizabeth)
            </li>
          </ul>
        </div>

        {/* Column 4: Contact details */}
        <div className="space-y-4">
          <h4 className="text-stone-300 font-bold uppercase tracking-widest text-xs">Direct Support</h4>
          <ul className="space-y-2.5 text-[11px]">
            <li className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-amber-500" />
              <a href={`tel:${settings.phone}`} className="hover:text-amber-500 transition-colors">
                {settings.phone} (Call)
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
              <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`} className="hover:text-amber-500 transition-colors">
                {settings.whatsapp} (WhatsApp)
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-amber-500" />
              <a href={`mailto:${settings.email}`} className="hover:text-amber-500 transition-colors break-all">
                {settings.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Decorative credit lines */}
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between text-[10px] text-stone-600 space-y-4 sm:space-y-0">
        <p>© 2026 African Wise Warrior Safaris Ltd. All rights reserved.</p>
        <p className="tracking-widest capitalize">Luxury Eco Lodges • Arusha • Nairobi • Kampala</p>
      </div>
    </footer>
  );
}
