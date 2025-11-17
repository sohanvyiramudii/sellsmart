
-- Run this in Supabase SQL editor if needed

create extension if not exists pgcrypto;

create table if not exists creators (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id),
  name text,
  store_slug text unique,
  bio text,
  location text,
  whatsapp text,
  upi_id text,
  image_url text,
  banner_url text,
  is_active boolean default false,
  created_at timestamptz default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references creators(id),
  name text,
  price numeric,
  category text,
  image_url text,
  created_at timestamptz default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references creators(id),
  items jsonb,
  total_amount numeric,
  payment_method text,
  payment_status text,
  customer_name text,
  created_at timestamptz default now()
);
