/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { Package, NationalPark, Country, Booking, ContactMessage } from '../types';
import { 
  ClipboardList, PackageOpen, Trees, FileText, PhoneCall, 
  Trash2, Plus, Edit, CheckCircle, XCircle, ArrowLeft,
  ChevronRight, Save, Image, RefreshCw, AlertTriangle, Upload, X,
  Users as UsersIcon, ShieldCheck
} from 'lucide-react';

// ─── Sehemu ya kupakia picha kwa kubonyeza au kutumia URL ───────────────────
interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
  id?: string;
  hideUrlInput?: boolean;
  selectButtonLabel?: string;
}

function ImageUploadField({ label, value, onChange, required, id, hideUrlInput, selectButtonLabel }: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    onChange(objectUrl);
  };

  return (
    <div className="space-y-1">
      <label className="font-bold text-stone-600 uppercase text-xs">{label}{required && ' *'}</label>
      
      {/* Picha iliyochaguliwa - preview */}
      {value && (
        <div className="relative w-full h-28 rounded-xl overflow-hidden border border-stone-200 mb-2 group">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-1 right-1 p-1 bg-stone-900/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            title="Futa picha"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Buttons: Chagua faili au weka URL */}
      <div className="flex gap-2 items-center">
        {/* Bonyeza kuchagua picha kutoka kwenye kifaa */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-3 py-2 bg-emerald-950 text-white rounded-lg font-mono text-[10px] uppercase hover:bg-emerald-800 transition-colors cursor-pointer whitespace-nowrap"
        >
          <Upload className="w-3.5 h-3.5" />
          {selectButtonLabel || 'Chagua Picha'}
        </button>
        
        {/* Au weka URL kwa maandishi (optional - can be hidden) */}
        {!hideUrlInput && (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="au bandika URL ya picha..."
            className="flex-1 p-2 bg-white border border-stone-200 rounded-lg text-xs font-mono"
          />
        )}
        
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          id={id}
        />
      </div>
    </div>
  );
}
// ────────────────────────────────────────────────────────────────────────────

interface AdminDashboardProps {
  onBackToHome: () => void;
}

export default function AdminDashboard({ onBackToHome }: AdminDashboardProps) {
  const { 
    currentUser, countries, parks, packages, bookings, messages, settings,
    updateSettings, addAboutSliderImage, removeAboutSliderImage,
    addPackage, updatePackage, deletePackage,
    addCountry, deleteCountry, addPark, updatePark, deletePark,
    updateBookingStatus, deleteBooking, deleteMessage,
    addAdminUser, adminUsersList
  } = useApp();

  const [activeTab, setActiveTab] = useState<'bookings' | 'packages' | 'parks' | 'about' | 'contact' | 'messages' | 'users'>('bookings');

  // Form States - Packages Management
  const [pkgTitle, setPkgTitle] = useState('');
  const [pkgDesc, setPkgDesc] = useState('');
  const [pkgPrice, setPkgPrice] = useState(600);
  const [pkgDays, setPkgDays] = useState(3);
  const [pkgImg, setPkgImg] = useState('https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=1000');
  const [pkgDestinations, setPkgDestinations] = useState('Serengeti, Ngorongoro');
  const [pkgAccomm, setPkgAccomm] = useState('Wise Warrior Camp');
  const [pkgTransp, setPkgTransp] = useState('4x4 Land Cruiser');
  const [pkgIncl, setPkgIncl] = useState('Meals, Water, Entry Fees');
  const [pkgExcl, setPkgExcl] = useState('Flights, Visas, Driver Tips');
  const [pkgActs, setPkgActs] = useState('Game Drives, Cultural Visits');
  const [editingPkgId, setEditingPkgId] = useState<string | null>(null);

  // Daily Itinerary Builder — admin clicks "Add Day" to reveal Day 1, Day 2, etc.
  // Each day gets its own description box; new days are appended at the bottom.
  const [pkgItinerary, setPkgItinerary] = useState<{ day: number; description: string }[]>([]);

  const handleAddItineraryDay = () => {
    setPkgItinerary((prev) => [...prev, { day: prev.length + 1, description: '' }]);
  };

  const handleUpdateItineraryDay = (index: number, description: string) => {
    setPkgItinerary((prev) => prev.map((d, i) => (i === index ? { ...d, description } : d)));
  };

  const handleRemoveItineraryDay = (index: number) => {
    setPkgItinerary((prev) =>
      prev.filter((_, i) => i !== index).map((d, i) => ({ ...d, day: i + 1 }))
    );
  };

  // Form States - Country
  const [newCountryName, setNewCountryName] = useState('');
  const [newCountryImg, setNewCountryImg] = useState('https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=1200');

  // Form States - Parks
  const [parkName, setParkName] = useState('');
  const [parkCountry, setParkCountry] = useState('tanzania');
  const [parkDesc, setParkDesc] = useState('');
  const [parkActs, setParkActs] = useState('Game Drive, Balloon, Hiking');
  const [parkSeason, setParkSeason] = useState('June to October');
  const [parkLoc, setParkLoc] = useState('Northern Tanzania');
  const [parkImg, setParkImg] = useState('https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1000');

  // Form States - About Info
  const [story, setStory] = useState(settings.aboutStory);
  const [mission, setMission] = useState(settings.aboutMission);
  const [vision, setVision] = useState(settings.aboutVision);
  const [newSliderImg, setNewSliderImg] = useState('');

  // Form States - Contacts
  const [phone, setPhone] = useState(settings.phone);
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp);
  const [email, setEmail] = useState(settings.email);

  // Form States - Admin Users management
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [adminUserError, setAdminUserError] = useState('');
  const [adminUserSuccess, setAdminUserSuccess] = useState('');
  const [savingAdminUser, setSavingAdminUser] = useState(false);

  // On small screens, tapping a message opens it as its own page (with a
  // back arrow to return) instead of expanding inline at the bottom of the list.
  const [viewingMessage, setViewingMessage] = useState<typeof messages[number] | null>(null);

  // Authorization check
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-24 p-8 bg-white border border-stone-200 rounded-3xl shadow-xl text-center space-y-6">
        <div className="inline-flex p-4 bg-amber-50 text-amber-700 rounded-full">
          <AlertTriangle className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-serif italic text-emerald-950 font-bold uppercase">
          Access Denied
        </h2>
        <p className="text-xs text-stone-500 font-mono leading-relaxed">
          The Admin Dashboard is locked. Please sign in to an authorized administrator account to view corporate diagnostics.
        </p>
        <button
          onClick={onBackToHome}
          className="px-6 py-2 bg-emerald-950 text-white font-mono text-xs uppercase rounded-lg hover:bg-emerald-850 cursor-pointer"
        >
          Return Home
        </button>
      </div>
    );
  }

  // Handle Package additions (and inline editing updates)
  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkgTitle || !pkgDesc) return;

    const formattedPkgData = {
      title: pkgTitle,
      description: pkgDesc,
      price: Number(pkgPrice),
      days: Number(pkgDays),
      // Use the day-by-day itinerary the admin built manually below.
      // Falls back to a single placeholder day if none were added yet.
      itinerary: (pkgItinerary.length > 0 ? pkgItinerary : [{ day: 1, description: '' }]).map((d) => ({
        day: d.day,
        title: `Day ${d.day}`,
        description: d.description
      })),
      destinations: pkgDestinations.split(',').map(s => s.trim()),
      accommodation: pkgAccomm,
      transportation: pkgTransp,
      included: pkgIncl.split(',').map(s => s.trim()),
      excluded: pkgExcl.split(',').map(s => s.trim()),
      activities: pkgActs.split(',').map(s => s.trim()),
      imageUrl: pkgImg
    };

    if (editingPkgId) {
      await updatePackage(editingPkgId, formattedPkgData);
      setEditingPkgId(null);
    } else {
      await addPackage(formattedPkgData);
    }

    // Reset Package form fields
    setPkgTitle('');
    setPkgDesc('');
    setPkgPrice(600);
    setPkgDays(3);
    setPkgImg('https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=1000');
    setPkgDestinations('Serengeti, Ngorongoro');
    setPkgAccomm('Wise Warrior Camp');
    setPkgTransp('4x4 Land Cruiser');
    setPkgIncl('Meals, Water, Entry Fees');
    setPkgExcl('Flights, Visas, Driver Tips');
    setPkgActs('Game drives, Cultural visits');
    setPkgItinerary([]);
  };

  // Turn on edit mode for a package
  const handleEditPkgClick = (pkg: Package) => {
    setEditingPkgId(pkg.id);
    setPkgTitle(pkg.title);
    setPkgDesc(pkg.description);
    setPkgPrice(pkg.price);
    setPkgDays(pkg.days);
    setPkgImg(pkg.imageUrl);
    setPkgDestinations(pkg.destinations.join(', '));
    setPkgAccomm(pkg.accommodation);
    setPkgTransp(pkg.transportation);
    setPkgIncl(pkg.included.join(', '));
    setPkgExcl(pkg.excluded.join(', '));
    setPkgActs(pkg.activities.join(', '));
    setPkgItinerary(
      (pkg.itinerary || []).map((d, i) => ({ day: d.day || i + 1, description: d.description || '' }))
    );
  };

  // Add a new country card
  const handleAddCountry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCountryName) return;
    await addCountry(newCountryName, newCountryImg);
    setNewCountryName('');
    setNewCountryImg('https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=1200');
  };

  // Add a national park
  const handleAddPark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parkName || !parkDesc) return;

    await addPark({
      name: parkName,
      countryId: parkCountry,
      description: parkDesc,
      activities: parkActs.split(',').map(s => s.trim()),
      bestSeason: parkSeason,
      location: parkLoc,
      imageUrl: parkImg,
      gallery: []
    });

    setParkName('');
    setParkDesc('');
    setParkActs('Game Drive, Balloon, Hiking');
    setParkSeason('June to October');
    setParkLoc('Northern Tanzania');
    setParkImg('https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1000');
  };

  // Save About stories
  const handleSaveAbout = async () => {
    await updateSettings({
      aboutStory: story,
      aboutMission: mission,
      aboutVision: vision
    });
    alert('Corporate About details persisted successfully.');
  };

  // Save Hotlines
  const handleSaveContacts = async () => {
    await updateSettings({
      phone,
      whatsapp,
      email
    });
    alert('Support contact details persisted successfully.');
  };

  // Add a new administrator account — they can then log in (email + password +
  // emailed OTP) and will land directly in this Admin Dashboard.
  const handleAddAdminUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName || !newAdminEmail || !newAdminPassword) return;
    setAdminUserError('');
    setAdminUserSuccess('');
    setSavingAdminUser(true);

    const res = await addAdminUser(newAdminName, newAdminEmail, newAdminPassword);
    setSavingAdminUser(false);

    if (res.success) {
      setAdminUserSuccess(`${newAdminName} was added as an administrator.`);
      setNewAdminName('');
      setNewAdminEmail('');
      setNewAdminPassword('');
    } else {
      setAdminUserError(res.error || 'Could not add this administrator.');
    }
  };

  // Add an image to the About automatic slider
  const handleAddSliderImg = async () => {
    if (!newSliderImg) return;
    await addAboutSliderImage(newSliderImg);
    setNewSliderImg('');
  };

  // Dedicated message detail "page" — used on small screens instead of
  // expanding the message inline at the bottom of the list.
  if (viewingMessage) {
    return (
      <div className="w-full bg-stone-50 text-stone-900 min-h-screen py-8">
        <div className="max-w-2xl mx-auto px-6">
          <button
            id="message-detail-back-btn"
            onClick={() => setViewingMessage(null)}
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-stone-600 hover:text-emerald-950 mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Admin Dashboard
          </button>

          <div className="bg-white border border-stone-200 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-stone-900 text-lg">{viewingMessage.name}</p>
                <p className="text-xs text-stone-400 font-mono">{viewingMessage.email}</p>
              </div>
              <button
                id="message-detail-delete-btn"
                onClick={() => {
                  deleteMessage(viewingMessage.id);
                  setViewingMessage(null);
                }}
                className="p-2 bg-stone-50 text-stone-400 hover:text-red-600 rounded-lg border border-stone-200 cursor-pointer"
                title="Delete Message"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-stone-400 font-mono">
              {new Date(viewingMessage.createdAt).toLocaleString()}
            </p>
            <p className="text-sm text-stone-700 leading-relaxed font-sans whitespace-pre-wrap">
              {viewingMessage.message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-stone-50 text-stone-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Superior Header panel */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-stone-250 pb-6 mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-700 font-mono text-xs uppercase font-bold">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Administrator Terminal Live
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight uppercase font-sans text-stone-900 mt-1">
              Command Console
            </h1>
          </div>

          <button
            id="admin-home-btn"
            onClick={onBackToHome}
            className="px-5 py-2.5 bg-emerald-950 text-white font-mono text-xs uppercase tracking-widest rounded-xl hover:bg-emerald-850 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Exit Console
          </button>
        </div>

        {/* Dashboard Grid split: Sidebar options (3 Cols) vs Form workspace (9 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Tabs (3 Columns) */}
          <nav className="lg:col-span-3 flex flex-col gap-1 text-xs font-mono font-medium uppercase text-stone-600 bg-white p-4 border border-stone-200 rounded-3xl shadow-sm">
            
            <p className="px-3 py-2 text-[10px] tracking-wider text-stone-400 font-bold">Diagnostics</p>
            
            <button
              id="tab-bookings"
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-3 rounded-xl flex items-center gap-3 transition-colors text-left cursor-pointer ${
                activeTab === 'bookings' ? 'bg-emerald-950 text-white font-semibold' : 'hover:bg-stone-100'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              Bookings ({bookings.length})
            </button>

            <button
              id="tab-messages"
              onClick={() => setActiveTab('messages')}
              className={`px-4 py-3 rounded-xl flex items-center gap-3 transition-colors text-left cursor-pointer ${
                activeTab === 'messages' ? 'bg-emerald-950 text-white font-semibold' : 'hover:bg-stone-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              Messages ({messages.length})
            </button>

            <p className="px-3 py-2 text-[10px] tracking-wider text-stone-400 font-bold mt-4">Inventory Management</p>

            <button
              id="tab-packages"
              onClick={() => setActiveTab('packages')}
              className={`px-4 py-3 rounded-xl flex items-center gap-3 transition-colors text-left cursor-pointer ${
                activeTab === 'packages' ? 'bg-emerald-950 text-white font-semibold' : 'hover:bg-stone-100'
              }`}
            >
              <PackageOpen className="w-4 h-4" />
              Safari Packages
            </button>

            <button
              id="tab-parks"
              onClick={() => setActiveTab('parks')}
              className={`px-4 py-3 rounded-xl flex items-center gap-3 transition-colors text-left cursor-pointer ${
                activeTab === 'parks' ? 'bg-emerald-950 text-white font-semibold' : 'hover:bg-stone-100'
              }`}
            >
              <Trees className="w-4 h-4" />
              Parks & Countries
            </button>

            <p className="px-3 py-2 text-[10px] tracking-wider text-stone-400 font-bold mt-4">Corporate Info</p>

            <button
              id="tab-about"
              onClick={() => setActiveTab('about')}
              className={`px-4 py-3 rounded-xl flex items-center gap-3 transition-colors text-left cursor-pointer ${
                activeTab === 'about' ? 'bg-emerald-950 text-white font-semibold' : 'hover:bg-stone-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              About Story & Slider
            </button>

            <button
              id="tab-contact"
              onClick={() => setActiveTab('contact')}
              className={`px-4 py-3 rounded-xl flex items-center gap-3 transition-colors text-left cursor-pointer ${
                activeTab === 'contact' ? 'bg-emerald-950 text-white font-semibold' : 'hover:bg-stone-100'
              }`}
            >
              <PhoneCall className="w-4 h-4" />
              Hotlines & Support
            </button>

            <button
              id="tab-users"
              onClick={() => setActiveTab('users')}
              className={`px-4 py-3 rounded-xl flex items-center gap-3 transition-colors text-left cursor-pointer ${
                activeTab === 'users' ? 'bg-emerald-950 text-white font-semibold' : 'hover:bg-stone-100'
              }`}
            >
              <UsersIcon className="w-4 h-4" />
              Users
            </button>
          </nav>

          {/* Form workspace (9 Columns) */}
          <main className="lg:col-span-9 bg-white p-6 md:p-8 rounded-3xl border border-stone-200 shadow-sm">
            
            {/* 1. BOOKINGS REQUESTS TAB */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold font-sans tracking-tight uppercase">Guest Registrations ({bookings.length})</h2>
                  <p className="text-xs text-stone-500 font-mono">Approve, deny, or manage incoming traveler requests.</p>
                </div>

                <div className="overflow-x-auto">
                  {bookings.length === 0 ? (
                    <p className="py-8 text-center text-xs text-stone-400 font-mono">No bookings logged yet.</p>
                  ) : (
                    <table className="w-full text-left text-xs text-stone-600 border-collapse">
                      <thead>
                        <tr className="border-b border-stone-200 bg-stone-50 font-mono uppercase tracking-wider text-[10px]">
                          <th className="p-3">Guest Details</th>
                          <th className="p-3">Requested Safari</th>
                          <th className="p-3">Passengers & Date</th>
                          <th className="p-3">State</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {bookings.map((bk) => (
                          <tr key={bk.id} id={`booking-row-${bk.id}`} className="hover:bg-stone-50/50">
                            <td className="p-3 space-y-1">
                              <p className="font-bold text-stone-900 text-sm">{bk.fullName}</p>
                              <p className="font-mono text-[10px] text-stone-500">{bk.email}</p>
                              <p className="font-mono text-[10px] text-stone-500">{bk.phoneNumber}</p>
                            </td>
                            <td className="p-3">
                              <p className="font-medium text-emerald-900">{bk.packageTitle}</p>
                              {bk.message && (
                                <p className="text-[10px] text-stone-400 mt-1 italic max-w-xs">{bk.message}</p>
                              )}
                            </td>
                            <td className="p-3 font-mono">
                              <p className="font-semibold text-stone-850">{bk.travelers} Guests</p>
                              <p className="text-[11px] text-stone-400">{bk.travelDate}</p>
                            </td>
                            <td className="p-3">
                              <span className={`px-2.5 py-1 rounded-full font-mono font-bold text-[10px] uppercase border ${
                                bk.status === 'confirmed' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' :
                                bk.status === 'cancelled' ? 'bg-red-50 text-red-800 border-red-100' :
                                'bg-yellow-50 text-yellow-800 border-yellow-100'
                              }`}>
                                {bk.status}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {bk.status === 'pending' && (
                                  <button
                                    id={`bk-approve-${bk.id}`}
                                    onClick={() => updateBookingStatus(bk.id, 'confirmed')}
                                    title="Approve"
                                    className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg cursor-pointer"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                )}
                                {bk.status === 'pending' && (
                                  <button
                                    id={`bk-cancel-${bk.id}`}
                                    onClick={() => updateBookingStatus(bk.id, 'cancelled')}
                                    title="Cancel"
                                    className="p-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg cursor-pointer"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  id={`bk-delete-${bk.id}`}
                                  onClick={() => deleteBooking(bk.id)}
                                  title="Delete Record"
                                  className="p-1.5 bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-red-600 rounded-lg cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* 2. MESSAGES TAB */}
            {activeTab === 'messages' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold font-sans tracking-tight uppercase">Contact Messages ({messages.length})</h2>
                  <p className="text-xs text-stone-500 font-mono">Review messages submitted through the Contact Desk.</p>
                </div>

                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <p className="py-8 text-center text-xs text-stone-400 font-mono">No direct messages logged.</p>
                  ) : (
                    messages.map((m) => (
                      <React.Fragment key={m.id}>
                        {/* Desktop / tablet: full message shown inline, no extra tap needed */}
                        <div className="hidden sm:block p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-2 relative group">
                          <button
                            id={`msg-delete-${m.id}`}
                            onClick={() => deleteMessage(m.id)}
                            className="absolute top-4 right-4 p-1.5 bg-white text-stone-400 hover:text-red-600 rounded-lg border border-stone-200 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            title="Delete Message"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="flex items-center gap-3">
                            <p className="font-bold text-stone-900 text-sm">{m.name}</p>
                            <span className="text-[10px] text-stone-400 font-mono">{m.email}</span>
                            <span className="text-[9px] text-stone-400 font-mono ml-auto">
                              {new Date(m.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs text-stone-600 leading-relaxed font-sans pr-12">{m.message}</p>
                        </div>

                        {/* Small screens: compact row — tap opens the message on its own page */}
                        <button
                          type="button"
                          id={`msg-open-${m.id}`}
                          onClick={() => setViewingMessage(m)}
                          className="sm:hidden w-full text-left p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-1 cursor-pointer"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-bold text-stone-900 text-sm truncate">{m.name}</p>
                            <span className="text-[9px] text-stone-400 font-mono shrink-0">
                              {new Date(m.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs text-stone-500 leading-relaxed font-sans truncate">{m.message}</p>
                        </button>
                      </React.Fragment>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* 3. PACKAGES SUB SYSTEM TAB */}
            {activeTab === 'packages' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold font-sans tracking-tight uppercase">
                    {editingPkgId ? 'Edit Safari Package' : 'Create Safari Package'}
                  </h2>
                  <p className="text-xs text-stone-500 font-mono">Create horizontal packages immediately visible on the frontend.</p>
                </div>

                {/* Form to Add / Edit Cargo */}
                <form onSubmit={handleSavePackage} className="p-6 bg-stone-50 border border-stone-155 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  
                  <div className="space-y-1">
                    <label className="font-bold text-stone-600 uppercase">Package Name Title *</label>
                    <input
                      type="text"
                      required
                      value={pkgTitle}
                      onChange={(e) => setPkgTitle(e.target.value)}
                      placeholder="The Wildebeest Crater Run"
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-xl"
                    />
                  </div>

                  <ImageUploadField
                    label="Package Picture"
                    value={pkgImg}
                    onChange={setPkgImg}
                    required
                    id="pkg-img-upload"
                    hideUrlInput
                    selectButtonLabel="Import Picture"
                  />

                  <div className="space-y-1">
                    <label className="font-bold text-stone-600 uppercase">Rate Price (USD $) *</label>
                    <input
                      type="number"
                      required
                      value={pkgPrice}
                      onChange={(e) => setPkgPrice(Number(e.target.value))}
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-stone-600 uppercase">Length Days (Nights) *</label>
                    <input
                      type="number"
                      required
                      value={pkgDays}
                      onChange={(e) => setPkgDays(Number(e.target.value))}
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="font-bold text-stone-600 uppercase">Overview Short Description *</label>
                    <textarea
                      required
                      rows={2}
                      value={pkgDesc}
                      onChange={(e) => setPkgDesc(e.target.value)}
                      placeholder="Provide premium descriptions of the luxury expedition parameters..."
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-xl"
                    ></textarea>
                  </div>

                  {/* Daily Itinerary Builder — click "Add Day" to reveal Day 1, then
                      click again to add Day 2, Day 3, etc. Each new day's description
                      box is appended at the bottom of the list. */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="font-bold text-stone-600 uppercase">Daily Itinerary (Day by Day)</label>

                    {pkgItinerary.length === 0 && (
                      <p className="text-[11px] text-stone-400 italic">No days added yet. Click "Add Day" below to start building the itinerary.</p>
                    )}

                    <div className="space-y-2">
                      {pkgItinerary.map((d, index) => (
                        <div
                          key={index}
                          id={`itinerary-day-${d.day}`}
                          className="p-3 bg-white border border-stone-200 rounded-xl space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-emerald-950 uppercase text-[11px] tracking-wider">
                              Day {d.day}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveItineraryDay(index)}
                              className="text-stone-400 hover:text-red-600 cursor-pointer"
                              title="Remove this day"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <textarea
                            rows={2}
                            value={d.description}
                            onChange={(e) => handleUpdateItineraryDay(index, e.target.value)}
                            placeholder={`Describe what happens on Day ${d.day}...`}
                            className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono"
                          ></textarea>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      id="add-itinerary-day-btn"
                      onClick={handleAddItineraryDay}
                      className="flex items-center gap-2 px-4 py-2.5 bg-amber-700 text-white rounded-xl font-mono text-[10px] uppercase font-bold hover:bg-amber-800 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Day {pkgItinerary.length + 1}
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-stone-600 uppercase">Destinations Covered (comma-separated)</label>
                    <input
                      type="text"
                      value={pkgDestinations}
                      onChange={(e) => setPkgDestinations(e.target.value)}
                      placeholder="Serengeti National Park, Ngorongoro Area"
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-stone-600 uppercase">Accommodation Level</label>
                    <input
                      type="text"
                      value={pkgAccomm}
                      onChange={(e) => setPkgAccomm(e.target.value)}
                      placeholder="Wise Warrior Luxury Safari Lodge"
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-stone-600 uppercase">Transportation Vehicle</label>
                    <input
                      type="text"
                      value={pkgTransp}
                      onChange={(e) => setPkgTransp(e.target.value)}
                      placeholder="Custom 4x4 Land Cruiser with fridge & Wi-Fi"
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-stone-600 uppercase">Included Privileges (comma-separated)</label>
                    <input
                      type="text"
                      value={pkgIncl}
                      onChange={(e) => setPkgIncl(e.target.value)}
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-stone-600 uppercase">Excluded Services (comma-separated)</label>
                    <input
                      type="text"
                      value={pkgExcl}
                      onChange={(e) => setPkgExcl(e.target.value)}
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-stone-600 uppercase">Game Activities (comma-separated)</label>
                    <input
                      type="text"
                      value={pkgActs}
                      onChange={(e) => setPkgActs(e.target.value)}
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-xl"
                    />
                  </div>

                  {/* Submission and reset actions */}
                  <div className="md:col-span-2 pt-4 flex gap-3">
                    <button
                      id="save-pkg-btn"
                      type="submit"
                      className="px-6 py-3 bg-emerald-950 text-white font-mono font-bold rounded-xl hover:bg-emerald-850 cursor-pointer"
                    >
                      {editingPkgId ? 'Update Expedition' : 'Publish Package'}
                    </button>
                    {editingPkgId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPkgId(null);
                          setPkgTitle('');
                          setPkgDesc('');
                          setPkgItinerary([]);
                        }}
                        className="px-6 py-3 bg-stone-200 text-stone-700 font-mono rounded-xl hover:bg-stone-300 cursor-pointer"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </form>

                {/* Published List */}
                <div className="space-y-4">
                  <h3 className="font-sans font-bold text-stone-800 text-sm uppercase">Published Packages ({packages.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {packages.map((p) => (
                      <div key={p.id} className="p-4 bg-stone-50 border border-stone-100 rounded-2xl flex gap-3 items-start relative group">
                        <img src={p.imageUrl} alt={p.title} className="w-16 h-16 rounded-xl object-cover" />
                        <div className="space-y-1 flex-1 text-xs">
                          <p className="font-bold text-stone-900 leading-tight">{p.title}</p>
                          <p className="font-mono text-[10px] text-amber-700">${p.price} | {p.days} Days</p>
                          <p className="text-[10px] text-stone-400 line-clamp-1">{p.description}</p>
                        </div>
                        <div className="flex gap-1 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            id={`edit-pkg-${p.id}`}
                            onClick={() => handleEditPkgClick(p)}
                            className="p-1 bg-white hover:bg-stone-100 border border-stone-200 rounded text-stone-600 cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`delete-pkg-${p.id}`}
                            onClick={() => deletePackage(p.id)}
                            className="p-1 bg-white hover:bg-stone-100 border border-stone-200 rounded text-red-600 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* 4. PARKS & COUNTRIES MANAGEMENTS TAB */}
            {activeTab === 'parks' && (
              <div className="space-y-10">
                
                {/* 4A. Countries subdivision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Add country form */}
                  <form onSubmit={handleAddCountry} className="p-5 bg-stone-50 rounded-2xl space-y-4 text-xs font-mono">
                    <p className="font-sans font-bold text-stone-800 uppercase">Add East African Country</p>
                    <div className="space-y-1">
                      <label className="text-stone-500 uppercase">Country Name</label>
                      <input
                        type="text"
                        required
                        value={newCountryName}
                        onChange={(e) => setNewCountryName(e.target.value)}
                        placeholder="E.g. Tanzania"
                        className="w-full p-2 bg-white border border-stone-200 rounded-lg"
                      />
                    </div>
                    <ImageUploadField
                      label="Picha ya Nchi (Landscape Cover)"
                      value={newCountryImg}
                      onChange={setNewCountryImg}
                      required
                      id="country-img-upload"
                    />
                    <button
                      id="save-country-btn"
                      type="submit"
                      className="px-4 py-2 bg-emerald-950 text-white font-bold rounded-lg cursor-pointer"
                    >
                      Add Country
                    </button>
                  </form>

                  {/* Active countries lists */}
                  <div className="space-y-3">
                    <p className="font-sans font-bold text-stone-800 uppercase text-xs">Active Countries ({countries.length})</p>
                    <div className="divide-y divide-stone-100 max-h-56 overflow-y-auto">
                      {countries.map((c) => (
                        <div key={c.id} className="py-2.5 flex items-center justify-between text-xs font-mono">
                          <p className="font-semibold text-stone-900">{c.name}</p>
                          <button
                            id={`delete-country-${c.id}`}
                            onClick={() => deleteCountry(c.id)}
                            className="p-1 px-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer text-[10px] font-bold"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4B. National parks subdivision */}
                <div className="border-t border-stone-100 pt-8 space-y-6">
                  <div>
                    <h3 className="font-sans font-bold text-stone-800 uppercase text-sm">Add National Wildlife Reserve</h3>
                    <p className="text-[11px] text-stone-400">Expand the park guidelines, descriptions, best seasons, and activities.</p>
                  </div>

                  <form onSubmit={handleAddPark} className="p-6 bg-stone-50 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="space-y-1">
                      <label className="font-bold text-stone-600">Park Name Title *</label>
                      <input
                        type="text"
                        required
                        value={parkName}
                        onChange={(e) => setParkName(e.target.value)}
                        placeholder="Serengeti National Park"
                        className="w-full p-2.5 bg-white border border-stone-200 rounded-xl"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-stone-600">Belongs to Country *</label>
                      <select
                        value={parkCountry}
                        onChange={(e) => setParkCountry(e.target.value)}
                        className="w-full p-2.5 bg-white border border-stone-200 rounded-xl cursor-pointer"
                      >
                        {countries.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <ImageUploadField
                      label="Picha ya Hifadhi (Cover Photo)"
                      value={parkImg}
                      onChange={setParkImg}
                      required
                      id="park-img-upload"
                    />

                    <div className="space-y-1">
                      <label className="font-bold text-stone-600">Location coordinates/notes</label>
                      <input
                        type="text"
                        value={parkLoc}
                        onChange={(e) => setParkLoc(e.target.value)}
                        placeholder="Northern Tanzania, bordering Kenya"
                        className="w-full p-2.5 bg-white border border-stone-200 rounded-xl"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-stone-600">Best Travel Season</label>
                      <input
                        type="text"
                        value={parkSeason}
                        onChange={(e) => setParkSeason(e.target.value)}
                        placeholder="June to October (Wildebeest crossings)"
                        className="w-full p-2.5 bg-white border border-stone-200 rounded-xl"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-stone-600">Game Activities (comma-separated)</label>
                      <input
                        type="text"
                        value={parkActs}
                        onChange={(e) => setParkActs(e.target.value)}
                        placeholder="Sunrise Air Balloon, Game Drives"
                        className="w-full p-2.5 bg-white border border-stone-200 rounded-xl"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="font-bold text-stone-600">Narrative Description *</label>
                      <textarea
                        required
                        rows={3}
                        value={parkDesc}
                        onChange={(e) => setParkDesc(e.target.value)}
                        placeholder="Enter comprehensive information about animal populations, reserves size..."
                        className="w-full p-2.5 bg-white border border-stone-200 rounded-xl"
                      ></textarea>
                    </div>

                    <div className="md:col-span-2 pt-2">
                      <button
                        id="save-park-btn"
                        type="submit"
                        className="px-6 py-3 bg-emerald-950 text-white font-bold rounded-xl hover:bg-emerald-850 cursor-pointer"
                      >
                        Create National Park
                      </button>
                    </div>
                  </form>

                  {/* Active parks listings */}
                  <div className="space-y-4">
                    <p className="font-sans font-bold text-stone-850 uppercase text-xs">Active National Parks ({parks.length})</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {parks.map((pk) => (
                        <div key={pk.id} className="p-4 bg-stone-50 border border-stone-100 rounded-2xl flex items-center justify-between group">
                          <div>
                            <p className="font-bold text-stone-900 text-sm truncate max-w-[180px]">{pk.name}</p>
                            <p className="text-[10px] text-amber-700 font-mono uppercase tracking-wider">{pk.countryId}</p>
                          </div>
                          <button
                            id={`delete-park-${pk.id}`}
                            onClick={() => deletePark(pk.id)}
                            className="p-2 bg-white text-stone-400 hover:text-red-600 border border-stone-200 rounded-lg group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* 5. ABOUT STORY & SLIDER IMAGES TAB */}
            {activeTab === 'about' && (
              <div className="space-y-8 text-xs font-mono">
                <div>
                  <h2 className="text-xl font-bold font-sans tracking-tight uppercase">Corporate Identity Management</h2>
                  <p className="text-xs text-stone-500">Edit stories, mission guidelines, and background sliders instantly.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1 bg-stone-50 p-4 rounded-xl">
                    <label className="font-bold text-stone-600 uppercase">Core Company Story Statement</label>
                    <textarea
                      rows={4}
                      value={story}
                      onChange={(e) => setStory(e.target.value)}
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-lg"
                    ></textarea>
                  </div>

                  <div className="space-y-1 bg-stone-50 p-4 rounded-xl">
                    <label className="font-bold text-stone-600 uppercase">Corporate Mission Statement</label>
                    <textarea
                      rows={2}
                      value={mission}
                      onChange={(e) => setMission(e.target.value)}
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-lg"
                    ></textarea>
                  </div>

                  <div className="space-y-1 bg-stone-50 p-4 rounded-xl">
                    <label className="font-bold text-stone-600 uppercase">Long-Term Corporate Vision</label>
                    <textarea
                      rows={2}
                      value={vision}
                      onChange={(e) => setVision(e.target.value)}
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-lg"
                    ></textarea>
                  </div>

                  <button
                    id="save-about-btn"
                    onClick={handleSaveAbout}
                    className="px-6 py-3 bg-emerald-950 text-white font-bold rounded-xl hover:bg-emerald-850 cursor-pointer flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Save Story Elements
                  </button>
                </div>

                {/* About Page photo sliders */}
                <div className="border-t border-stone-100 pt-8 space-y-4">
                  <div>
                    <h3 className="font-sans font-bold text-stone-800 text-sm uppercase">Manage About Image Slider</h3>
                    <p className="text-[11px] text-stone-400">Add or remove images rendered by the About Us fading visual carousel.</p>
                  </div>

                  {/* Add Image - kubonyeza au URL */}
                  <div className="bg-stone-50 p-4 rounded-xl space-y-2">
                    <label className="font-bold text-stone-600 uppercase text-xs">Ongeza Picha Mpya</label>
                    <div className="flex gap-3 items-center">
                      {/* File picker button */}
                      <button
                        type="button"
                        onClick={() => document.getElementById('about-slider-file-input')?.click()}
                        className="flex items-center gap-2 px-3 py-2 bg-emerald-950 text-white rounded-lg font-mono text-[10px] uppercase hover:bg-emerald-800 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Chagua Picha
                      </button>
                      <input
                        type="text"
                        value={newSliderImg}
                        onChange={(e) => setNewSliderImg(e.target.value)}
                        placeholder="au bandika URL ya picha..."
                        className="flex-1 p-2 bg-white border border-stone-200 rounded-lg text-xs font-mono"
                      />
                      <button
                        id="save-slide-img-btn"
                        onClick={handleAddSliderImg}
                        className="px-4 py-2 bg-stone-800 text-white font-bold rounded-lg hover:bg-stone-700 cursor-pointer font-sans text-xs uppercase whitespace-nowrap"
                      >
                        Add
                      </button>
                    </div>
                    <input
                      id="about-slider-file-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const objectUrl = URL.createObjectURL(file);
                        setNewSliderImg(objectUrl);
                      }}
                    />
                  </div>

                  {/* Active slider slides */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {settings.aboutSliderImages && settings.aboutSliderImages.map((img, index) => (
                      <div key={index} className="relative h-24 rounded-lg overflow-hidden border border-stone-200 group">
                        <img src={img} alt="Slider" className="w-full h-full object-cover" />
                        <button
                          id={`delete-slide-${index}`}
                          onClick={() => removeAboutSliderImage(index)}
                          className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity font-bold uppercase text-[10px] cursor-pointer"
                        >
                          <Trash2 className="w-5 h-5 text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* 6. CONTACTS GENERAL MANAGEMENT TAB */}
            {activeTab === 'contact' && (
              <div className="space-y-6 text-xs font-mono">
                <div>
                  <h2 className="text-xl font-bold font-sans tracking-tight uppercase">Support Contact Management</h2>
                  <p className="text-xs text-stone-500">Edit general hotlines, emails, and WhatsApp contacts instantly.</p>
                </div>

                <div className="space-y-4 max-w-lg">
                  <div className="space-y-1 bg-stone-50 p-4 rounded-xl">
                    <label className="font-bold text-stone-600">Phone Hotline</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1 bg-stone-50 p-4 rounded-xl">
                    <label className="font-bold text-stone-600">WhatsApp Concierge Desk</label>
                    <input
                      type="text"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1 bg-stone-50 p-4 rounded-xl">
                    <label className="font-bold text-stone-600">Email Address Desk</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-lg"
                    />
                  </div>

                  <button
                    id="save-contacts-btn"
                    onClick={handleSaveContacts}
                    className="px-6 py-3 bg-emerald-950 text-white font-bold rounded-xl hover:bg-emerald-850 cursor-pointer flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Save Contacts
                  </button>
                </div>
              </div>
            )}

            {/* USERS / ADMIN MANAGEMENT TAB */}
            {activeTab === 'users' && (
              <div className="space-y-6 text-xs font-mono">
                <div>
                  <h2 className="text-xl font-bold font-sans tracking-tight uppercase">Administrator Users</h2>
                  <p className="text-xs text-stone-500">
                    Add a new administrator below. Once added, that person can log in with their email and
                    password (verified by a one-time code emailed to them) and will get full Admin Dashboard access.
                  </p>
                </div>

                {adminUserError && (
                  <div id="admin-user-error" className="p-3 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>{adminUserError}</p>
                  </div>
                )}
                {adminUserSuccess && (
                  <div id="admin-user-success" className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100 flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>{adminUserSuccess}</p>
                  </div>
                )}

                {/* Add new admin form */}
                <form
                  onSubmit={handleAddAdminUser}
                  className="p-6 bg-stone-50 border border-stone-155 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl"
                >
                  <div className="space-y-1 md:col-span-2">
                    <label className="font-bold text-stone-600 uppercase">Full Name *</label>
                    <input
                      id="admin-user-name-input"
                      type="text"
                      required
                      value={newAdminName}
                      onChange={(e) => setNewAdminName(e.target.value)}
                      placeholder="e.g. Karim Hemedi"
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-stone-600 uppercase">Email *</label>
                    <input
                      id="admin-user-email-input"
                      type="email"
                      required
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-stone-600 uppercase">Password *</label>
                    <input
                      id="admin-user-password-input"
                      type="password"
                      required
                      minLength={4}
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-xl"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <button
                      id="add-admin-user-btn"
                      type="submit"
                      disabled={savingAdminUser}
                      className="px-6 py-3 bg-emerald-950 text-white font-bold rounded-xl hover:bg-emerald-850 cursor-pointer flex items-center gap-2 disabled:opacity-60"
                    >
                      <Plus className="w-4 h-4" /> {savingAdminUser ? 'Adding...' : 'Add Administrator'}
                    </button>
                  </div>
                </form>

                {/* Existing Admins List */}
                <div className="space-y-3 max-w-2xl">
                  <h3 className="font-bold text-stone-600 uppercase text-[11px]">Current Administrators</h3>
                  {adminUsersList.length === 0 && (
                    <p className="text-stone-400 italic text-[11px]">No administrators found.</p>
                  )}
                  {adminUsersList.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center justify-between p-3 bg-white border border-stone-200 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 text-emerald-800 rounded-full">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-stone-800">{u.fullName}</p>
                          <p className="text-stone-400">{u.email}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </main>

        </div>

      </div>
    </div>
  );
}
