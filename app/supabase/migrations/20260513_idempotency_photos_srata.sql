-- Six Rivers Community — additive Supabase migration
-- 2026-05-13: idempotency on submission tables, photo arrays, SRATA Academy tables.
-- Safe to re-run.

-- ─── Idempotency keys ──────────────────────────────────────────────
alter table if exists field_visits         add column if not exists client_submission_id text;
alter table if exists cattle_incidents     add column if not exists client_submission_id text;
alter table if exists iga_financial_updates add column if not exists client_submission_id text;

create unique index if not exists field_visits_csid_uniq
  on field_visits (client_submission_id) where client_submission_id is not null;
create unique index if not exists cattle_incidents_csid_uniq
  on cattle_incidents (client_submission_id) where client_submission_id is not null;
create unique index if not exists iga_financial_updates_csid_uniq
  on iga_financial_updates (client_submission_id) where client_submission_id is not null;

-- ─── Photo arrays ──────────────────────────────────────────────────
alter table if exists field_visits     add column if not exists photos     text[] default '{}'::text[];
alter table if exists cattle_incidents add column if not exists photo_urls text[] default '{}'::text[];
alter table if exists survival_checks  add column if not exists photo_urls text[] default '{}'::text[];

-- ─── Officer audit ─────────────────────────────────────────────────
-- Local-only officer profiles live in IndexedDB on the device. We store an
-- officer_id (uuid string from the device) on each submission so submissions
-- can be attributed back to the originating field officer.
alter table if exists field_visits         add column if not exists officer_id text;
alter table if exists cattle_incidents     add column if not exists officer_id text;
alter table if exists iga_financial_updates add column if not exists officer_id text;

-- ─── Crop cycles & agroforestry & survival checks ──────────────────
create table if not exists crop_cycles (
  id                    bigserial primary key,
  farmer_id             integer,
  farmer_name           text,
  village_id            integer,
  village_name          text,
  crop_type             text not null,
  planting_date         date not null,
  expected_harvest_date date,
  actual_harvest_date   date,
  area_hectares         numeric,
  expected_yield_kg     numeric,
  yield_kg              numeric,
  status                text not null default 'planted',
  notes                 text,
  photo_urls            text[] default '{}'::text[],
  client_submission_id  text,
  officer_id            text,
  recorded_by           text,
  created_at            timestamptz not null default now()
);
create unique index if not exists crop_cycles_csid_uniq
  on crop_cycles (client_submission_id) where client_submission_id is not null;

create table if not exists agroforestry_plots (
  id                    bigserial primary key,
  farmer_id             integer,
  farmer_name           text,
  village_id            integer,
  village_name          text,
  area_hectares         numeric,
  species_planted       text[] default '{}'::text[],
  planting_date         date not null,
  trees_planted         integer,
  notes                 text,
  photo_urls            text[] default '{}'::text[],
  client_submission_id  text,
  officer_id            text,
  recorded_by           text,
  created_at            timestamptz not null default now()
);
create unique index if not exists agroforestry_plots_csid_uniq
  on agroforestry_plots (client_submission_id) where client_submission_id is not null;

create table if not exists survival_check_submissions (
  id                    bigserial primary key,
  distribution_id       integer,
  plot_id               integer,
  farmer_name           text,
  village_name          text,
  check_date            date not null,
  surviving_count       integer not null,
  total_count           integer,
  survival_rate         numeric,
  notes                 text,
  photo_urls            text[] default '{}'::text[],
  client_submission_id  text,
  officer_id            text,
  recorded_by           text,
  created_at            timestamptz not null default now()
);
create unique index if not exists survival_check_submissions_csid_uniq
  on survival_check_submissions (client_submission_id) where client_submission_id is not null;

create table if not exists radio_sessions (
  id                    bigserial primary key,
  session_date          date not null,
  host_name             text,
  topic                 text,
  duration_minutes      integer,
  estimated_listeners   integer,
  notes                 text,
  client_submission_id  text,
  officer_id            text,
  recorded_by           text,
  created_at            timestamptz not null default now()
);
create unique index if not exists radio_sessions_csid_uniq
  on radio_sessions (client_submission_id) where client_submission_id is not null;

-- ─── SRATA Academy ─────────────────────────────────────────────────
create table if not exists srata_cohorts (
  id            bigserial primary key,
  name          text not null,
  start_date    date not null,
  end_date      date,
  intake_size   integer,
  status        text not null default 'in_training',
  notes         text,
  created_at    timestamptz not null default now()
);

