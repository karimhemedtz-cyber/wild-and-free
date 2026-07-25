/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Country, NationalPark, Package, SystemSettings } from '../types';

export const INITIAL_COUNTRIES: Country[] = [
  {
    id: 'tanzania',
    name: 'Tanzania',
    imageUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=1200',
    slug: 'tanzania'
  },
  {
    id: 'kenya',
    name: 'Kenya',
    imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=1200',
    slug: 'kenya'
  },
  {
    id: 'uganda',
    name: 'Uganda',
    imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=1200',
    slug: 'uganda'
  }
];

export const INITIAL_PARKS: NationalPark[] = [
  // Tanzania
  {
    id: 'serengeti',
    name: 'Serengeti National Park',
    countryId: 'tanzania',
    description: 'The Serengeti is famous for its massive annual migration of wildebeest and zebras. Seeking new pasture, the herds move north from their breeding grounds in the grassy southern plains. Over six million hooves pound the legendary endless plains, offering one of the most spectacular wildlife viewing experiences on Earth.',
    activities: ['Sunrise Hot Air Balloon Safari', 'Full-Day Game Drive', 'Bush Dinner under the stars', 'Maasai Village Cultural Visit'],
    bestSeason: 'June to October (Dry Season & Wildebeest River Crossings)',
    location: 'Northern Tanzania, bordering Kenya',
    imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1511993807578-701168605ad3?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 'ngorongoro',
    name: 'Ngorongoro Conservation Area',
    countryId: 'tanzania',
    description: 'A deep, volcanic crater, the largest un-flooded and unbroken caldera in the world. Inside the crater rim lies a breathtaking haven of diverse habitats, hosting over 25,000 large mammals, including the highly endangered black rhinoceros and the densest known population of lions.',
    activities: ['Crater Floor Game Drive', 'Empakaai Crater Hiking', 'Oldupai Gorge Archaeological Tour'],
    bestSeason: 'Year-round (Dry Season June to October is optimal for game)',
    location: 'Arusha Region, Northern Tanzania',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 'tarangire',
    name: 'Tarangire National Park',
    countryId: 'tanzania',
    description: 'Famous for its colossal baobab trees and massive elephant herds that migrate along the Tarangire River. During the dry season, the river becomes a crucial lifetime vein for thousands of animals, creating an intense, concentrated theater of raw African wildlife.',
    activities: ['Night Game Drive', 'Guided Walking Safaris', 'Bird Watching (Over 500 species)'],
    bestSeason: 'June to October (Animals gather around the river)',
    location: 'Manyara Region, Northern Tanzania',
    imageUrl: 'https://images.unsplash.com/photo-1527159347462-812e6809b226?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600'
    ]
  },

  // Kenya
  {
    id: 'maasaimara',
    name: 'Maasai Mara National Reserve',
    countryId: 'kenya',
    description: 'An elite wilderness area in southwestern Kenya, globally famous for its exceptional populations of lions, leopards, cheetahs, and the Great Migration of millions of wildebeests, zebras, and gazelles crossing the crocodile-infested Mara River.',
    activities: ['Great Migration River Crossing Tracking', 'Maasai Warrior Cultural Experience', 'Mara River Walking Tours'],
    bestSeason: 'July to October (Great Migration period)',
    location: 'Narok County, Southwestern Kenya',
    imageUrl: 'https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 'amboseli',
    name: 'Amboseli National Park',
    countryId: 'kenya',
    description: 'Renowned for its close-up views of free-ranging African elephants against the majestic backdrop of Mount Kilimanjaro, the highest free-standing mountain in the world. Amboseli offers an iconic postcard visual of absolute luxury safari expeditions.',
    activities: ['Elephant Herd Tracking', 'Kilimanjaro Photography Drive', 'Observation Hill Scenic Hike'],
    bestSeason: 'January to February and June to September',
    location: 'Loitokitok District, Southern Kenya',
    imageUrl: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 'tsavo',
    name: 'Tsavo National Park',
    countryId: 'kenya',
    description: 'One of the oldest and largest parks in Kenya, Tsavo is famous for its legendary mane-less lions, red-dusted elephants, the beautiful volcanic Mzima Springs, and dramatic, rugged lava-bed volcanic scenery.',
    activities: ['Mzima Springs Hippo Viewing', 'Lugard Falls Gorge Walk', 'Yatta Plateau Exploration'],
    bestSeason: 'June to October and December to March',
    location: 'Coast Province, Southern Kenya',
    imageUrl: 'https://images.unsplash.com/photo-1533038590840-1cde6b668731?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&q=80&w=600'
    ]
  },

  // Uganda
  {
    id: 'bwindi',
    name: 'Bwindi Impenetrable National Park',
    countryId: 'uganda',
    description: 'Located in southwestern Uganda, Bwindi is an ancient, dense rainforest. It is home to roughly half of the worlds remaining mountain gorilla population, offering arguably the most intimate and deeply emotional primate tracking experience on the planet.',
    activities: ['Mountain Gorilla Tracking', 'Batwa Forest Pygmy Cultural Experience', 'Rainforest Waterfall Hiking'],
    bestSeason: 'June to August and December to February',
    location: 'Kabale District, Southwestern Uganda',
    imageUrl: 'https://images.unsplash.com/photo-1581888227599-779811939961?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 'queenelizabeth',
    name: 'Queen Elizabeth National Park',
    countryId: 'uganda',
    description: 'Ugandas most popular savanna reserve, featuring incredible tree-climbing lions of Ishasha, a pristine water channel packed with hippos and elephants, and stunning craters formed by volcanic eruptions.',
    activities: ['Kazinga Channel Boat Cruise', 'Ishasha Tree-Climbing Lion Search', 'Kyambura Gorge Chimpanzee Trekking'],
    bestSeason: 'January to February and June to July',
    location: 'Western Uganda',
    imageUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1511993807578-701168605ad3?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 'murchison',
    name: 'Murchison Falls National Park',
    countryId: 'uganda',
    description: 'Where the Nile River squeezes through an extremely narrow 7-meter gorge before plunging 43 meters below into the Devils Cauldron, creating a thunderous explosion. The park hosts abundant elephants, giraffes, and gargantuan Nile crocodiles.',
    activities: ['Top of the Falls Sightseeing Hike', 'Nile River Wildlife Cruise', 'Delta Sunrise Game Drive'],
    bestSeason: 'December to February and June to September',
    location: 'Masindi District, Northwestern Uganda',
    imageUrl: 'https://images.unsplash.com/photo-154df2335191-72a392ab8a2b?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=600'
    ]
  }
];

