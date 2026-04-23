# YouTube Wrapped

Personal YouTube watch history pipeline — a Spotify Wrapped-style dashboard built on a modern data stack.

## Architecture

Google Takeout → Databricks (Delta Lake medallion) → Neon Postgres → FastAPI → Next.js

## Stack

- **Ingestion:** Google Takeout (JSON export)
- **Storage + Compute:** Databricks Free Edition, Unity Catalog, Delta Lake
- **Transformation:** PySpark (Bronze → Silver → Gold)
- **Enrichment:** YouTube Data API v3, MusicBrainz API
- **Orchestration:** Databricks Workflows
- **Serving:** Neon Postgres (free tier)
- **API:** FastAPI on Render
- **Frontend:** Next.js on Vercel

## Status

🚧 In progress

## Structure

- `notebooks/` — Databricks notebooks (bronze, silver, gold, enrichment)
- `api/` — FastAPI backend
- `frontend/` — Next.js dashboard
- `docs/` — architecture diagrams and notes