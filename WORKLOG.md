# Worklog

> **Purpose of this file:** rolling log of what we did, what's next, and open questions.
> Bridge between Claude Code (this CLI) and claude.ai. Both sides should read it first and update it at the end of each session.
>
> **Format:** newest entry on top. Each entry has a date heading, "Done", "Next", and "Open questions / blockers" sections.
> Keep it concise — link to commits/PRs instead of re-explaining diffs.
>
> **For the AI assistant:** read the **two most recent entries** before doing anything. After meaningful work, append a new entry at the top of the log (don't edit old ones).

---

## 2026-05-08 — Audit, fixes, and context-bridge setup

### Done
- Full project audit (deps installed, lint/types/build verified, found 12 issues).
- Applied all auto-fixable issues:
  - Deleted empty root `package-lock.json`; updated `.gitignore` so `frontend/package-lock.json` can be committed.
  - Hardened `frontend/src/app/page.tsx` with per-fetch `.catch()` + `EMPTY_DATA` fallbacks in `frontend/src/lib/api.ts` so the build no longer dies when the API is unreachable. Added page-level `revalidate = 3600`.
  - Switched all SQL queries in `api/app/routers/facts.py` from f-string interpolation to `:limit` bind params via `text(...)`.
  - Made CORS origins env-driven via `CORS_ORIGINS` (`api/app/main.py`); added the var to `render.yaml`.
  - Collapsed `/api/last-pipeline-run` from two round-trips to one using `to_regclass(...)`.
  - Made `scripts/load_to_neon.py` handle both `postgres://` and `postgresql://` URLs.
  - Added `scripts/requirements.txt` (pandas was an undeclared dep).
  - Pinned Python version: `api/.python-version` = 3.12, `render.yaml` PYTHON_VERSION = 3.12.
  - Pinned `turbopack.root` in `frontend/next.config.ts` to silence the lockfile-root warning.
- Verified end-to-end: backend imports OK (18 routes), `tsc --noEmit` clean, `eslint` clean, `next build` succeeds with **and** without `NEXT_PUBLIC_API_URL` set.
- Created `CONTEXT.md` (stable project context) and this `WORKLOG.md` (rolling log) so claude.ai and Claude Code can share state.

### Next (in suggested order)
1. **Airflow bootstrap.** Use Astronomer Astro CLI locally; first DAG just runs `scripts/load_to_neon.py` and stamps `meta_pipeline_runs`. Targets: Free Astro Cloud or self-hosted on a $5 VPS.
2. **Idempotent loader.** Replace `if_exists="replace"` with stage-then-truncate-insert in a transaction.
3. **On-demand revalidation.** Add a `revalidate_vercel` Airflow task that hits Vercel's revalidation API; tag fact fetches with a single `"facts"` tag in `frontend/src/lib/api.ts`.
4. **Health endpoints + Sentry.** Add `/api/healthz` and `/api/readyz`; init Sentry in both API and frontend.
5. **Tests.** pytest + httpx for API (Testcontainers Postgres); Playwright smoke for the dashboard.

### Open questions / blockers
- Do we host Airflow on Astro Cloud free tier or self-host? (Astro = zero ops, has DAG limits; self-host = $5/mo VPS, full control.)
- Should the API stay on Render or move to Vercel Route Handlers? Same-origin would delete CORS entirely and remove the cold-start tax.
- Multi-tenant pivot (let any user upload their Takeout) — yes/no? Affects schema (`user_id` partition key everywhere).

### Commits / PRs
- (uncommitted as of this entry — fixes still need to be reviewed and committed)

---

<!-- New entries go above this line. Keep entries concise; link out instead of repeating diffs. -->