export const INITIAL_PACKAGES: Package[] = [
  {
    id: 'pkg-1',
    title: 'Express Wilderness Expedition',
    description: 'A luxurious three-day immersion into the heart of Tanzanias finest reserves, tailored for those seeking maximum wildlife exposure with limited time.',
    price: 600,
    days: 3,
    itinerary: [
      { day: 1, title: 'Arrival & Tarangire Baobab Exploration', description: 'Arrive in Arusha, take a scenic drive into Tarangire National Park. Known for its giant baobab trees and major elephant herds, experience your first modern luxury game drive. Overnight in an eco-luxury tented lodge.' },
      { day: 2, title: 'Ngorongoro Crater Majesty', description: 'Early morning crater escape. Descend 600 meters into the crater floor for a majestic 6-hour game drive. Spot the rare black rhino, lions, and hippos before retiring to a luxury rim-view lodge.' },
      { day: 3, title: 'Lake Manyara Morning & Return', description: 'Indulge in a beautiful morning safari walk or bird watching at Lake Manyara before heading back to Arusha for your departure flights.' }
    ],
    destinations: ['Tarangire National Park', 'Ngorongoro Crater', 'Lake Manyara'],
    accommodation: 'Wise Warrior Luxury Tented Camp (All-inclusive)',
    transportation: '4x4 Safari Land Cruiser with pop-up roof & personal guide',
    included: [
      'All meals and luxury accommodations',
      'Unlimited premium bottle water, coffee, and local beverages',
      'All national park entry, conservation, and crater service fees',
      'Professional bilingual certified safari guide'
    ],
    excluded: [
      'International flights and tourist visas',
      'Personal travel insurance',
      'Staff tips and personal premium souvenirs'
    ],
    activities: ['Game Drives', 'Guided Crater Safari', 'Cultural Maasai visit'],
    imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'pkg-2',
    title: 'The Great Migration & Classic Savanna',
    description: 'A five-day five-star expedition spanning Tanzanias legendary Serengeti and the volcanic bowl of Ngorongoro during prime seasonal events.',
    price: 1200,
    days: 5,
    itinerary: [
      { day: 1, title: 'Arusha to endless Serengeti Plains', description: 'Board a luxury domestic flight directly to the Serengeti airstrip. Board your custom 4x4 cruiser and embark on a sunset game drive. Dine at a pristine luxury campsite.' },
      { day: 2, title: 'Great Migration Tracking', description: 'Spend a full day tracking millions of wildebeests and zebras. Witness the intense theater of apex predators following the migrating herds across the plains.' },
      { day: 3, title: 'Serengeti Sunrise Balloon & Game', description: 'Optional breathtaking hot-air balloon flight at dawn. Spend the afternoon uncovering the hidden kopjes (rocky islands) where cheetahs and leopards reside.' },
      { day: 4, title: 'Serengeti to Ngorongoro Rim', description: 'Drive towards the Ngorongoro Conservation Area, stopping at the historical Oldupai Gorge. Settle in a breathtaking lodge perched on the very rim of the crater.' },
      { day: 5, title: 'Crater Floor Safari & Departure', description: 'Descend for a high-density wildlife experience on the crater floor. Lunch beside the hippo pool, then drive back to Arusha for your return flight.' }
    ],
    destinations: ['Serengeti National Park', 'Ngorongoro Conservation Area', 'Oldupai Gorge'],
    accommodation: 'Serengeti Luxury Oasis Lodge / Ngorongoro Crater Rim Lodge',
    transportation: 'Executive Safari Cruiser with Wi-Fi, fridge, and charging ports',
    included: [
      'Domestic flight Arusha to Serengeti airstrip',
      'All luxury suite accommodations on an all-inclusive basis',
      'Private 4x4 land cruiser with premium binoculars',
      'All park ranger fees and conservation duties'
    ],
    excluded: [
      'Hot air balloon flight fee (Optional add-on)',
      'Gratuities for driver and lodge staff',
      'Premium imported liqueurs'
    ],
    activities: ['Predator tracking', 'Lava tube history tours', 'Scenic crater rim hikes'],
    imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'pkg-3',
    title: 'Ultimate Primates & Savanna Crown',
    description: 'The definitive seven-day luxury African safari encompassing Uganda gorilla trekking, Tree-climbing lions, andKenyan Maasai Mara classic plains.',
    price: 1800,
    days: 7,
    itinerary: [
      { day: 1, title: 'Welcome to Entebbe & Queen Elizabeth', description: 'Arrive in Entebbe, Uganda. Fly to Queen Elizabeth National Park. Embark on a Kazinga Channel private boat cruise alongside hippos and elephants.' },
      { day: 2, title: 'Ishasha Tree-Climbing Lions & Bwindi', description: 'Drive through Ishasha to spot the legendary tree-climbing lions. Travel southwards ascending into the majestic rainforests of Bwindi Impenetrable National Park.' },
      { day: 3, title: 'Mountain Gorilla Tracking Experience', description: 'An once-in-a-lifetime mountain gorilla tracking adventure. Spend an emotional hour sitting feet away from these gentle giants. Celebrate over a luxury forest campfire dinner.' },
      { day: 4, title: 'Bwindi to Nairobi & Maasai Mara', description: 'Depart Uganda, fly to Nairobi and transfer directly into Kenyas glorious Maasai Mara Reserve. Settle in an ultra-private river-front tent.' },
      { day: 5, title: 'Mara River & Wildlife Tracking', description: 'A full-day safari in search of the Big Five. Visit the iconic Mara River to observe hippos, crocodiles, and migration crossings.' },
      { day: 6, title: 'Maasai Warrior Encounter', description: 'Immerse yourself of Maasai traditions inside an authentic "Manyatta" community. Spend the afternoon relaxing at the luxury spa before a high-end night drive.' },
      { day: 7, title: 'Mara Plains Dawn Safari & Departure', description: 'Savor one last early morning game drive before taking a domestic aircraft flight back to Nairobi for international transfers.' }
    ],
    destinations: ['Bwindi Volcanoes', 'Queen Elizabeth Park', 'Maasai Mara', 'Ishasha Sector'],
    accommodation: 'Bwindi Gorilla Haven Lodge / Maasai Mara Riverfront Sanctuary',
    transportation: 'Multilingual Guided 4x4 Cruisers and regional charter flights',
    included: [
      'Official gorilla tracking permit ($800 value included)',
      'All regional flights between Entebbe, Bwindi, Mara, and Nairobi',
      'All-inclusive private luxury stays and fine dining meals',
      'Dedicated personal concierge and game trackers'
    ],
    excluded: [
      'International long-haul airline flights',
      'Ugandan & Kenyan tourist visas',
      'Premium spa treatments'
    ],
    activities: ['Gorilla trekking permit', 'Kazinga channel cruise', 'Maasai warrior dance'],
    imageUrl: 'https://images.unsplash.com/photo-1581888227599-779811939961?auto=format&fit=crop&q=80&w=1000'
  }
];

