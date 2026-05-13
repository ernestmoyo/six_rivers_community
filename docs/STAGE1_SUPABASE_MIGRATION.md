# Stage 1 — Run the Supabase migration

You don't need any CLI. The SQL is already written. Here's exactly what to do:

## Step 1.1 — Open the SQL Editor

In your Supabase dashboard for project `twajlgkdvunrmbbjmmqo`:

- Click **SQL Editor** in the left sidebar → **New query**

## Step 1.2 — Paste the migration

Open this file in your editor and copy the entire contents:

- `C:\Users\ernes\Documents\Projects\six_rivers_community\app\supabase\migrations\20260513_idempotency_photos_srata.sql
  `

-- Six Rivers Community — additive Supabase migration

-- 2026-05-13: idempotency on submission tables, photo arrays, SRATA Academy tables.

-- Safe to re-run.

-- ─── Idempotency keys ──────────────────────────────────────────────

altertableifexists field_visits         add column ifnotexists client_submission_id text;

altertableifexists cattle_incidents     add column ifnotexists client_submission_id text;

altertableifexists iga_financial_updates add column ifnotexists client_submission_id text;

createunique indexifnotexists field_visits_csid_uniq

  on field_visits (client_submission_id) where client_submission_id is not null;

createunique indexifnotexists cattle_incidents_csid_uniq

  on cattle_incidents (client_submission_id) where client_submission_id is not null;

createunique indexifnotexists iga_financial_updates_csid_uniq

  on iga_financial_updates (client_submission_id) where client_submission_id is not null;

-- ─── Photo arrays ──────────────────────────────────────────────────

altertableifexists cattle_incidents add column ifnotexists photo_urls text[]default'{}'::text[];

altertableifexists survival_checks  add column ifnotexists photo_urls text[]default'{}'::text[];

-- ─── Officer audit ─────────────────────────────────────────────────

-- Local-only officer profiles live in IndexedDB on the device. We store an

-- officer_id (uuid string from the device) on each submission so submissions

-- can be attributed back to the originating field officer.

altertableifexists field_visits         add column ifnotexists officer_id text;

altertableifexists cattle_incidents     add column ifnotexists officer_id text;

altertableifexists iga_financial_updates add column ifnotexists officer_id text;

-- ─── Crop cycles & agroforestry & survival checks ──────────────────

createtableifnotexists crop_cycles (

  id                    bigserialprimary key,

  farmer_id             integer,

  farmer_name           text,

  village_id            integer,

  village_name          text,

  crop_type             textnot null,

  planting_date         datenot null,

  expected_harvest_date date,

  actual_harvest_date   date,

  area_hectares         numeric,

  expected_yield_kg     numeric,

  yield_kg              numeric,

  status                textnot nulldefault'planted',

  notes                 text,

  photo_urls            text[]default'{}'::text[],

  client_submission_id  text,

  officer_id            text,

  recorded_by           text,

  created_at            timestamptznot nulldefaultnow()

);

createunique indexifnotexists crop_cycles_csid_uniq

  on crop_cycles (client_submission_id) where client_submission_id is not null;

createtableifnotexists agroforestry_plots (

  id                    bigserialprimary key,

  farmer_id             integer,

  farmer_name           text,

  village_id            integer,

  village_name          text,

  area_hectares         numeric,

  species_planted       text[]default'{}'::text[],

  planting_date         datenot null,

  trees_planted         integer,

  notes                 text,

  photo_urls            text[]default'{}'::text[],

  client_submission_id  text,

  officer_id            text,

  recorded_by           text,

  created_at            timestamptznot nulldefaultnow()

);

createunique indexifnotexists agroforestry_plots_csid_uniq

  on agroforestry_plots (client_submission_id) where client_submission_id is not null;

