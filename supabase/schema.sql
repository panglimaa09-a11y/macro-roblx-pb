-- MACRRO ONLINE - Supabase schema
-- Run this only after creating/connecting your Supabase project.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  avatar_url text,
  role text not null default 'user' check (role in ('user','admin')),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.download_links (
  id uuid primary key default gen_random_uuid(),
  original_url text not null,
  normalized_url text,
  domain text,
  title text,
  status text not null default 'active',
  download_count bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.download_sessions (
  id uuid primary key default gen_random_uuid(),
  link_id uuid references public.download_links(id) on delete cascade,
  token_hash text not null unique,
  status text not null default 'created',
  expires_at timestamptz not null,
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.download_logs (
  id bigint generated always as identity primary key,
  session_id uuid references public.download_sessions(id) on delete set null,
  link_id uuid references public.download_links(id) on delete set null,
  event_type text not null,
  ip_hash text,
  user_agent text,
  country text,
  created_at timestamptz not null default now()
);

create table if not exists public.ad_configs (
  id uuid primary key default gen_random_uuid(),
  network text not null,
  placement text not null,
  script text,
  status boolean not null default true,
  priority integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ad_events (
  id bigint generated always as identity primary key,
  ad_id uuid references public.ad_configs(id) on delete set null,
  session_id uuid references public.download_sessions(id) on delete set null,
  event_type text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.system_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value text,
  type text not null default 'string',
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.download_links enable row level security;
alter table public.download_sessions enable row level security;
alter table public.download_logs enable row level security;
alter table public.ad_configs enable row level security;
alter table public.ad_events enable row level security;
alter table public.system_settings enable row level security;

-- Production policies should be tightened around the actual authenticated
-- admin role and server-side service operations. Do not expose service_role
-- credentials to the browser.
