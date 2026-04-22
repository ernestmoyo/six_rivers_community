# Supabase Setup — Six Rivers Community

Wire the 3 live-submission endpoints to the Supabase project. Two steps.

## 1. Create the tables (one-time, ~30 seconds)

In the Supabase dashboard:

1. Go to **SQL Editor** → **+ New query**
2. Paste the contents of [`schema.sql`](./schema.sql) into the editor
3. Click **Run**

You should see 3 tables appear under **Table Editor**:

- `field_visits`
- `cattle_incidents`
- `iga_financial_updates`

All have RLS enabled with permissive policies for the test stage (anyone with the anon key can insert + read). Tighten these before production.

## 2. Set environment variables in Vercel

Dashboard → your project → **Settings → Environment Variables**, then add:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://twajlgkdvunrmbbjmmqo.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_REOEFt4tAE4N7Sr79zFj7Q_xa37h2lK` |

Apply to **Production** + **Preview** + **Development**. Then redeploy (or push any commit — Vercel picks it up).

Local `.env` already has these — dev server reads them on startup.

## What you get

### ✅ Live endpoints

| Form | API route | Supabase table |
|---|---|---|
| Field visit form (`/field/visit`) | `POST /api/field-visits` | `field_visits` |
| Cattle incident form (`/cattle`) | `POST /api/cattle-incidents` | `cattle_incidents` + email alert |
| IGA financial update dialog (`/iga`) | `POST /api/iga-updates` | `iga_financial_updates` |

### ✅ What persists when you share a form link

- Someone opens `https://six-rivers-community.vercel.app/field/visit`, fills in a visit, clicks Submit
- Submission lands in Supabase `field_visits` table
- Within 15 seconds the "Recent Field Visits" table on the page auto-refreshes and shows the new row with a green **Live** badge
- You can see the same rows in Supabase → Table Editor → `field_visits`

### Same pattern for cattle and IGA

- Cattle incident → saved + fires email alert to `CATTLE_NOTIFY_EMAILS` recipients
- IGA financial update → saved to `iga_financial_updates` with a full audit trail per group

### What stays seeded (by design)

- Villages, farmers, eco clubs, radio winners, shambachungu groups, nurseries, distributions, crop cycles, chilli fences, wildlife incidents
- These came from the field team brief and aren't changing day-to-day — no submission pipeline needed
- Still fully editable in the code (`app/src/lib/demo-data.ts`) — push a commit, Vercel redeploys

## Verify

After running the SQL and setting env vars:

```sh
# Local
cd app
npm run dev
# Open http://localhost:3000/cattle
# Report a test incident — should see "Incident saved to database · email alert sent"

# Supabase
# Dashboard → Table Editor → cattle_incidents → refresh
# New row should be there
```

## Tightening before production

When ready to go beyond the test stage:

1. Drop the public `for insert with check (true)` policies
2. Add **authentication** (Supabase Auth or NextAuth) — each field officer gets their own login
3. Scope policies by user role (`auth.jwt() ->> 'role'`)
4. Rotate the publishable key (it's technically public but switch to anon-key-with-RLS-only model once auth is in place)
5. Enable email + phone confirmations if field officers submit via phone