createtableifnotexists survival_check_submissions (

  id                    bigserialprimary key,

  distribution_id       integer,

  plot_id               integer,

  farmer_name           text,

  village_name          text,

  check_date            datenot null,

  surviving_count       integernot null,

  total_count           integer,

  survival_rate         numeric,

  notes                 text,

  photo_urls            text[]default'{}'::text[],

  client_submission_id  text,

  officer_id            text,

  recorded_by           text,

  created_at            timestamptznot nulldefaultnow()

);

createunique indexifnotexists survival_check_submissions_csid_uniq

  on survival_check_submissions (client_submission_id) where client_submission_id is not null;

createtableifnotexists radio_sessions (

  id                    bigserialprimary key,

  session_date          datenot null,

  host_name             text,

  topic                 text,

  duration_minutes      integer,

  estimated_listeners   integer,

  notes                 text,

  client_submission_id  text,

  officer_id            text,

  recorded_by           text,

  created_at            timestamptznot nulldefaultnow()

);

createunique indexifnotexists radio_sessions_csid_uniq

  on radio_sessions (client_submission_id) where client_submission_id is not null;

-- ─── SRATA Academy ─────────────────────────────────────────────────

createtableifnotexists srata_cohorts (

  id            bigserialprimary key,

  name          textnot null,

  start_date    datenot null,

  end_date      date,

  intake_size   integer,

  status        textnot nulldefault'in_training',

  notes         text,

  created_at    timestamptznot nulldefaultnow()

);

createtableifnotexists srata_students (

  id                          bigserialprimary key,

  cohort_id                   integerreferences srata_cohorts(id),

  cohort_name                 text,

  full_name                   textnot null,

  sex                         text,

  date_of_birth               date,

  district                    text,

  region                      text,

  education_level             text,

  household_size              integer,

  marital_status              text,

  phone                       text,

  has_smartphone              booleandefault false,

  has_email                   booleandefault false,

  email                       text,

  employment_status_before    text,

  monthly_income_before_tsh   numeric,

  english_level_before        text,

  computer_level_before       text,

  hospitality_experience      booleandefault false,

  career_goal                 text,

  preferred_pathway           text,

  enrolled_at                 datenot nulldefaultnow(),

  graduated_at                date,

  status                      textnot nulldefault'enrolled',

  client_submission_id        text,

  officer_id                  text,

  recorded_by                 text,

  created_at                  timestamptznot nulldefaultnow()

);

createunique indexifnotexists srata_students_csid_uniq

  on srata_students (client_submission_id) where client_submission_id is not null;

createtableifnotexists srata_attendance (

  id                    bigserialprimary key,

  student_id            integerreferences srata_students(id),

  cohort_id             integerreferences srata_cohorts(id),

  session_date          datenot null,

  present               booleannot nulldefault true,

  notes                 text,

  client_submission_id  text,

  officer_id            text,

  recorded_by           text,

  created_at            timestamptznot nulldefaultnow()

);

createunique indexifnotexists srata_attendance_csid_uniq

  on srata_attendance (client_submission_id) where client_submission_id is not null;

createtableifnotexists srata_assessments (

  id                    bigserialprimary key,

  student_id            integerreferences srata_students(id),

  cohort_id             integerreferences srata_cohorts(id),

  kind                  textnot null,           -- english|computer|practical|internal

  score                 numericnot null,

  max_score             numericnot nulldefault100,

  assessment_date       datenot null,

  notes                 text,

  client_submission_id  text,

  officer_id            text,

  recorded_by           text,

  created_at            timestamptznot nulldefaultnow()

);

createunique indexifnotexists srata_assessments_csid_uniq

  on srata_assessments (client_submission_id) where client_submission_id is not null;

