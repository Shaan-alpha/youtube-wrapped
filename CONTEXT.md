# YouTube Wrapped — Project Context

> **Purpose of this file:** stable, slow-changing context that any AI assistant (Claude Code, claude.ai, ChatGPT, etc.) needs to understand this project.
> Paste this into the system prompt of a claude.ai Project, or connect the repo via the claude.ai GitHub connector so it's loaded automatically.
> Update this file only when the architecture, stack, or major decisions change — for day-to-day progress, use `WORKLOG.md` instead.

---

## What this project is

A personal "Spotify Wrapped" for YouTube watch history. It turns a Google Takeout export into a year-in-review dashboard:
- Top artists, channels, genres
- Genre split (desi / western / untagged)
- Listening rhythm by hour and day-of-week
- Binge sessions, loyal artists, main-character artist
- "Last pipeline run" timestamp in the dashboard footer

Live demo: https://youtube-wrapped-by-shaan.vercel.app
API docs: https://youtube-wrapped-api.onrender.com/docs

---

## Architecture (one-liner per layer)

```
Google Takeout JSON
  → Databricks Bronze (raw)
  → Databricks Silver (cleaned, typed, deduped)
  → Databricks Enrichment (YouTube metadata + artist/genre tags)
  → Databricks Gold (analytics fact tables)
  → CSV export to data/gold_exports/
  → scripts/load_to_neon.py loads CSVs into Neon Postgres
  → FastAPI on Render reads Neon and serves JSON at /api/*
  → Next.js 16 on Vercel renders the dashboard, ISR-cached for 1h
```

The pipeline is **manual today** (run notebooks → run loader → done). Migrating to Airflow is the next milestone — see `WORKLOG.md` open items.

---

## Tech stack

| Layer | Tools |
|---|---|
| Pipeline | Databricks Free Edition, Delta Lake, PySpark, medallion architecture |
| Loader | Python script using SQLAlchemy + pandas (`scripts/load_to_neon.py`) |
| Serving DB | Neon Postgres (free tier, may cold-start) |
| API | FastAPI 0.136, SQLAlchemy 2, Uvicorn, deployed on Render (free tier, cold-starts ~30–60s) |
| Frontend | Next.js 16.2.4 (App Router, Turbopack), React 19, TypeScript 5, Tailwind CSS 4, Recharts, Framer Motion |
| Deploy | Vercel (frontend), Render (API), Neon (DB) |

---

## Repo layout

```
youtube-wrapped/
├── api/                  # FastAPI service (deployed to Render)
│   ├── app/
│   │   ├── main.py       # App + CORS (origins from CORS_ORIGINS env var)
│   │   ├── database.py   # Neon connection via SQLAlchemy
│   │   ├── models.py     # Pydantic response models
│   │   └── routers/facts.py  # All /api/* endpoints; uses bind params
│   ├── requirements.txt
│   ├── start.sh
│   └── .python-version   # 3.12 (matches render.yaml)
├── frontend/             # Next.js dashboard (deployed to Vercel)
│   ├── src/app/page.tsx  # Server component, ISR (revalidate=3600), fail-safe fetches
│   ├── src/lib/api.ts    # Typed API client + EMPTY_DATA fallbacks
│   ├── src/components/cards/  # Per-section dashboard cards
│   ├── next.config.ts    # turbopack.root pinned
│   └── package.json
├── notebooks/            # Databricks bronze/silver/enrichment/gold
├── scripts/
│   ├── load_to_neon.py   # CSV → Neon, stamps meta_pipeline_runs
│   └── requirements.txt  # pandas, sqlalchemy, etc.
├── render.yaml           # Render deployment config (CORS_ORIGINS, PYTHON_VERSION)
├── CONTEXT.md            # ← this file
├── WORKLOG.md            # rolling progress log
└── README.md
```

---

## Key environment variables

| Var | Where | Purpose |
|---|---|---|
| `NEON_CONNECTION_STRING` | API + loader | Postgres URL (handles `postgres://` and `postgresql://`) |
| `CORS_ORIGINS` | API | Comma-separated allowed origins; defaults to `*` |
| `NEXT_PUBLIC_API_URL` | Frontend | API base URL; defaults to `http://localhost:8000` |

---

## Running locally

```bash
# Backend
cd api
python -m venv .venv
.venv/Scripts/python -m pip install -r requirements.txt   # Windows
# or: source .venv/bin/activate && pip install -r requirements.txt
NEON_CONNECTION_STRING=postgresql://... uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

---

## Architectural decisions (won't change without strong reason)

1. **Read-only API.** Everything mutating happens in the pipeline; the API only `SELECT`s.
2. **No ORM models** — fact tables come from the pipeline, so we use raw `text()` queries with bind params, validated through Pydantic on the way out.
3. **ISR over force-dynamic.** Dashboard pages are statically prerendered with a 1h revalidate; on-demand revalidation will be wired up once Airflow exists.
4. **Free tiers everywhere.** Render + Neon + Vercel free. Cold starts are accepted as the cost. Migration off Render is on the roadmap.
5. **Personal data is gitignored.** `*.json`, `*.csv`, `*.parquet`, `Takeout/`, `data/` never get committed.

---

## Known constraints / quirks

- **Render free tier cold-starts ~30–60s** — first dashboard load after idle is slow.
- **Recharts + SSR** — the hourly chart uses `dynamic({ ssr: false })` to dodge a width=-1 prerender warning.
- **Two moderate npm advisories** — PostCSS XSS, transitively bundled inside Next 16.2.4. No upstream fix yet; tracked, not actionable.
- **`load_to_neon.py` uses `if_exists="replace"`** — drops & recreates each fact table. Acceptable for one user, will be replaced with idempotent upserts when Airflow lands.
