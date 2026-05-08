# YouTube Wrapped — Roadmap

> **Purpose:** the forward-looking, step-by-step plan. Each item is a checkbox.
> When a step is finished, tick it `[x]` and add a one-line link to the relevant `WORKLOG.md` entry.
> Any AI assistant reading this file gets an instant view of "what's done, what's next, what's blocked."
>
> **Hard constraint:** every choice on this roadmap must run on a **free tier**. No paid services.
> When a step has no free option, the entry says so explicitly and proposes a free workaround.
>
> **For the AI assistant:** read this file before proposing new work. After completing a checkbox, tick it and append a `WORKLOG.md` entry. Do not invent items not on this roadmap without flagging them clearly.

---

## Status legend

- `[ ]` not started
- `[~]` in progress
- `[x]` done — links to the WORKLOG entry where it was completed
- `[!]` blocked — see "Open questions / blockers" in the relevant WORKLOG entry

---

## Milestone 0 — Project hygiene (DONE)

- [x] Audit, install deps, fix lint/type/build issues — *2026-05-08*
- [x] Harden `page.tsx` against API failures at build time — *2026-05-08*
- [x] Parameterize SQL queries — *2026-05-08*
- [x] Make CORS env-driven — *2026-05-08*
- [x] Pin Python version (3.12) consistently — *2026-05-08*
- [x] Add CONTEXT.md, WORKLOG.md, CLAUDE.md, ROADMAP.md cross-tool handoff — *2026-05-08*

---

## Milestone 1 — Free orchestration via GitHub Actions

> **Why GitHub Actions, not Airflow?** Real Airflow needs a host. The only fully-free hosting is self-managed (e.g., Oracle Cloud Always Free), which is operationally heavy for a one-DAG pipeline. **GitHub Actions cron jobs are 100% free** for this repo, integrate natively, log every run, and can do everything we need: hit Databricks Jobs API, run `load_to_neon.py`, revalidate Vercel. Migrate to real Airflow later if scheduling outgrows it.

