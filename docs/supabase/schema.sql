-- Six Rivers Community Intelligence — Supabase Schema
-- Paste this into Supabase SQL Editor (dashboard → SQL Editor → + New Query → Run)
--
-- 3 tables for live submissions from shared form links:
--   1. field_visits            — Field officers submit visits from the field
--   2. cattle_incidents        — Cattle pressure reports (Mbarali) + email alert
--   3. iga_financial_updates   — IGA group capital / revenue / expense updates
--
-- RLS is ENABLED with permissive policies for test stage (public read + write).
-- Tighten these before going to production.

-- ──────────────────────────────────────────────────────────
-- 1. field_visits
-- ──────────────────────────────────────────────────────────

create table if not exists public.field_visits (
  id             bigserial primary key,
  user_name      text not null default 'Field Officer',
  village_id     integer,
  village_name   text,
  visit_date     date not null,
  visit_type     text not null,
  location_lat   double precision,
  location_lng   double precision,
  notes          text default '',
  created_at     timestamptz not null default now()
);

create index if not exists field_visits_created_at_idx
  on public.field_visits (created_at desc);

alter table public.field_visits enable row level security;

drop policy if exists "public insert field_visits" on public.field_visits;
drop policy if exists "public select field_visits" on public.field_visits;

create policy "public insert field_visits"
  on public.field_visits for insert with check (true);

create policy "public select field_visits"
  on public.field_visits for select using (true);

-- ──────────────────────────────────────────────────────────
-- 2. cattle_incidents
-- ──────────────────────────────────────────────────────────

create table if not exists public.cattle_incidents (
  id                bigserial primary key,
  village_id        integer,
  village_name      text,
  incident_type     text not null,
  severity          text not null,
  incident_date     date not null,
  estimated_herd    integer,
  description       text,
  location_lat      double precision,
  location_lng      double precision,
  reported_by       text not null default 'Field Officer',
  photo_url         text,
  email_sent        boolean not null default false,
  created_at        timestamptz not null default now()
);

create index if not exists cattle_incidents_created_at_idx
  on public.cattle_incidents (created_at desc);

alter table public.cattle_incidents enable row level security;

drop policy if exists "public insert cattle_incidents" on public.cattle_incidents;
drop policy if exists "public select cattle_incidents" on public.cattle_incidents;

create policy "public insert cattle_incidents"
  on public.cattle_incidents for insert with check (true);

create policy "public select cattle_incidents"
  on public.cattle_incidents for select using (true);

-- ──────────────────────────────────────────────────────────
-- 3. iga_financial_updates
-- ──────────────────────────────────────────────────────────

create table if not exists public.iga_financial_updates (
  id                  bigserial primary key,
  group_id            integer not null,
  group_name          text not null,
  current_capital_tsh bigint not null,
  revenue_tsh         bigint not null,
  expense_tsh         bigint not null,
  status              text not null,
  notes               text,
  reported_by         text not null default 'Group Leader',
  created_at          timestamptz not null default now()
);

create index if not exists iga_updates_group_idx
  on public.iga_financial_updates (group_id, created_at desc);

alter table public.iga_financial_updates enable row level security;

drop policy if exists "public insert iga_updates" on public.iga_financial_updates;
drop policy if exists "public select iga_updates" on public.iga_financial_updates;

create policy "public insert iga_updates"
  on public.iga_financial_updates for insert with check (true);

create policy "public select iga_updates"
  on public.iga_financial_updates for select using (true);

-- ──────────────────────────────────────────────────────────
-- Done. 3 tables, indexes, RLS enabled with permissive test-stage policies.
-- ──────────────────────────────────────────────────────────
