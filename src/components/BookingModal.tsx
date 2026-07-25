/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Users, Phone, Mail, User, MessageSquare, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedPkgId?: string;
}

export default function BookingModal({ isOpen, onClose, preSelectedPkgId }: BookingModalProps) {
  const { packages, createBooking, currentUser } = useApp();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [packageId, setPackageId] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [travelDate, setTravelDate] = useState('');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Prefill details if user is logged in
  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName);
      setEmail(currentUser.email);
      setPhoneNumber(currentUser.phoneNumber || '');
    }
  }, [currentUser, isOpen]);

  // Handle auto pre-selection logic
  useEffect(() => {
    if (preSelectedPkgId) {
      setPackageId(preSelectedPkgId);
    } else if (packages.length > 0 && !packageId) {
      setPackageId(packages[0].id);
    }
  }, [preSelectedPkgId, packages, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phoneNumber || !packageId || !travelDate) {
      alert('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    
    // Find selected package title
    const selectedPkg = packages.find(p => p.id === packageId);
    const packageTitle = selectedPkg ? selectedPkg.title : 'Custom Custom Safari Expedition';

    try {
      await createBooking({
        fullName,
        email,
        phoneNumber,
        packageId,
        packageTitle,
        travelers,
        travelDate,
        message
      });
      
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      alert('An error occurred during booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFullName(currentUser?.fullName || '');
    setEmail(currentUser?.email || '');
    setPhoneNumber(currentUser?.phoneNumber || '');
    setPackageId(preSelectedPkgId || (packages[0]?.id || ''));
    setTravelers(1);
    setTravelDate('');
    setMessage('');
    setIsSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Dark backdrop blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-stone-950/80 backdrop-blur-md"
        ></motion.div>

        {/* Modal Main container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white text-stone-900 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-stone-100 z-10"
        >
          {/* Header Row */}
          <div className="bg-emerald-950 text-white px-6 py-5 flex items-center justify-between border-b border-emerald-900">
            <div>
              <p className="text-[10px] tracking-[0.2em] font-mono text-amber-500 uppercase font-semibold">
                Expedition Reservation
              </p>
              <h2 id="booking-modal-title" className="text-xl md:text-2xl font-serif font-bold italic tracking-wider">
                Book Your Wise Warrior Safari
              </h2>
            </div>
            <button
              id="booking-close-btn"
              onClick={handleClose}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 text-stone-200" />
            </button>
          </div>

          <div className="p-6 md:p-8 max-h-[75vh] overflow-y-auto">
            {isSuccess ? (
              /* Success State */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-6 max-w-md mx-auto"
              >
                <div className="inline-flex p-4 bg-emerald-50 text-emerald-600 rounded-full">
                  <CheckCircle className="w-16 h-16 animate-pulse" />
                </div>
                <h3 id="booking-success-headline" className="text-2xl font-sans font-bold text-stone-900">
                  Safari Booking Registered!
                </h3>
                <p id="booking-success-desc" className="text-sm text-stone-600 leading-relaxed font-mono">
                  Thank you, <span className="font-semibold text-emerald-950">{fullName}</span>. Your custom request has been recorded securely. Our professional wildlife trackers will contact you at <span className="font-semibold text-emerald-950">{email}</span> within 12 hours with a bespoke proposal.
                </p>
                <button
                  id="booking-success-close-btn"
                  onClick={handleClose}
                  className="px-8 py-3 bg-emerald-950 text-white font-mono font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-emerald-850 active:scale-95 transition-all w-full cursor-pointer"
                >
                  Return to Explorer
                </button>
              </motion.div>
            ) : (
              /* Booking Input Fields */
              <form onSubmit={handleSubmit} className="space-y-5 text-sm">
                
                {/* Full name input */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label id="lbl-fullname" className="block text-xs font-semibold uppercase font-mono tracking-widest text-stone-600">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        id="booking-input-name"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Dr. Sarah Jenkins"
                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none transition-all placeholder:text-stone-400"
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <label id="lbl-email" className="block text-xs font-semibold uppercase font-mono tracking-widest text-stone-600">
                      Email address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        id="booking-input-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="sarah.j@example.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none transition-all placeholder:text-stone-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Phone input */}
                  <div className="space-y-1.5">
                    <label id="lbl-phone" className="block text-xs font-semibold uppercase font-mono tracking-widest text-stone-600">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        id="booking-input-phone"
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="0750916698"
                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none transition-all placeholder:text-stone-400"
                      />
                    </div>
                  </div>

                  {/* Travel Date */}
                  <div className="space-y-1.5">
                    <label id="lbl-date" className="block text-xs font-semibold uppercase font-mono tracking-widest text-stone-600">
                      Travel Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                      <input
                        id="booking-input-date"
                        type="date"
                        required
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none transition-all text-stone-700"
                      />
                    </div>
                  </div>
                </div>

                {/* Combined Package selection & Travelers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Package Selector */}
                  <div className="space-y-1.5">
                    <label id="lbl-pkg" className="block text-xs font-semibold uppercase font-mono tracking-widest text-stone-600">
                      Selected Luxury Package *
                    </label>
                    <select
                      id="booking-input-pkg"
                      required
                      value={packageId}
                      onChange={(e) => setPackageId(e.target.value)}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none transition-all text-stone-700 cursor-pointer"
                    >
                      {packages.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.title} (${p.price} • {p.days} Days)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Number of Travelers */}
                  <div className="space-y-1.5">
                    <label id="lbl-travelers" className="block text-xs font-semibold uppercase font-mono tracking-widest text-stone-600">
                      Number of Travelers *
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        id="booking-input-travelers"
                        type="number"
                        min="1"
                        max="24"
                        required
                        value={travelers}
                        onChange={(e) => setTravelers(parseInt(e.target.value) || 1)}
                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Optional Message text-area */}
                <div className="space-y-1.5">
                  <label id="lbl-message" className="block text-xs font-semibold uppercase font-mono tracking-widest text-stone-600">
                    Bespoke Expedition Requirements / Messages
                  </label>
                  <div className="relative" id="booking-msg-container">
                    <MessageSquare className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                    <textarea
                      id="booking-input-msg"
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share dietary restrictions, physical guidelines, or custom activities like balloon flights and specific animal photography priorities."
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none transition-all placeholder:text-stone-400"
                    ></textarea>
                  </div>
                </div>

                {/* Booking Pricing Summary Indicator */}
                {packageId && (
                  <div id="booking-total-calc" className="p-4 bg-emerald-50 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs text-emerald-800 font-mono font-medium">ESTIMATED SAFARI TOTAL</p>
                      <p className="text-[10px] text-emerald-700/70 font-mono">Based on selected luxury package rate</p>
                    </div>
                    <div className="text-right">
                      <p id="calc-price" className="text-2xl font-black text-emerald-950">
                        ${(packages.find(p => p.id === packageId)?.price || 0) * travelers}
                      </p>
                      <p className="text-[9px] font-semibold text-amber-700 font-mono uppercase">
                        All accommodations, transfers & food included
                      </p>
                    </div>
                  </div>
                )}

                {/* Submission CTA Button */}
                <button
                  id="booking-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-emerald-950 hover:bg-emerald-850 disabled:bg-stone-300 text-white font-mono font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer"
                >
                  {isSubmitting ? 'Registering Safari...' : 'Confirm Reservation'}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
