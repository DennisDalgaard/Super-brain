-- SuperBrain Database Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)

-- ==================== NAMES TABLE ====================
create table public.names (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null default auth.uid(),
  full_name text not null,
  mnemonic_text text,
  ai_description text,
  ai_image_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Row Level Security: users can only see their own names
alter table public.names enable row level security;

create policy "Users can view their own names"
  on public.names for select
  using (auth.uid() = user_id);

create policy "Users can insert their own names"
  on public.names for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own names"
  on public.names for update
  using (auth.uid() = user_id);

create policy "Users can delete their own names"
  on public.names for delete
  using (auth.uid() = user_id);

-- ==================== PEG ENTRIES TABLE ====================
create table public.peg_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null default auth.uid(),
  number integer not null check (number >= 0 and number <= 99),
  peg_word text not null,
  mnemonic_text text,
  ai_description text,
  ai_image_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique(user_id, number)
);

alter table public.peg_entries enable row level security;

create policy "Users can view their own peg entries"
  on public.peg_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert their own peg entries"
  on public.peg_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own peg entries"
  on public.peg_entries for update
  using (auth.uid() = user_id);

create policy "Users can delete their own peg entries"
  on public.peg_entries for delete
  using (auth.uid() = user_id);

-- ==================== NOTES TABLE ====================
create table public.notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null default auth.uid(),
  title text not null,
  content text not null,
  category text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.notes enable row level security;

create policy "Users can view their own notes"
  on public.notes for select
  using (auth.uid() = user_id);

create policy "Users can insert their own notes"
  on public.notes for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own notes"
  on public.notes for update
  using (auth.uid() = user_id);

create policy "Users can delete their own notes"
  on public.notes for delete
  using (auth.uid() = user_id);

-- ==================== INDEXES ====================
create index idx_names_user_id on public.names(user_id);
create index idx_peg_entries_user_id on public.peg_entries(user_id);
create index idx_peg_entries_number on public.peg_entries(user_id, number);
create index idx_notes_user_id on public.notes(user_id);
create index idx_notes_category on public.notes(user_id, category);
