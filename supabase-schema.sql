-- ==========================================================
-- SUPABASE POSTGRESQL SCHEMA FOR AFRICAN WISE WARRIOR SAFARIS
-- Copy and paste this directly into your Supabase SQL Editor
-- ==========================================================

-- Enable Row Level Security
alter table if exists public.users enable row level security;
alter table if exists public.countries enable row level security;
alter table if exists public.national_parks enable row level security;
alter table if exists public.packages enable row level security;
alter table if exists public.bookings enable row level security;
alter table if exists public.contact_messages enable row level security;
alter table if exists public.settings enable row level security;

-- 1. USERS TABLE
create table if not exists public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null unique,
  full_name text not null,
  phone_number text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. COUNTRIES TABLE
create table if not exists public.countries (
  id text not null primary key, -- slug like 'tanzania'
  name text not null unique,
  image_url text not null,
  slug text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. NATIONAL PARKS TABLE
create table if not exists public.national_parks (
  id text not null primary key, -- slug like 'serengeti'
  name text not null unique,
  country_id text references public.countries(id) on delete cascade not null,
  description text not null,
  activities text[] not null default '{}',
  best_season text,
  location text,
  image_url text not null,
  gallery text[] not null default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. PACKAGES TABLE
create table if not exists public.packages (
  id text not null primary key, -- 'pkg-...'
  title text not null,
  description text not null,
  price numeric not null check (price >= 0),
  days integer not null check (days > 0),
  itinerary jsonb not null default '[]'::jsonb,
  destinations text[] not null default '{}',
  accommodation text not null,
  transportation text not null,
  included text[] not null default '{}',
  excluded text[] not null default '{}',
  activities text[] not null default '{}',
  image_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. BOOKINGS TABLE
create table if not exists public.bookings (
  id text not null primary key, -- 'bk-...'
  full_name text not null,
  email text not null,
  phone_number text not null,
  package_id text references public.packages(id) on delete set null,
  package_title text not null,
  travelers integer not null check (travelers > 0),
  travel_date date not null,
  message text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. CONTACT MESSAGES TABLE
create table if not exists public.contact_messages (
  id text not null primary key, -- 'msg-...'
  name text not null,
  email text not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. SETTINGS TABLE (Global System Settings)
create table if not exists public.settings (
  id text not null primary key default 'global-settings',
  phone text not null default '0750916698',
  whatsapp text not null default '0750916698',
  email text not null default 'Karimuhemedi@yahoo.com',
  about_story text not null,
  about_mission text not null,
  about_vision text not null,
  about_why_us text[] not null default '{}',
  about_slider_images text[] not null default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================

-- USERS POLICIES
create policy "Allow public profile viewing" on public.users 
  for select using (true);

create policy "Allow users to update their own profiles" on public.users 
  for update using (auth.uid() = id);

-- COUNTRIES POLICIES
create policy "Allow public read-only access to countries" on public.countries
  for select using (true);

create policy "Allow full admin control on countries" on public.countries
  for all using (
    exists (
      select 1 from public.users 
      where users.id = auth.uid() and users.role = 'admin'
    )
  );

-- NATIONAL PARKS POLICIES
create policy "Allow public read-only access to national parks" on public.national_parks
  for select using (true);

create policy "Allow full admin control on national_parks" on public.national_parks
  for all using (
    exists (
      select 1 from public.users 
      where users.id = auth.uid() and users.role = 'admin'
    )
  );

-- PACKAGES POLICIES
create policy "Allow public read-only access to packages" on public.packages
  for select using (true);

create policy "Allow full admin control on packages" on public.packages
  for all using (
    exists (
      select 1 from public.users 
      where users.id = auth.uid() and users.role = 'admin'
    )
  );

-- BOOKINGS POLICIES
create policy "Allow authenticated users to create a booking" on public.bookings
  for insert with check (true); -- anyone can book, representing clients

create policy "Allow users to view their own bookings" on public.bookings
  for select using (
    email = auth.jwt()->>'email' or
    exists (
      select 1 from public.users 
      where users.id = auth.uid() and users.role = 'admin'
    )
  );

create policy "Allow admins complete access to bookings" on public.bookings
  for all using (
    exists (
      select 1 from public.users 
      where users.id = auth.uid() and users.role = 'admin'
    )
  );

-- CONTACT MESSAGES POLICIES
create policy "Allow anonymous message registration" on public.contact_messages
  for insert with check (true);

create policy "Allow admins message observation" on public.contact_messages
  for select using (
    exists (
      select 1 from public.users 
      where users.id = auth.uid() and users.role = 'admin'
    )
  );

-- SETTINGS POLICIES
create policy "Allow public global settings reads" on public.settings
  for select using (true);

create policy "Allow admins global settings updates" on public.settings
  for update using (
    exists (
      select 1 from public.users 
      where users.id = auth.uid() and users.role = 'admin'
    )
  );

-- ==========================================================
-- SEED INITIAL SETTINGS
-- ==========================================================
insert into public.settings (
  id, phone, whatsapp, email, about_story, about_mission, about_vision, about_why_us, about_slider_images
) values (
  'global-settings',
  '0750916698',
  '0750916698',
  'Karimuhemedi@yahoo.com',
  'Founded with a pure passion for the African soil and its magnificent legacy, African Wise Warrior Safaris was born to bridge the gap between absolute modern luxury travel and authentic cultural safari preservation. Our roots run deep in the ancestral wisdom of professional trackers and conservationists who have walked these savannas for generations.',
  'To deliver peerless, highly customized luxury safari expeditions in East Africa that foster a sustainable eco-balance, preserve native cultures, and spark a lifetime connection to of Africas wild ecosystems.',
  'To be recognized globally as the premier guardian of ancient African exploration, setting the industry benchmark for zero-impact carbon-neutral luxury tourism.',
  array[
    'Private elite custom luxury 4x4 Land Cruisers with onboard Wi-Fi',
    'Guaranteed expert native guides with 15+ years of tracking precision',
    'Carbon-neutral certified operations protecting wildlife preserves',
    'Direct community support with 10% of profits funding regional school boards',
    '24/7 dedicated private support team from Arusha and Nairobi offices'
  ],
  array[
    'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&q=80&w=1200'
  ]
) on conflict (id) do nothing;
