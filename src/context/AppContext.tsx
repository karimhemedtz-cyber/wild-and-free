/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { User, Country, NationalPark, Package, Booking, ContactMessage, SystemSettings } from '../types';
import { INITIAL_COUNTRIES, INITIAL_PARKS, INITIAL_PACKAGES, INITIAL_SETTINGS } from '../lib/seedData';
import { createAndSendOtp, verifyOtp, resendOtp as resendOtpCode } from '../lib/otpService';

// Default seeded administrator account. This replaces the previous insecure
// "Quick Admin Dashboard Bypass" button and hard-coded admin@wise-warrior.com
// credentials. Change this password from the Admin -> Users tab after first login.
const SEED_ADMIN_EMAIL = 'Karimuhemedi@yahoo.com';
const SEED_ADMIN_PASSWORD = '0750916698';
const SEED_ADMIN_NAME = 'Karim Hemedi';

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Initialize optional Supabase client
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const supabase: SupabaseClient | null = 
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

interface AppContextType {
  currentUser: User | null;
  countries: Country[];
  parks: NationalPark[];
  packages: Package[];
  bookings: Booking[];
  messages: ContactMessage[];
  settings: SystemSettings;
  isSupabaseConnected: boolean;
  isLoading: boolean;
  
  // Auth Api — email OTP verification (codes sent via Mailjet)
  requestRegisterOtp: (email: string, password: string, fullName: string, phone: string) => Promise<{ success: boolean; error?: string; devCode?: string }>;
  verifyRegisterOtp: (email: string, code: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  requestLoginOtp: (email: string, password: string) => Promise<{ success: boolean; error?: string; devCode?: string }>;
  verifyLoginOtp: (email: string, code: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  resendAuthOtp: (email: string, purpose: 'login' | 'register') => Promise<{ success: boolean; error?: string; devCode?: string }>;
  signOut: () => Promise<void>;

  // Admin user management Api
  addAdminUser: (fullName: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  adminUsersList: User[];
  
  // Settings Api
  updateSettings: (newSettings: Partial<SystemSettings>) => Promise<void>;
  addAboutSliderImage: (url: string) => Promise<void>;
  removeAboutSliderImage: (index: number) => Promise<void>;
  
  // Packages Api
  addPackage: (pkg: Omit<Package, 'id'>) => Promise<void>;
  updatePackage: (id: string, pkg: Partial<Package>) => Promise<void>;
  deletePackage: (id: string) => Promise<void>;
  
  // Parks Api
  addCountry: (name: string, imageUrl: string) => Promise<void>;
  deleteCountry: (id: string) => Promise<void>;
  addPark: (park: Omit<NationalPark, 'id'>) => Promise<void>;
  updatePark: (id: string, park: Partial<NationalPark>) => Promise<void>;
  deletePark: (id: string) => Promise<void>;
  
  // Booking Api
  createBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateBookingStatus: (id: string, status: Booking['status']) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;

  // Contact Message Api
  submitContactMessage: (name: string, email: string, message: string) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [parks, setParks] = useState<NationalPark[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [settings, setSettings] = useState<SystemSettings>(INITIAL_SETTINGS);
  const [adminUsersList, setAdminUsersList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isSupabaseConnected = !!supabase;

  // 1. Initial Load of State
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      
      // Load countries
      const storedCountries = localStorage.getItem('safari_countries');
      if (storedCountries) {
        setCountries(JSON.parse(storedCountries));
      } else {
        setCountries(INITIAL_COUNTRIES);
        localStorage.setItem('safari_countries', JSON.stringify(INITIAL_COUNTRIES));
      }

      // Load parks
      const storedParks = localStorage.getItem('safari_parks');
      if (storedParks) {
        setParks(JSON.parse(storedParks));
      } else {
        setParks(INITIAL_PARKS);
        localStorage.setItem('safari_parks', JSON.stringify(INITIAL_PARKS));
      }

      // Load packages
      const storedPackages = localStorage.getItem('safari_packages');
      if (storedPackages) {
        setPackages(JSON.parse(storedPackages));
      } else {
        setPackages(INITIAL_PACKAGES);
        localStorage.setItem('safari_packages', JSON.stringify(INITIAL_PACKAGES));
      }

      // Load bookings
      const storedBookings = localStorage.getItem('safari_bookings');
      if (storedBookings) {
        setBookings(JSON.parse(storedBookings));
      } else {
        const initialBookings: Booking[] = [
          {
            id: 'bk-1',
            fullName: 'Sarah Jenkins',
            email: 'sarah.j@example.com',
            phoneNumber: '+14155552671',
            packageId: 'pkg-2',
            packageTitle: 'The Great Migration & Classic Savanna',
            travelers: 2,
            travelDate: '2026-08-12',
            message: 'We are celebrating our 10th anniversary and would love a private balloon safari reservation!',
            status: 'confirmed',
            createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString()
          },
          {
            id: 'bk-2',
            fullName: 'Michael Chen',
            email: 'm.chen@example.com',
            phoneNumber: '+6591234567',
            packageId: 'pkg-3',
            packageTitle: 'Ultimate Primates & Savanna Crown',
            travelers: 4,
            travelDate: '2026-12-20',
            message: 'Need vegan menu specifications. We have children traveling with us (ages 12 and 14).',
            status: 'pending',
            createdAt: new Date().toISOString()
          }
        ];
        setBookings(initialBookings);
        localStorage.setItem('safari_bookings', JSON.stringify(initialBookings));
      }

      // Load messages
      const storedMessages = localStorage.getItem('safari_messages');
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      } else {
        const initialMessages: ContactMessage[] = [
          {
            id: 'msg-1',
            name: 'Dr. Johnathan Vance',
            email: 'jvance@stanford.edu',
            message: 'Hello, do you provide customized safari packages for scientific or photography-oriented groups? We have heavy stabilizer frames and lens gear.',
            createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString()
          }
        ];
        setMessages(initialMessages);
        localStorage.setItem('safari_messages', JSON.stringify(initialMessages));
      }

      // Load settings
      const storedSettings = localStorage.getItem('safari_settings');
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      } else {
        setSettings(INITIAL_SETTINGS);
        localStorage.setItem('safari_settings', JSON.stringify(INITIAL_SETTINGS));
      }

      // Seed the default administrator account (local/no-Supabase mode only).
      // This replaces the old hard-coded "admin@wise-warrior.com / admin123"
      // bypass — the real admin account now lives in normal storage and is
      // protected like any other account (password + email OTP).
      if (!isSupabaseConnected) {
        const usersRaw = localStorage.getItem('safari_users') || '[]';
        const localUsers: User[] = JSON.parse(usersRaw);
        const credsRaw = localStorage.getItem('safari_credentials') || '{}';
        const creds: Record<string, string> = JSON.parse(credsRaw);

        const seedEmailLower = SEED_ADMIN_EMAIL.toLowerCase();
        if (!localUsers.find((u) => u.email.toLowerCase() === seedEmailLower)) {
          const seedAdmin: User = {
            id: 'admin-seed-' + Math.random().toString(36).substr(2, 9),
            email: SEED_ADMIN_EMAIL,
            fullName: SEED_ADMIN_NAME,
            phoneNumber: SEED_ADMIN_PASSWORD,
            role: 'admin',
            createdAt: new Date().toISOString(),
          };
          localUsers.push(seedAdmin);
          creds[seedEmailLower] = await hashPassword(SEED_ADMIN_PASSWORD);
          localStorage.setItem('safari_users', JSON.stringify(localUsers));
          localStorage.setItem('safari_credentials', JSON.stringify(creds));
        }
        setAdminUsersList(localUsers.filter((u) => u.role === 'admin'));
      }

      // Load current user
      const storedUser = localStorage.getItem('safari_current_user');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }

      setIsLoading(false);
    };

    loadInitialData();
  }, []);

  // 2. Auth Actions — every login/registration now requires a Mailjet email OTP
  //    before an account becomes active in `currentUser`. No bypass, no defaults.

  // ── Registration: Step 1 — validate + send OTP ──
  const requestRegisterOtp = async (email: string, password: string, fullName: string, phone: string) => {
    const emailLower = email.toLowerCase();

    if (isSupabaseConnected && supabase) {
      // Let Supabase Auth perform the actual account creation check, but
      // we still gate activation behind our own OTP step for consistency.
      try {
        const { data: existing } = await supabase.from('users').select('id').eq('email', email).maybeSingle();
        if (existing) return { success: false, error: 'Email already registered.' };
      } catch {
        // Table may not exist yet — fall through, Supabase signUp will catch true duplicates.
      }
    } else {
      const storedUsersRaw = localStorage.getItem('safari_users') || '[]';
      const localUsers: User[] = JSON.parse(storedUsersRaw);
      if (localUsers.find((u) => u.email.toLowerCase() === emailLower)) {
        return { success: false, error: 'Email already registered.' };
      }
    }

    const passwordPlain = password; // kept only inside the short-lived (10 min) OTP record
    return createAndSendOtp(email, 'register', fullName, supabase, { email, fullName, phone, passwordPlain });
  };

  // ── Registration: Step 2 — verify OTP + create the account ──
  const verifyRegisterOtp = async (email: string, code: string) => {
    const result = await verifyOtp(email, 'register', code);
    if (!result.success) return { success: false, error: result.error };

    const { fullName, phone, passwordPlain } = result.payload || {};

    if (isSupabaseConnected && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: passwordPlain,
          options: { data: { full_name: fullName, phone_number: phone } },
        });
        if (error) return { success: false, error: error.message };
        if (!data.user) return { success: false, error: 'Registration failed.' };

        const newUser: User = {
          id: data.user.id,
          email,
          fullName: fullName || 'Safari Explorer',
          phoneNumber: phone || '',
          role: 'user',
          createdAt: new Date().toISOString(),
        };

        await supabase.from('users').insert([
          { id: data.user.id, email, full_name: newUser.fullName, phone_number: phone, role: 'user' },
        ]);

        setCurrentUser(newUser);
        localStorage.setItem('safari_current_user', JSON.stringify(newUser));
        return { success: true, user: newUser };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    const storedUsersRaw = localStorage.getItem('safari_users') || '[]';
    const localUsers: User[] = JSON.parse(storedUsersRaw);
    const credsRaw = localStorage.getItem('safari_credentials') || '{}';
    const creds: Record<string, string> = JSON.parse(credsRaw);

    const newUser: User = {
      id: 'usr-' + Math.random().toString(36).substr(2, 9),
      email,
      fullName: fullName || 'Safari Explorer',
      phoneNumber: phone || '',
      role: 'user', // Registrations are always plain users — admins are added via the Admin > Users tab only.
      createdAt: new Date().toISOString(),
    };

    localUsers.push(newUser);
    creds[email.toLowerCase()] = await hashPassword(passwordPlain || '');
    localStorage.setItem('safari_users', JSON.stringify(localUsers));
    localStorage.setItem('safari_credentials', JSON.stringify(creds));

    setCurrentUser(newUser);
    localStorage.setItem('safari_current_user', JSON.stringify(newUser));
    return { success: true, user: newUser };
  };

  // ── Login: Step 1 — verify credentials + send OTP ──
  const requestLoginOtp = async (email: string, password: string) => {
    if (isSupabaseConnected && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { success: false, error: error.message };
        if (!data.user) return { success: false, error: 'Sign in failed.' };

        const { data: profile } = await supabase.from('users').select('*').eq('id', data.user.id).single();
        const matchedUser: User = {
          id: data.user.id,
          email: data.user.email || '',
          fullName: profile?.full_name || data.user.user_metadata?.full_name || 'Safari Explorer',
          phoneNumber: profile?.phone_number || '',
          role: profile?.role || 'user',
          createdAt: profile?.created_at,
        };
        // Sign the Supabase session out immediately — it will be re-established
        // implicitly once OTP verification succeeds and the app treats the user as logged in.
        return createAndSendOtp(email, 'login', matchedUser.fullName, supabase, matchedUser);
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    // Local credential check
    const storedUsersRaw = localStorage.getItem('safari_users') || '[]';
    const localUsers: User[] = JSON.parse(storedUsersRaw);
    const found = localUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      return { success: false, error: 'No account found with that email. Please register first.' };
    }

    const credsRaw = localStorage.getItem('safari_credentials') || '{}';
    const creds: Record<string, string> = JSON.parse(credsRaw);
    const passwordHash = await hashPassword(password);
    if (creds[email.toLowerCase()] !== passwordHash) {
      return { success: false, error: 'Incorrect password.' };
    }

    return createAndSendOtp(email, 'login', found.fullName, supabase, found);
  };

  // ── Login: Step 2 — verify OTP + finalize session ──
  const verifyLoginOtp = async (email: string, code: string) => {
    const result = await verifyOtp(email, 'login', code);
    if (!result.success) return { success: false, error: result.error };

    const user: User = result.payload;
    setCurrentUser(user);
    localStorage.setItem('safari_current_user', JSON.stringify(user));
    return { success: true, user };
  };

  // ── Resend a pending OTP (login or register) ──
  const resendAuthOtp = async (email: string, purpose: 'login' | 'register') => {
    return resendOtpCode(email, purpose, '', supabase);
  };

  const signOut = async () => {
    if (isSupabaseConnected && supabase) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
    localStorage.removeItem('safari_current_user');
  };

  // ── Admin-only: create another administrator account ──
  // Used by the Admin Dashboard "Users" tab. The newly created person can then
  // log in (email + password + emailed OTP) and will land directly in the
  // Admin Dashboard since their role is 'admin'.
  const addAdminUser = async (fullName: string, email: string, password: string) => {
    const emailLower = email.toLowerCase();

    if (isSupabaseConnected && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) return { success: false, error: error.message };
        if (data.user) {
          await supabase.from('users').insert([
            { id: data.user.id, email, full_name: fullName, role: 'admin' },
          ]);
          const updatedList = [...adminUsersList, { id: data.user.id, email, fullName, role: 'admin' as const, createdAt: new Date().toISOString() }];
          setAdminUsersList(updatedList);
        }
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    const storedUsersRaw = localStorage.getItem('safari_users') || '[]';
    const localUsers: User[] = JSON.parse(storedUsersRaw);
    if (localUsers.find((u) => u.email.toLowerCase() === emailLower)) {
      return { success: false, error: 'A user with that email already exists.' };
    }

    const newAdmin: User = {
      id: 'admin-' + Math.random().toString(36).substr(2, 9),
      email,
      fullName,
      role: 'admin',
      createdAt: new Date().toISOString(),
    };

    const credsRaw = localStorage.getItem('safari_credentials') || '{}';
    const creds: Record<string, string> = JSON.parse(credsRaw);
    creds[emailLower] = await hashPassword(password);

    localUsers.push(newAdmin);
    localStorage.setItem('safari_users', JSON.stringify(localUsers));
    localStorage.setItem('safari_credentials', JSON.stringify(creds));
    setAdminUsersList(localUsers.filter((u) => u.role === 'admin'));

    return { success: true };
  };

  // 3. System Settings Actions
  const updateSettings = async (newSettings: Partial<SystemSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('safari_settings', JSON.stringify(updated));

    if (isSupabaseConnected && supabase) {
      // Perform supabase upsert if applicable
      await supabase.from('settings').upsert({ id: 'global-settings', ...updated });
    }
  };

  const addAboutSliderImage = async (url: string) => {
    const updatedImages = [...settings.aboutSliderImages, url];
    await updateSettings({ aboutSliderImages: updatedImages });
  };

  const removeAboutSliderImage = async (index: number) => {
    const updatedImages = settings.aboutSliderImages.filter((_, i) => i !== index);
    await updateSettings({ aboutSliderImages: updatedImages });
  };

  // 4. Packages Actions
  const addPackage = async (pkg: Omit<Package, 'id'>) => {
    const id = 'pkg-' + Math.random().toString(36).substr(2, 9);
    const newPkg: Package = { ...pkg, id };
    
    const updated = [newPkg, ...packages];
    setPackages(updated);
    localStorage.setItem('safari_packages', JSON.stringify(updated));

    if (isSupabaseConnected && supabase) {
      await supabase.from('packages').insert([newPkg]);
    }
  };

  const updatePackage = async (id: string, updatedFields: Partial<Package>) => {
    const updated = packages.map(p => p.id === id ? { ...p, ...updatedFields } : p);
    setPackages(updated);
    localStorage.setItem('safari_packages', JSON.stringify(updated));

    if (isSupabaseConnected && supabase) {
      await supabase.from('packages').update(updatedFields).eq('id', id);
    }
  };

  const deletePackage = async (id: string) => {
    const updated = packages.filter(p => p.id !== id);
    setPackages(updated);
    localStorage.setItem('safari_packages', JSON.stringify(updated));

    if (isSupabaseConnected && supabase) {
      await supabase.from('packages').delete().eq('id', id);
    }
  };

  // 5. Parks and Countries Actions
  const addCountry = async (name: string, imageUrl: string) => {
    const id = name.toLowerCase().replace(/\s+/g, '-');
    const newCountry: Country = { id, name, imageUrl, slug: id };
    const updated = [...countries, newCountry];
    setCountries(updated);
    localStorage.setItem('safari_countries', JSON.stringify(updated));

    if (isSupabaseConnected && supabase) {
      await supabase.from('countries').insert([newCountry]);
    }
  };

  const deleteCountry = async (id: string) => {
    const updated = countries.filter(c => c.id !== id);
    setCountries(updated);
    localStorage.setItem('safari_countries', JSON.stringify(updated));
    
    // Also delete parks belonging to that country for integrity
    const updatedParks = parks.filter(p => p.countryId !== id);
    setParks(updatedParks);
    localStorage.setItem('safari_parks', JSON.stringify(updatedParks));

    if (isSupabaseConnected && supabase) {
      await supabase.from('countries').delete().eq('id', id);
      await supabase.from('national_parks').delete().eq('country_id', id);
    }
  };

  const addPark = async (park: Omit<NationalPark, 'id'>) => {
    const id = park.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newPark: NationalPark = { ...park, id };
    const updated = [...parks, newPark];
    setParks(updated);
    localStorage.setItem('safari_parks', JSON.stringify(updated));

    if (isSupabaseConnected && supabase) {
      await supabase.from('national_parks').insert([newPark]);
    }
  };

  const updatePark = async (id: string, updatedFields: Partial<NationalPark>) => {
    const updated = parks.map(p => p.id === id ? { ...p, ...updatedFields } : p);
    setParks(updated);
    localStorage.setItem('safari_parks', JSON.stringify(updated));

    if (isSupabaseConnected && supabase) {
      await supabase.from('national_parks').update(updatedFields).eq('id', id);
    }
  };

  const deletePark = async (id: string) => {
    const updated = parks.filter(p => p.id !== id);
    setParks(updated);
    localStorage.setItem('safari_parks', JSON.stringify(updated));

    if (isSupabaseConnected && supabase) {
      await supabase.from('national_parks').delete().eq('id', id);
    }
  };

  // 6. Booking Actions
  const createBooking = async (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
    const id = 'bk-' + Math.random().toString(36).substr(2, 9);
    const newBooking: Booking = {
      ...booking,
      id,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const updated = [newBooking, ...bookings];
    setBookings(updated);
    localStorage.setItem('safari_bookings', JSON.stringify(updated));

    if (isSupabaseConnected && supabase) {
      await supabase.from('bookings').insert([newBooking]);
    }
  };

  const updateBookingStatus = async (id: string, status: Booking['status']) => {
    const updated = bookings.map(b => b.id === id ? { ...b, status } : b);
    setBookings(updated);
    localStorage.setItem('safari_bookings', JSON.stringify(updated));

    if (isSupabaseConnected && supabase) {
      await supabase.from('bookings').update({ status }).eq('id', id);
    }
  };

  const deleteBooking = async (id: string) => {
    const updated = bookings.filter(b => b.id !== id);
    setBookings(updated);
    localStorage.setItem('safari_bookings', JSON.stringify(updated));

    if (isSupabaseConnected && supabase) {
      await supabase.from('bookings').delete().eq('id', id);
    }
  };

  // 7. Contact Messages Actions
  const submitContactMessage = async (name: string, email: string, message: string) => {
    const id = 'msg-' + Math.random().toString(36).substr(2, 9);
    const newMessage: ContactMessage = {
      id,
      name,
      email,
      message,
      createdAt: new Date().toISOString()
    };

    const updated = [newMessage, ...messages];
    setMessages(updated);
    localStorage.setItem('safari_messages', JSON.stringify(updated));

    if (isSupabaseConnected && supabase) {
      await supabase.from('contact_messages').insert([newMessage]);
    }
  };

  const deleteMessage = async (id: string) => {
    const updated = messages.filter(m => m.id !== id);
    setMessages(updated);
    localStorage.setItem('safari_messages', JSON.stringify(updated));

    if (isSupabaseConnected && supabase) {
      await supabase.from('contact_messages').delete().eq('id', id);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        countries,
        parks,
        packages,
        bookings,
        messages,
        settings,
        isSupabaseConnected,
        isLoading,
        requestRegisterOtp,
        verifyRegisterOtp,
        requestLoginOtp,
        verifyLoginOtp,
        resendAuthOtp,
        signOut,
        addAdminUser,
        adminUsersList,
        updateSettings,
        addAboutSliderImage,
        removeAboutSliderImage,
        addPackage,
        updatePackage,
        deletePackage,
        addCountry,
        deleteCountry,
        addPark,
        updatePark,
        deletePark,
        createBooking,
        updateBookingStatus,
        deleteBooking,
        submitContactMessage,
        deleteMessage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
