-- Paste semua ini di Supabase Dashboard > SQL Editor > New query > Run
-- Project: mihkbyarybqnefxmooau

-- 1. Products (migrasi dari lib/data.ts)
create table if not exists products (
  id text primary key,
  name text not null,
  brand text not null,
  price numeric not null,
  category text not null check (category in ('shoes','jerseys','shorts','shirts','other')),
  image text not null,
  rating numeric default 4.8,
  is_new boolean default false,
  featured boolean default false,
  colors text[] default '{}',
  sizes text[] default '{}',
  size_type text default 'letter' check (size_type in ('us','letter','none')),
  tagline text
);
alter table products enable row level security;
drop policy if exists "public read" on products;
create policy "public read" on products for select using (true);
drop policy if exists "admin write" on products;
create policy "admin write" on products for all using (true) with check (true);
-- Untuk production, ganti policy admin write jadi pakai auth.role() = 'admin'

-- 2. Orders (hasil checkout Midtrans)
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_id text unique not null,
  items jsonb not null,
  total numeric not null,
  status text not null default 'pending',
  customer_email text,
  created_at timestamp with time zone default now()
);
alter table orders enable row level security;
drop policy if exists "public insert orders" on orders;
create policy "public insert orders" on orders for insert with check (true);
drop policy if exists "public read orders" on orders;
create policy "public read orders" on orders for select using (true);

-- 3. Seed contoh (opsional, hapus kalau mau isi via admin dashboard)
-- Jalankan seed terpisah via script, atau insert manual di Dashboard > Table Editor