createtableifnotexists srata_internships (

  id                          bigserialprimary key,

  student_id                  integerreferences srata_students(id),

  cohort_id                   integerreferences srata_cohorts(id),

  host_institution            textnot null,

  department                  text,

  start_date                  datenot null,

  end_date                    date,

  supervisor_name             text,

  supervisor_phone            text,

  supervisor_email            text,

  competency_score            numeric,

  punctuality_score           numeric,

  communication_score         numeric,

  teamwork_score              numeric,

  professional_behaviour      numeric,

  completion_status           textdefault'in_progress',

  transitioned_to_employment  boolean,

  supervisor_feedback         text,

  client_submission_id        text,

  officer_id                  text,

  recorded_by                 text,

  created_at                  timestamptznot nulldefaultnow()

);

createunique indexifnotexists srata_internships_csid_uniq

  on srata_internships (client_submission_id) where client_submission_id is not null;

createtableifnotexists srata_graduate_traces (

  id                    bigserialprimary key,

  student_id            integerreferences srata_students(id),

  cohort_id             integerreferences srata_cohorts(id),

  trace_window          textnot null,  -- exit|3m|6m|12m|24m

  trace_date            datenot null,

  contacted_via         text,

  employed              booleandefault false,

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

  created_at            timestamptznot nulldefaultnow()

);

createunique indexifnotexists srata_graduate_traces_csid_uniq

  on srata_graduate_traces (client_submission_id) where client_submission_id is not null;

createtableifnotexists srata_employers (

  id                    bigserialprimary key,

  name                  textnot null,

  sector                text,

  contact_person        text,

  phone                 text,

  email                 text,

  district              text,

  partner_type          textdefault'internship',  -- internship|recruiter|both

  repeat_recruitment    booleandefault false,

  notes                 text,

  client_submission_id  text,

  officer_id            text,

  recorded_by           text,

  created_at            timestamptznot nulldefaultnow()

);

createunique indexifnotexists srata_employers_csid_uniq

  on srata_employers (client_submission_id) where client_submission_id is not null;

-- ─── Storage bucket (photos) ───────────────────────────────────────

-- Create a public-read bucket for field photos. Run once in Supabase Studio

-- if this fails (RLS policies are project-scoped):

--   insert into storage.buckets (id, name, public) values ('sr-photos', 'sr-photos', true);

do $$

begin

  ifnotexists (select1fromstorage.bucketswhere id ='sr-photos') then

    insert intostorage.buckets (id, name, public) values ('sr-photos', 'sr-photos', true);

  endif;

exception when others thennull;

end$$;

Paste it into the SQL editor and click **Run** (or **Ctrl+Enter**).

It's **fully idempotent** (`if not exists` everywhere) — safe to run multiple times. It adds:

- `client_submission_id`, `officer_id`, `photo_urls[]` columns on `field_visits`, `cattle_incidents`, `iga_financial_updates`
- 4 new "missing module" tables: `crop_cycles`, `agroforestry_plots`, `survival_check_submissions`, `radio_sessions`
- 7 SRATA tables: `srata_cohorts`, `srata_students`, `srata_attendance`, `srata_assessments`, `srata_internships`, `srata_graduate_traces`, `srata_employers`
- The `sr-photos` Storage bucket

## Step 1.3 — Verify the Storage bucket

The migration tries to create the bucket but Supabase sometimes blocks bucket inserts via the SQL editor. After running, go to **Storage** in the sidebar:

- If `sr-photos` is there with a green "Public" badge → ✅
- If not: click **New bucket** → name it `sr-photos` → toggle **Public bucket** ON → Create

## Step 1.4 — Storage upload policy (write access)

The bucket lets anyone read (public), but you also need a policy for the anon key to upload. In **Storage → sr-photos → Policies**, add a new policy:

- Name: `Allow anon uploads`
- Allowed operation: **INSERT**
- Target roles: `anon, authenticated`
- USING expression: leave empty
- WITH CHECK expression: `bucket_id = 'sr-photos'`

(Or just paste this SQL in the SQL editor — it does the same thing:)

```sql
create policy "Allow anon uploads to sr-photos"
on storage.objects for insert
to anon, authenticated
with check (bucket_id = 'sr-photos');
```
