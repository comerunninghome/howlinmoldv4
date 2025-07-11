-- Enable RLS for all relevant tables
alter table public.profiles enable row level security;
alter table public.user_snapshots enable row level security;
alter table public.ritual_artifacts enable row level security;

-- RLS Policies for profiles
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

drop policy if exists "Users can insert their own profile." on public.profiles;
create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

drop policy if exists "Users can update their own profile." on public.profiles;
create policy "Users can update their own profile."
  on public.profiles for update
  using ( auth.uid() = id );

-- RLS Policies for user_snapshots
drop policy if exists "Users can view their own snapshots." on public.user_snapshots;
create policy "Users can view their own snapshots."
  on public.user_snapshots for select
  using ( auth.uid() = user_id );

drop policy if exists "Users can insert their own snapshots." on public.user_snapshots;
create policy "Users can insert their own snapshots."
  on public.user_snapshots for insert
  with check ( auth.uid() = user_id );

drop policy if exists "Users can update their own snapshots." on public.user_snapshots;
create policy "Users can update their own snapshots."
  on public.user_snapshots for update
  using ( auth.uid() = user_id );

drop policy if exists "Users can delete their own snapshots." on public.user_snapshots;
create policy "Users can delete their own snapshots."
  on public.user_snapshots for delete
  using ( auth.uid() = user_id );

-- RLS Policies for ritual_artifacts (assuming public read access)
drop policy if exists "Artifacts are viewable by everyone." on public.ritual_artifacts;
create policy "Artifacts are viewable by everyone."
  on public.ritual_artifacts for select
  using ( true );

-- Trigger for profiles updated_at
create trigger handle_profile_updated_at
before update on public.profiles
for each row
execute procedure public.set_updated_at();
