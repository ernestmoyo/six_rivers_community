# Revert Recipes

This document lists every supported way to roll back the Six Rivers Community
platform if the **major M&E refactor** (the work tracked in
`~/.claude/plans/keen-launching-stroustrup.md`) needs to be undone.

A snapshot of the platform was captured on **2026-05-15** before the refactor
began. It is anchored in four independent places so a failure in any one of
them does not lose the snapshot.

## Snapshot anchors

| Anchor | Value | Where it lives |
|---|---|---|
| Git tag (annotated) | `pre-major-shift-2026-05-15` | Local repo + `origin` |
| Archive branch | `archive/pre-major-shift-2026-05-15` | Local repo + `origin` |
| Snapshot commit | `65d85ec` (on `main`) | Local repo + `origin` |
| Full filesystem zip | `backups/app-pre-major-shift-2026-05-15.zip` (3.8 MB) | Local disk only — `backups/` is git-ignored |
| Schema-only zip | `backups/app-schema-pre-major-shift-2026-05-15.zip` (129 KB) | Local disk only |
| Supabase data dump (REST) | `backups/db-data-pre-major-shift-2026-05-16.json` (19 rows across 14 tables, captured 2026-05-16) | Local disk only |

The zip files exclude `node_modules`, `.next`, and everything in `.gitignore` —
they are clean, faithful snapshots of the tracked working tree at commit
`65d85ec`. `git archive` (not `Compress-Archive`) produced them, which is why
they are small.

## Pick the right revert path

### Path A — Soft revert: create a new commit that undoes a specific change

Use this when only **one bad commit** needs to come back out and intervening
work is worth keeping.

```bash
git log --oneline pre-major-shift-2026-05-15..HEAD   # find the bad commit
git revert <bad-commit-sha>
git push
```

Safe, non-destructive. Preserves history.

### Path B — Hard reset of `main` to the snapshot

Use this when **the whole refactor needs to come out** and nothing on `main`
after `65d85ec` is worth keeping.

```bash
git fetch origin
git checkout main
git reset --hard pre-major-shift-2026-05-15
git push --force-with-lease origin main
```

> **Destructive.** All commits on `main` after the snapshot are removed from
> the tip of `main`. They survive on the archive branch and in the tag, but
> downstream clones / Vercel deploys that don't re-fetch will diverge. Use
> `--force-with-lease` (not `--force`) so this fails if someone else pushed
> in the meantime.

### Path C — Read-only inspection of the snapshot

Use this when you just want to **look at** the old code without disturbing
`main`.

```bash
git checkout archive/pre-major-shift-2026-05-15
# poke around; no changes will persist on main
git checkout main   # when done
```

### Path D — Filesystem restore from the zip

Use this when **git itself is broken** (corrupted .git, accidentally deleted
the repo, etc.) and you need to recover the code from a non-git source.

```bash
# from the project root, with the broken app/ directory removed:
unzip backups/app-pre-major-shift-2026-05-15.zip -d .
git init && git add app/ && git commit -m "restore from snapshot zip"
git remote add origin https://github.com/ernestmoyo/six_rivers_community.git
git fetch origin pre-major-shift-2026-05-15
git reset --hard FETCH_HEAD
```

Or to inspect a single file from the snapshot without restoring:

```bash
unzip -p backups/app-pre-major-shift-2026-05-15.zip app/prisma/schema.prisma | less
```

### Path E — Database rollback (Supabase / Postgres)

Every Prisma migration added in Phase 1+ ships with a paired **down migration**
SQL file in `app/prisma/migrations/<name>/down.sql`. To roll the database back
to the pre-shift state:

```bash
# option 1: prisma migrate resolve + manual down.sql replay
cd app
prisma migrate resolve --rolled-back <migration-name>
psql "$DATABASE_URL" -f prisma/migrations/<migration-name>/down.sql
```

```bash
# option 2: full restore from pre-shift dump (if backups/db-pre-major-shift-2026-05-15.sql was produced)
psql "$DATABASE_URL" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
psql "$DATABASE_URL" -f backups/db-pre-major-shift-2026-05-15.sql
```

> **Path E is destructive of any data added after the snapshot.** Read it
> before you run it. The `db-pre-major-shift-2026-05-15.sql` file is only
> present if Phase 0 §7 produced one — see the section below for whether it
> exists.

## State of the database snapshot

**Status (as of 2026-05-16):** `DATABASE_URL` in `app/.env` was switched
to the live Supabase project (twajlgkdvunrmbbjmmqo, eu-west-1) before
running any additive migration.

A REST-API backup was captured at 2026-05-16 via
`app/scripts/backup-supabase-rest.ts` and stored at
`backups/db-data-pre-major-shift-2026-05-16.json`. It contains all rows
from all 14 existing Supabase tables:

  - field_visits           — 16 rows
  - cattle_incidents       —  2 rows
  - iga_financial_updates  —  1 row
  - (11 other tables empty)

To restore individual rows from the JSON dump:

```bash
node -e "
  const j = require('./backups/db-data-pre-major-shift-2026-05-16.json');
  const t = j.tables.find(x => x.table === 'field_visits');
  console.log(JSON.stringify(t.rows, null, 2));
"
```

`pg_dump` was not used (it isn't installed on the dev machine and the
direct DB host requires IPv6, which doesn't route from this network).
Supabase also keeps its own auto-backups (last one ~4 hours before the
migration) accessible from the dashboard under Project Settings →
Database → Backups.

## How to verify the snapshot is healthy right now

```bash
git tag --list "pre-major-shift-*"                 # → pre-major-shift-2026-05-15
git branch --list "archive/*"                      # → archive/pre-major-shift-2026-05-15
git ls-remote origin "refs/tags/pre-major-shift-*" # → matches local
git rev-parse pre-major-shift-2026-05-15           # → 65d85ec...
test -f backups/app-pre-major-shift-2026-05-15.zip && echo OK
test -f backups/app-schema-pre-major-shift-2026-05-15.zip && echo OK
```

If any of those fail before the refactor proceeds, fix it before continuing.

## Where to find more context

- **Plan**: `~/.claude/plans/keen-launching-stroustrup.md`
- **Memory**: `~/.claude/projects/C--Users-ernes-Documents-Projects-six-rivers-community/memory/MEMORY.md`
- **Snapshot commit message**: `git show 65d85ec --stat`
- **Tag message**: `git show pre-major-shift-2026-05-15` (annotated tag)
