-- Create profiles table to store public user data
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  username text,
  avatar_url text,
  updated_at timestamptz,
  current_level integer not null default 1,
  completed_rituals integer not null default 0,
  collected_artifacts integer not null default 0,
  community_score integer not null default 0,
  current_tier_id text not null default 'seeker',
  total_play_time integer not null default 0,
  favorite_genres text[],
  achievements text[],
  ritual_streak integer not null default 0,

  primary key (id),
  unique(username),
  constraint username_length check (char_length(username) >= 3)
);

comment on table public.profiles is 'Public profile information for each user.';

-- Function to create a public profile for each new user
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data->>'username');
  return new;
end;
$$;

-- Trigger to call the function when a new user signs up
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Set up Storage for Avatars
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Anyone can upload an avatar."
  on storage.objects for insert
  with check ( bucket_id = 'avatars' );
