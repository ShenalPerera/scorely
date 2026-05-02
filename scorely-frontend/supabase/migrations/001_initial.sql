-- Enable pgcrypto for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ─── Tables ───────────────────────────────────────────────────────────────────

create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  created_at timestamptz not null default now()
);

create table public.matches (
  id               uuid primary key default gen_random_uuid(),
  sport            text not null default 'cricket',
  created_by       uuid not null references auth.users(id) on delete cascade,
  status           text not null default 'upcoming'
                     check (status in ('upcoming', 'live', 'completed')),
  config           jsonb not null default '{}',
  current_innings  int not null default 1,
  created_at       timestamptz not null default now()
);

create table public.match_scorers (
  match_id  uuid not null references public.matches(id) on delete cascade,
  user_id   uuid not null references auth.users(id) on delete cascade,
  primary key (match_id, user_id)
);

create table public.events (
  id          uuid primary key default gen_random_uuid(),
  client_id   text not null,
  match_id    uuid not null references public.matches(id) on delete cascade,
  sequence    int not null,
  type        text not null,
  payload     jsonb not null default '{}',
  created_by  uuid not null references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (match_id, client_id)
);

-- ─── Auto-create profile on signup ────────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name'
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Row Level Security ───────────────────────────────────────────────────────

alter table public.profiles      enable row level security;
alter table public.matches        enable row level security;
alter table public.match_scorers  enable row level security;
alter table public.events         enable row level security;

-- profiles
create policy "profiles_select_public"
  on public.profiles for select using (true);

create policy "profiles_update_own"
  on public.profiles for update using (auth.uid() = id);

-- matches
create policy "matches_select_public"
  on public.matches for select using (true);

create policy "matches_insert_auth"
  on public.matches for insert
  with check (auth.uid() is not null and auth.uid() = created_by);

create policy "matches_update_creator"
  on public.matches for update using (auth.uid() = created_by);

-- match_scorers
create policy "match_scorers_select_public"
  on public.match_scorers for select using (true);

create policy "match_scorers_insert_creator"
  on public.match_scorers for insert
  with check (
    auth.uid() is not null and
    exists (
      select 1 from public.matches
      where id = match_id and created_by = auth.uid()
    )
  );

create policy "match_scorers_delete_creator"
  on public.match_scorers for delete
  using (
    exists (
      select 1 from public.matches
      where id = match_id and created_by = auth.uid()
    )
  );

-- events
create policy "events_select_public"
  on public.events for select using (true);

create policy "events_insert_authorized_scorer"
  on public.events for insert
  with check (
    auth.uid() is not null and (
      exists (
        select 1 from public.matches
        where id = match_id and created_by = auth.uid()
      ) or
      exists (
        select 1 from public.match_scorers
        where match_id = events.match_id and user_id = auth.uid()
      )
    )
  );

-- ─── Realtime ─────────────────────────────────────────────────────────────────

alter publication supabase_realtime add table public.events;