- [ ] **1.1** Create `.github/workflows/refresh-data.yml` with a manual `workflow_dispatch` trigger first (no cron yet, so we don't burn minutes on broken runs).
- [ ] **1.2** Add repo secrets in GitHub Settings → Secrets:
  - `DATABRICKS_HOST`, `DATABRICKS_TOKEN`
  - `NEON_CONNECTION_STRING`
  - `VERCEL_REVALIDATE_URL`, `VERCEL_REVALIDATE_TOKEN` (set up in milestone 3)
- [ ] **1.3** Workflow steps (in order):
  1. Checkout repo
  2. Set up Python 3.12
  3. Install `scripts/requirements.txt` (cached)
  4. Trigger Databricks job for the gold notebook via `databricks-cli` or REST (`POST /api/2.1/jobs/run-now`)
  5. Wait for job completion
  6. Download gold CSVs from Databricks DBFS / Volume to `data/gold_exports/`
  7. Run `python scripts/load_to_neon.py`
  8. Hit the Vercel revalidation endpoint (added in milestone 3)
- [ ] **1.4** Verify a clean manual run end-to-end (tick after green run).
- [ ] **1.5** Add a daily schedule (`cron: '17 3 * * *'` ≈ 3:17 AM UTC, off-peak).
- [ ] **1.6** Add a Slack/Discord webhook on failure (optional; webhook is free).

**Free-tier note:** GitHub Actions gives 2,000 free minutes/month for private repos and unlimited for public. This pipeline ≈ 5 min/day = 150 min/mo. Comfortable margin.

---

## Milestone 2 — Idempotent loader

- [ ] **2.1** Replace `if_exists="replace"` in `scripts/load_to_neon.py` with stage-then-swap:
  - Write to `fact_xxx_staging` table
  - In a single transaction: `TRUNCATE fact_xxx; INSERT INTO fact_xxx SELECT * FROM fact_xxx_staging; DROP TABLE fact_xxx_staging;`
- [ ] **2.2** Add a `pipeline_run_id` column written by the loader for traceability.
- [ ] **2.3** Verify reads from the API never see an empty fact table during a refresh (manual test: hit `/api/overview` while loader is mid-run).

**Free-tier note:** zero cost — pure code change.

---

## Milestone 3 — On-demand revalidation

> Today: ISR refreshes the dashboard once an hour, regardless of whether new data exists. After this milestone: dashboard updates within seconds of a successful pipeline run.

- [ ] **3.1** Add a route handler at `frontend/src/app/api/revalidate/route.ts` that accepts a `POST` with a bearer token, validates against `process.env.REVALIDATE_TOKEN`, and calls `revalidateTag("facts")`.
- [ ] **3.2** Tag every API fetch in `frontend/src/lib/api.ts` with `next: { tags: ["facts"] }`.
- [ ] **3.3** Set `REVALIDATE_TOKEN` in Vercel env vars (any random string).
- [ ] **3.4** Add the GitHub Actions step that hits the route after `load_to_neon.py` succeeds.

**Free-tier note:** Vercel revalidation API is free.

---

## Milestone 4 — Observability (free)

- [ ] **4.1** Add `/api/healthz` (process is up) and `/api/readyz` (DB ping + at least one fact table populated) to the FastAPI service.
- [ ] **4.2** Sign up for Sentry (free tier: 5K events/month).
- [ ] **4.3** Init Sentry in `api/app/main.py` and `frontend/src/app/layout.tsx`.
- [ ] **4.4** Add a Great Expectations / `pandera` validation step inside the GitHub Actions workflow on the gold CSVs:
  - row counts > 0 for every fact table
  - `genre_split.pct` columns sum to 100 (±0.1)
  - no NULL `artist_name` in `fact_top_artists`
  - fail the workflow on violation

**Free-tier note:** Sentry free tier is enough; Great Expectations / pandera are open-source.

---

## Milestone 5 — Tests + CI

- [ ] **5.1** Backend: `pytest` + `httpx.AsyncClient` against a Testcontainers Postgres. One test per endpoint asserting shape and the 404 path.
- [ ] **5.2** Frontend: Playwright smoke test that runs `next build && next start` against a mocked API and screenshot-tests the dashboard hero.
- [ ] **5.3** GitHub Actions: `.github/workflows/ci.yml` running on every PR — lint, typecheck, build, both test suites. Free for public repos.

---

## Milestone 6 — Cut Render, move API to Vercel Route Handlers

> Render's free tier cold-starts ~30–60s. Same-origin Vercel Route Handlers eliminate the cold-start, the CORS boilerplate, and one whole deployment surface.

- [ ] **6.1** Port each `/api/*` endpoint from FastAPI to `frontend/src/app/api/[name]/route.ts` using a thin Postgres client (`@vercel/postgres` or `pg`).
- [ ] **6.2** Move `NEON_CONNECTION_STRING` to Vercel env vars.
- [ ] **6.3** Remove the `api.ts` `fetch(API_BASE + ...)` call pattern → use relative `/api/...` (which is now same-origin).
- [ ] **6.4** Delete the `api/` directory and `render.yaml` once dashboards are confirmed working off the new endpoints for a week.
- [ ] **6.5** Update `CONTEXT.md` to reflect the simplified architecture.

**Free-tier note:** Vercel hobby tier covers personal usage. Neon free tier handles the connection load.

---

## Milestone 7 — Multi-tenant (the side-product pivot)

> Optional but high-impact. Lets any user upload their Takeout and get their own Wrapped. Skip if YouTube Wrapped stays a personal portfolio piece.

- [ ] **7.1** Add Clerk auth (free tier: 10K MAU) via Vercel Marketplace.
- [ ] **7.2** Schema migration: add `user_id` column to every fact table; add `users` table.
- [ ] **7.3** Frontend: protected `/dashboard` route, public `/upload` route.
- [ ] **7.4** `/upload`: accept `watch-history.json`, store to Vercel Blob (free tier).
- [ ] **7.5** GitHub Actions: parameterize the workflow on `user_id`, trigger via `repository_dispatch` from a Vercel route handler when an upload completes.

---

## Milestone 8 — Polish

- [ ] **8.1** Add `frontend/src/app/loading.tsx` (skeleton) and `error.tsx` (error boundary).
- [ ] **8.2** Year-over-year compare via `?year=YYYY` query param.
- [ ] **8.3** Shareable Wrapped story view at `/share/[slug]` with `@vercel/og` for OG images (free).
- [ ] **8.4** Migrate Recharts to Visx or Tremor if responsive issues bite.

---

## Open questions (carry these around until decided)

- Multi-tenant pivot — yes/no? Affects schema and milestone 7 onward.
- Domain: keep Vercel subdomain or buy one (paid, so skip until budget exists).
- Move pipeline off Databricks Free Edition? It's a lakehouse with hard limits — if exhausted, fallback is local PySpark in GitHub Actions (free, slower).

---

## Discovery / parking lot

Drop ideas here that aren't on the roadmap yet but might be worth doing later. Move to a milestone before starting work.

- Embed a tiny "what's playing right now" widget pulled from YouTube Music.
- Compare two users' Wrapped side-by-side (requires multi-tenant first).
- Daily digest email of "what you watched yesterday" (Resend has a free tier).
