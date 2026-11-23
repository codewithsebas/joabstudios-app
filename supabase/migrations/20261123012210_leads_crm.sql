-- JoabStudios · Leads CRM
-- Access model:
--   * Public visitors never touch these tables. Quote/contact submissions are
--     validated in a Next.js Server Action and inserted with the secret key.
--   * Admins (rows in public.admin_users) can read and update leads and add
--     notes through the Data API with their own session; RLS enforces it.
--   * Every status / follow-up / quote change is logged by a trigger, so the
--     history can't be skipped or forged from the client.

-- ---------------------------------------------------------------------------
-- Types
-- ---------------------------------------------------------------------------
create type public.lead_status as enum ('new', 'contacted', 'quoted', 'negotiation', 'won', 'lost');
create type public.lead_source as enum ('quote', 'contact');
create type public.lead_event_type as enum ('created', 'status_changed', 'note', 'follow_up_set', 'quote_value_set');

-- ---------------------------------------------------------------------------
-- Private schema for helper functions (not exposed through the Data API)
-- ---------------------------------------------------------------------------
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

-- ---------------------------------------------------------------------------
-- Admin users (authorization). Rows are managed by the project owner via SQL
-- or the dashboard, never from the app.
-- ---------------------------------------------------------------------------
create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'admin' check (role in ('admin', 'sales')),
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create policy "Admins can read their own membership"
  on public.admin_users for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- SECURITY DEFINER so policies on other tables can check membership without
-- recursing into admin_users' own RLS. Lives in the private schema, pins
-- search_path, and only answers for the calling user.
create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users au where au.user_id = (select auth.uid())
  );
$$;

revoke all on function private.is_admin() from public, anon;
grant execute on function private.is_admin() to authenticated;

-- ---------------------------------------------------------------------------
-- Leads
-- ---------------------------------------------------------------------------
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  source public.lead_source not null,
  status public.lead_status not null default 'new',

  accommodation_type text check (char_length(accommodation_type) <= 60),
  services text[] not null default '{}' check (cardinality(services) <= 12),
  business_name text check (char_length(business_name) <= 160),
  location text check (char_length(location) <= 160),
  website text check (char_length(website) <= 300),
  units integer check (units between 1 and 10000),

  full_name text not null check (char_length(full_name) between 2 and 120),
  email text not null check (char_length(email) between 5 and 254),
  whatsapp text check (char_length(whatsapp) <= 30),
  budget text check (char_length(budget) <= 60),
  message text check (char_length(message) <= 4000),

  follow_up_date date,
  quote_value numeric(14, 2) check (quote_value >= 0),
  quote_currency text not null default 'COP' check (quote_currency ~ '^[A-Z]{3}$'),

  -- Abuse prevention: salted SHA-256 of the client IP, never the raw IP.
  ip_hash text check (char_length(ip_hash) = 64),
  user_agent text check (char_length(user_agent) <= 400)
);

create index leads_created_at_idx on public.leads (created_at desc);
create index leads_status_created_at_idx on public.leads (status, created_at desc);
create index leads_ip_hash_created_at_idx on public.leads (ip_hash, created_at desc) where ip_hash is not null;

alter table public.leads enable row level security;

create policy "Admins can read leads"
  on public.leads for select
  to authenticated
  using ((select private.is_admin()));

create policy "Admins can update leads"
  on public.leads for update
  to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

-- No insert/delete policies: inserts happen server-side with the secret key.

-- Admins may only change CRM fields; contact data stays as the client sent it.
revoke all on public.leads from anon, authenticated;
grant select on public.leads to authenticated;
grant update (status, follow_up_date, quote_value, quote_currency) on public.leads to authenticated;

-- ---------------------------------------------------------------------------
-- Lead events (history + internal notes)
-- ---------------------------------------------------------------------------
create table public.lead_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  created_at timestamptz not null default now(),
  actor_id uuid references auth.users (id) on delete set null,
  type public.lead_event_type not null,
  from_status public.lead_status,
  to_status public.lead_status,
  body text check (char_length(body) <= 4000),
  metadata jsonb not null default '{}'::jsonb
);

create index lead_events_lead_id_created_at_idx on public.lead_events (lead_id, created_at desc);
create index lead_events_actor_id_idx on public.lead_events (actor_id);

alter table public.lead_events enable row level security;

create policy "Admins can read lead events"
  on public.lead_events for select
  to authenticated
  using ((select private.is_admin()));

create policy "Admins can add notes as themselves"
  on public.lead_events for insert
  to authenticated
  with check (
    (select private.is_admin())
    and type = 'note'
    and actor_id = (select auth.uid())
    and char_length(btrim(body)) > 0
  );

revoke all on public.lead_events from anon, authenticated;
grant select on public.lead_events to authenticated;
grant insert (lead_id, actor_id, type, body) on public.lead_events to authenticated;

revoke all on public.admin_users from anon, authenticated;
grant select on public.admin_users to authenticated;

-- ---------------------------------------------------------------------------
-- Triggers: updated_at and automatic history
-- ---------------------------------------------------------------------------
create or replace function private.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger leads_touch_updated_at
  before update on public.leads
  for each row execute function private.touch_updated_at();

-- Runs as definer so it can write events the caller can't insert directly
-- (only 'note' is insertable by admins). It records auth.uid() as the actor.
create or replace function private.log_lead_changes()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := (select auth.uid());
begin
  if tg_op = 'INSERT' then
    insert into public.lead_events (lead_id, actor_id, type, to_status, metadata)
    values (new.id, null, 'created', new.status, jsonb_build_object('source', new.source));
    return new;
  end if;

  if new.status is distinct from old.status then
    insert into public.lead_events (lead_id, actor_id, type, from_status, to_status)
    values (new.id, actor, 'status_changed', old.status, new.status);
  end if;

  if new.follow_up_date is distinct from old.follow_up_date then
    insert into public.lead_events (lead_id, actor_id, type, metadata)
    values (new.id, actor, 'follow_up_set',
      jsonb_build_object('from', old.follow_up_date, 'to', new.follow_up_date));
  end if;

  if new.quote_value is distinct from old.quote_value or new.quote_currency is distinct from old.quote_currency then
    insert into public.lead_events (lead_id, actor_id, type, metadata)
    values (new.id, actor, 'quote_value_set',
      jsonb_build_object('from', old.quote_value, 'to', new.quote_value, 'currency', new.quote_currency));
  end if;

  return new;
end;
$$;

revoke all on function private.log_lead_changes() from public, anon, authenticated;
revoke all on function private.touch_updated_at() from public, anon, authenticated;

create trigger leads_log_insert
  after insert on public.leads
  for each row execute function private.log_lead_changes();

create trigger leads_log_update
  after update on public.leads
  for each row execute function private.log_lead_changes();

-- ---------------------------------------------------------------------------
-- Server access (secret key). New tables are not auto-exposed to the Data
-- API, so grant the server role explicitly. It bypasses RLS by design and is
-- only ever used from server code.
-- ---------------------------------------------------------------------------
grant usage on schema public to service_role;
grant select, insert on public.leads to service_role;
grant select on public.lead_events to service_role;
grant select on public.admin_users to service_role;
