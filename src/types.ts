/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: 'admin' | 'user';
  createdAt?: string;
}

export interface Country {
  id: string;
  name: string;
  imageUrl: string;
  slug: string;
}

export interface NationalPark {
  id: string;
  name: string;
  countryId: string; // 'tanzania' | 'kenya' | 'uganda' or custom
  description: string;
  activities: string[];
  bestSeason?: string;
  location?: string;
  imageUrl: string;
  gallery: string[]; // URLs of additional images
}

export interface Package {
  id: string;
  title: string;
  description: string;
  price: number;
  days: number;
  itinerary: {
    day: number;
    title: string;
    description: string;
  }[];
  destinations: string[];
  accommodation: string;
  transportation: string;
  included: string[];
  excluded: string[];
  activities: string[];
  imageUrl: string;
}

export interface Booking {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  packageId?: string;
  packageTitle: string;
  travelers: number;
  travelDate: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface SystemSettings {
  phone: string;
  whatsapp: string;
  email: string;
  aboutStory: string;
  aboutMission: string;
  aboutVision: string;
  aboutWhyUs: string[];
  aboutSliderImages: string[];
}