export const INITIAL_SETTINGS: SystemSettings = {
  phone: '0750916698',
  whatsapp: '0750916698',
  email: 'Karimuhemedi@yahoo.com',
  aboutStory: 'Founded with a pure passion for the African soil and its magnificent legacy, African Wise Warrior Safaris was born to bridge the gap between absolute modern luxury travel and authentic cultural safari preservation. Our roots run deep in the ancestral wisdom of professional trackers and conservationists who have walked these savannas for generations.',
  aboutMission: 'To deliver peerless, highly customized luxury safari expeditions in East Africa that foster a sustainable eco-balance, preserve native cultures, and spark a lifetime connection to of Africas wild ecosystems.',
  aboutVision: 'To be recognized globally as the premier guardian of ancient African exploration, setting the industry benchmark for zero-impact carbon-neutral luxury tourism.',
  aboutWhyUs: [
    'Private elite custom luxury 4x4 Land Cruisers with onboard Wi-Fi & cell chargers',
    'Guaranteed expert native guides with 15+ years of tracking precision',
    'Carbon-neutral certified operations protecting wildlife preserves',
    'Direct community support with 10% of profits funding regional school boards',
    '24/7 dedicated private support team from Arusha and Nairobi offices'
  ],
  aboutSliderImages: [
    'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&q=80&w=1200'
  ]
};