create table if not exists srata_students (
  id                          bigserial primary key,
  cohort_id                   integer references srata_cohorts(id),
  cohort_name                 text,
  full_name                   text not null,
  sex                         text,
  date_of_birth               date,
  district                    text,
  region                      text,
  education_level             text,
  household_size              integer,
  marital_status              text,
  phone                       text,
  has_smartphone              boolean default false,
  has_email                   boolean default false,
  email                       text,
  employment_status_before    text,
  monthly_income_before_tsh   numeric,
  english_level_before        text,
  computer_level_before       text,
  hospitality_experience      boolean default false,
  career_goal                 text,
  preferred_pathway           text,
  enrolled_at                 date not null default now(),
  graduated_at                date,
  status                      text not null default 'enrolled',
  client_submission_id        text,
  officer_id                  text,
  recorded_by                 text,
  created_at                  timestamptz not null default now()
);
create unique index if not exists srata_students_csid_uniq
  on srata_students (client_submission_id) where client_submission_id is not null;

create table if not exists srata_attendance (
  id                    bigserial primary key,
  student_id            integer references srata_students(id),
  cohort_id             integer references srata_cohorts(id),
  session_date          date not null,
  present               boolean not null default true,
  notes                 text,
  client_submission_id  text,
  officer_id            text,
  recorded_by           text,
  created_at            timestamptz not null default now()
);
create unique index if not exists srata_attendance_csid_uniq
  on srata_attendance (client_submission_id) where client_submission_id is not null;

create table if not exists srata_assessments (
  id                    bigserial primary key,
  student_id            integer references srata_students(id),
  cohort_id             integer references srata_cohorts(id),
  kind                  text not null,           -- english|computer|practical|internal
  score                 numeric not null,
  max_score             numeric not null default 100,
  assessment_date       date not null,
  notes                 text,
  client_submission_id  text,
  officer_id            text,
  recorded_by           text,
  created_at            timestamptz not null default now()
);
create unique index if not exists srata_assessments_csid_uniq
  on srata_assessments (client_submission_id) where client_submission_id is not null;

create table if not exists srata_internships (
  id                          bigserial primary key,
  student_id                  integer references srata_students(id),
  cohort_id                   integer references srata_cohorts(id),
  host_institution            text not null,
  department                  text,
  start_date                  date not null,
  end_date                    date,
  supervisor_name             text,
  supervisor_phone            text,
  supervisor_email            text,
  competency_score            numeric,
  punctuality_score           numeric,
  communication_score         numeric,
  teamwork_score              numeric,
  professional_behaviour      numeric,
  completion_status           text default 'in_progress',
  transitioned_to_employment  boolean,
  supervisor_feedback         text,
  client_submission_id        text,
  officer_id                  text,
  recorded_by                 text,
  created_at                  timestamptz not null default now()
);
create unique index if not exists srata_internships_csid_uniq
  on srata_internships (client_submission_id) where client_submission_id is not null;

create table if not exists srata_graduate_traces (
  id                    bigserial primary key,
  student_id            integer references srata_students(id),
  cohort_id             integer references srata_cohorts(id),
  trace_window          text not null,  -- exit|3m|6m|12m|24m
  trace_date            date not null,
  contacted_via         text,
  employed              boolean default false,
  employer              text,
  job_title             text,
  sector                text,
  hospitality_related   boolean,
  monthly_income_tsh    numeric,
  job_retention         boolean,
  promoted              boolean,
  self_employed         boolean,
  business_type         text,
  further_education     boolean,
  notes                 text,
  client_submission_id  text,
  officer_id            text,
  recorded_by           text,
  created_at            timestamptz not null default now()
);
create unique index if not exists srata_graduate_traces_csid_uniq
  on srata_graduate_traces (client_submission_id) where client_submission_id is not null;

create table if not exists srata_employers (
  id                    bigserial primary key,
  name                  text not null,
  sector                text,
  contact_person        text,
  phone                 text,
  email                 text,
  district              text,
  partner_type          text default 'internship',  -- internship|recruiter|both
  repeat_recruitment    boolean default false,
  notes                 text,
  client_submission_id  text,
  officer_id            text,
  recorded_by           text,
  created_at            timestamptz not null default now()
);
create unique index if not exists srata_employers_csid_uniq
  on srata_employers (client_submission_id) where client_submission_id is not null;

-- ─── Storage bucket (photos) ───────────────────────────────────────
-- Create a public-read bucket for field photos. Run once in Supabase Studio
-- if this fails (RLS policies are project-scoped):
--   insert into storage.buckets (id, name, public) values ('sr-photos', 'sr-photos', true);
do $$
begin
  if not exists (select 1 from storage.buckets where id = 'sr-photos') then
    insert into storage.buckets (id, name, public) values ('sr-photos', 'sr-photos', true);
  end if;
exception when others then null;
end$$;
