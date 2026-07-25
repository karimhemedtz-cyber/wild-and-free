/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Phone, Mail, MessageSquare, MapPin, Send, CheckCircle, Facebook, Instagram, Twitter, Compass } from 'lucide-react';

export default function ContactPage() {
  const { settings, submitContactMessage } = useApp();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    
    setIsSubmitting(true);
    try {
      await submitContactMessage(name, email, message);
      setIsSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      console.error(err);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cleanPhone = settings.phone.replace(/\D/g, '');
  const cleanWhatsapp = settings.whatsapp.replace(/\D/g, '');

  return (
    <div className="w-full bg-white text-stone-900 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Left Side: Contact details & Google Maps card (5 Columns) */}
        <div className="lg:col-span-5 space-y-10">
          
          {/* Header */}
          <div className="space-y-3">
            <p className="text-[11px] tracking-[0.4em] font-mono text-amber-800 uppercase font-bold">
              GET IN TOUCH ANYTIME
            </p>
            <h1 id="contact-headline" className="text-3xl md:text-5xl font-normal font-serif text-emerald-950 italic">
              Reach our desk
            </h1>
            <div className="w-16 h-1 bg-amber-600 rounded-full"></div>
            <p className="text-sm text-stone-500 max-w-sm leading-relaxed">
              We operate around the clock from our main offices in Arusha, Tanzania and Nairobi, Kenya. Our private concierge desk handles pick-ups, flights, lodging, and special tracking requests.
            </p>
          </div>

          {/* Action-Clickable Touchpoints */}
          <div className="space-y-4">
            
            {/* Phone */}
            <a
              id="contact-call-btn"
              href={`tel:${cleanPhone}`}
              className="flex items-center gap-4 p-4 rounded-2xl editorial-card transition-all cursor-pointer group"
            >
              <div className="p-3 bg-amber-50 text-amber-700 rounded-xl group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-stone-400 font-mono uppercase font-bold">Direct Phone Reservation</p>
                <p className="text-sm font-semibold tracking-wide text-zinc-900">{settings.phone}</p>
                <p className="text-[10px] text-zinc-500 font-mono">Tap to initiate call</p>
              </div>
            </a>

            {/* WhatsApp */}
            <a
              id="contact-whatsapp-btn"
              href={`https://wa.me/${cleanWhatsapp}?text=Web%20Enquiry`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 p-4 rounded-2xl editorial-card transition-all cursor-pointer group"
            >
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl group-hover:scale-110 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-stone-400 font-mono uppercase font-bold">WhatsApp Concierge Desk</p>
                <p className="text-sm font-semibold tracking-wide text-zinc-900">{settings.whatsapp}</p>
                <p className="text-[10px] text-zinc-500 font-mono">Instant chat replies 24/7</p>
              </div>
            </a>

            {/* Email */}
            <a
              id="contact-email-btn"
              href={`mailto:${settings.email}`}
              className="flex items-center gap-4 p-4 rounded-2xl editorial-card transition-all cursor-pointer group"
            >
              <div className="p-3 bg-blue-50 text-blue-700 rounded-xl group-hover:scale-110 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-stone-400 font-mono uppercase font-bold">Email Communications</p>
                <p className="text-sm font-semibold tracking-wide text-zinc-900 break-all">{settings.email}</p>
                <p className="text-[10px] text-zinc-500 font-mono">Official proposals & receipts</p>
              </div>
            </a>

            {/* Arusha Headquarters Location */}
            <div className="flex items-center gap-4 p-4 rounded-2xl editorial-card">
              <div className="p-3 bg-stone-100 text-stone-600 rounded-xl">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-stone-400 font-mono uppercase font-bold">Physical Headquarters</p>
                <p className="text-sm font-semibold text-zinc-900">Arusha Safari Center, Room 14B</p>
                <p className="text-[10px] text-zinc-500 font-mono">Arusha, Tanzania</p>
              </div>
            </div>
          </div>

          {/* Social Media Linkages */}
          <div className="space-y-2.5">
            <p className="text-[10px] tracking-widest text-stone-400 font-mono uppercase font-bold">
              Follow Our Field Trackers:
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com" className="p-3 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer text-stone-700">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" className="p-3 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer text-stone-700">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" className="p-3 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer text-stone-700">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Side: Contact input Form & Custom Styled Map Frame (7 Columns) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Interactive Form Card */}
          <div className="p-6 md:p-8 editorial-card rounded-3xl space-y-6">
            <div className="space-y-1.5">
              <h3 className="font-serif italic text-lg text-emerald-950 font-bold uppercase tracking-wide">
                Bespoke Safari Enquiry Form
              </h3>
              <p className="text-xs text-stone-500">
                Submit an enquiry below, and we will get back to you immediately.
              </p>
            </div>

            {isSuccess ? (
              <div className="py-6 text-center space-y-4">
                <div className="inline-flex p-3 bg-emerald-100 text-emerald-800 rounded-full">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <h4 className="font-sans font-bold text-lg text-stone-900">Enquiry Submitted!</h4>
                <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed font-mono">
                  Thank you! Your message has been safely logged in our database. Our private travel concierge will reach out to you within the hours.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="px-6 py-2 bg-emerald-950 text-white font-mono text-xs font-semibold rounded-lg hover:bg-emerald-850 transition-colors uppercase cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
                      Your Name
                    </label>
                    <input
                      id="contact-input-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="E.g. Sarah Jenkins"
                      className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none transition-all placeholder:text-stone-300 font-sans"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
                      Your Email Address
                    </label>
                    <input
                      id="contact-input-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sarah.j@example.com"
                      className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none transition-all placeholder:text-stone-300 font-sans"
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
                    How can our Wise Warriors assist you?
                  </label>
                  <textarea
                    id="contact-input-msg"
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your ideal safari itinerary, budget expectations, physical conditions and animal tracking targets..."
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none transition-all placeholder:text-stone-300 font-sans"
                  ></textarea>
                </div>

                <button
                  id="contact-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3.5 bg-emerald-950 hover:bg-emerald-850 text-white font-bold tracking-widest uppercase rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 w-full cursor-pointer"
                >
                  {isSubmitting ? 'Sending Request...' : 'Send Bespoke Enquiry'}
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* Interactive Styled Map Card Frame Container */}
          <div className="p-4 editorial-card rounded-3xl space-y-3">
            <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono uppercase font-bold">
              <span>Arusha HQ Map Coordinates</span>
              <span className="text-emerald-800 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 animate-spin" /> GPS: -3.3731° S, 36.6853° E
              </span>
            </div>
            {/* Standard embedded preview card that renders beautifully */}
            <div className="h-60 rounded-2xl overflow-hidden shadow-inner border border-stone-200 relative bg-stone-200">
              <iframe
                title="Arusha Headquarters"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15941.520247659567!2d36.6830722!3d-3.3719097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x18473da91428f52f%3A0xc3c513e9a7852c03!2sArusha%2C%20Tanzania!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                className="w-full h-full border-y-0"
                loading="lazy"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
