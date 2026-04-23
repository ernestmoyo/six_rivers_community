# AI features — PARKED (2026-04-23)

The AI scaffolding is complete and deployed, but the user-facing entry points are
commented out. To bring it back online, follow the **Re-enable** section at the
bottom — it's a 2-line change plus a verification build.

## What's built (deployed, dormant)

### 1. `/api/ai` endpoint
File: [`app/src/app/api/ai/route.ts`](../app/src/app/api/ai/route.ts)

- Model: `claude-haiku-4-5-20251001` via `@anthropic-ai/sdk`
- Prompt caching enabled on the system prompt + data snapshot (cuts repeat-question
  cost ~10x)
- Two modes:
  - `mode: "ask"` — free-form Q&A for the chat widget (max 800 tokens)
  - `mode: "highlights"` — structured bullet list for the PDF report (max 600 tokens)
- Graceful `503 "AI not configured"` when `ANTHROPIC_API_KEY` is missing —
  consumers show a toast and fall back to templated content

### 2. Data snapshot builder
File: [`app/src/lib/data-snapshot.ts`](../app/src/lib/data-snapshot.ts)

- Exports `buildDataSnapshot()` that returns a compact, LLM-friendly JSON
  covering: KPIs, 21 villages, farmer lifecycle summary, IGA portfolio with
  top/bottom lists, Eco Clubs, radio, wildlife, cattle, field visits, species
- No raw arrays — only aggregates/samples so the payload stays small and the
  LLM can reason over the whole programme in one prompt

### 3. "Ask the data" chat component
File: [`app/src/components/shared/ask-the-data.tsx`](../app/src/components/shared/ask-the-data.tsx)

- Collapsible card rendered at the top of the Dashboard
- 4 suggested questions as clickable chips
- Multi-turn conversation held in local state (no server persistence)
- Auto-scroll on new message, loading spinner, toast on error
- Keyboard: Enter to submit, Shift+Enter for newline

### 4. AI-enhanced PDF button
File: [`app/src/app/(main)/impact/page.tsx`](../app/src/app/(main)/impact/page.tsx)

- "Generate AI-enhanced PDF" button in the export toolbar
- Calls `/api/ai?mode=highlights` to get 5 LLM-written key-highlight bullets,
  then passes them to `buildReport({ aiHighlights: bullets })` which replaces
  the templated "Key Highlights" section
- Falls back to templated defaults if AI call fails

## Environment

```
ANTHROPIC_API_KEY="sk-ant-api03-..."
```

- Set in local [`app/.env`](../app/.env) (gitignored — not in repo)
- Set in Vercel → Project Settings → Environment Variables for Production +
  Preview + Development
- Budget: recommend $5–10/month cap on the Anthropic console

## Why parked

Decision from 2026-04-23 before the field-team demo: ship the non-AI report
upgrades first (gender breakdown, IGA portfolio, farmer lifecycle, field visit
activity, XLSX export, reporting-period picker) and revisit AI in a later
iteration once the core M&E story is validated.

Cost signal: Haiku with prompt caching — a whole demo session is pennies.
Nothing about the decision is budget-driven; it's scope focus.

## Re-enable (2 edits + a rebuild)

### Edit 1: Dashboard
[`app/src/app/(main)/dashboard/page.tsx`](../app/src/app/(main)/dashboard/page.tsx)

Uncomment the import:
```diff
-// import { AskTheData } from "@/components/shared/ask-the-data";
+import { AskTheData } from "@/components/shared/ask-the-data";
```

Uncomment the render:
```diff
-{/* <AskTheData /> */}
+<AskTheData />
```

### Edit 2: Impact page
[`app/src/app/(main)/impact/page.tsx`](../app/src/app/(main)/impact/page.tsx)

Uncomment:
1. The `aiLoading` state + `downloadAIEnhancedPDF` function block (search for
   `PARKED — AI-enhanced PDF`)
2. The `<Button>` tag in the toolbar (search for the same comment marker)

### Verify

```bash
cd app
npx next build
```

Should compile cleanly with 35+ routes. Then deploy — no additional env vars
needed (they're already in Vercel).

## Future enhancements (once re-enabled)

- Add a system-prompt sliver that names specific team members (Lilian for
  cattle, Mary for impact, Edna for M&E) so the LLM references them correctly
- Stream the response via `client.messages.stream()` so tokens render as they
  arrive (better UX than "Thinking..." spinner)
- Add a "Copy to clipboard" action under each assistant message
- Wire semantic search on the header search box using Voyage AI or OpenAI
  `text-embedding-3-small` over village/farmer/incident descriptions
- Generate the weekly Edna digest automatically via a Vercel Cron → AI → email
  pipeline
