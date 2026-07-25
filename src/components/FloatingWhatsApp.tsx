/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function FloatingWhatsApp() {
  const { settings } = useApp();

  const handleWhatsAppRedirect = () => {
    // Format number to remove any non-numeric characters for the api call
    const cleanNumber = settings.whatsapp.replace(/\D/g, '');
    const message = encodeURIComponent('Hello! I am visiting the African Wise Warrior Safaris website and would love to enquire about luxury safari packages.');
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  return (
    <button
      id="floating-whatsapp-btn"
      onClick={handleWhatsAppRedirect}
      aria-label="Contact us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white p-4 rounded-full shadow-2xl hover:bg-emerald-500 active:scale-95 transition-all group flex items-center justify-center cursor-pointer"
    >
      {/* Decorative pulse glow */}
      <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping -z-10"></span>
      
      <MessageCircle id="whatsapp-icon" className="w-6 h-6 transition-transform group-hover:scale-110" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-out whitespace-nowrap pl-0 group-hover:pl-2 font-medium text-sm">
        Chat Safely
      </span>
    </button>
  );
}
