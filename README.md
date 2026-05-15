# YouTube Wrapped

A personal "Spotify Wrapped" for YouTube watch history. The project turns a Google Takeout export into a polished year-in-review dashboard with Databricks, Neon Postgres, FastAPI, and Next.js.

[Live demo](https://youtube-wrapped-by-shaan.vercel.app) | [API docs](https://youtube-wrapped-api.onrender.com/docs)

[![GitHub Release](https://img.shields.io/github/v/release/Shaan-alpha/Youtube-Wrapped?style=for-the-badge&color=ff0000)](https://github.com/Shaan-alpha/Youtube-Wrapped/releases)
[![GitHub Stars](https://img.shields.io/github/stars/Shaan-alpha/Youtube-Wrapped?style=for-the-badge&color=ffd700)](https://github.com/Shaan-alpha/Youtube-Wrapped/stargazers)
[![GitHub Sponsor](https://img.shields.io/badge/Sponsor-Pink?style=for-the-badge&logo=githubsponsors&logoColor=white&color=ea4aaa)](https://github.com/sponsors/Shaan-alpha)
[![Discussions](https://img.shields.io/badge/Discussions-Active-brightgreen?style=for-the-badge&logo=github)](https://github.com/Shaan-alpha/Youtube-Wrapped/discussions)

> [!NOTE]
> 💬 **Join the Community!** Have questions, want to showcase your own YouTube Wrapped build, or need help configuring Databricks? Join our [GitHub Discussions](https://github.com/Shaan-alpha/Youtube-Wrapped/discussions)!

![YouTube Wrapped overview](docs/screenshots/hero-overview.png)

## Why I Built This

YouTube watch history is full of patterns, but the raw Takeout export is not built for exploration. This project cleans and enriches that data, then presents it as a shareable analytics experience: top artists, music share, genre split, binge sessions, listening rhythm, and loyalty insights.

## Preview

| Personal insights | Listening rhythm |
| --- | --- |
| ![Top artists and genre split](docs/screenshots/artists-genre-split.png) | ![Hourly listening rhythm](docs/screenshots/listening-rhythm.png) |

| Genres and loyalty | Databricks pipeline |
| --- | --- |
| ![Top genres and loyal artists](docs/screenshots/genres-loyalty.png) | ![Databricks silver notebook](docs/screenshots/databricks-pipeline.png) |

## Highlights

- End-to-end data product from Google Takeout JSON to deployed web dashboard.
- Medallion lakehouse pipeline with Bronze, Silver, Enrichment, and Gold notebooks in Databricks.
- Typed FastAPI service backed by Neon Postgres fact tables.
- Next.js dashboard with animated cards, responsive layouts, and cached API calls.
- Music enrichment through YouTube metadata and MusicBrainz-style artist/genre normalization.
- Deployment split across Vercel for the frontend, Render for the API, and Neon for the serving database.

## Architecture

```mermaid
flowchart TD
    subgraph Data_Source ["📤 Data Ingestion"]
        Takeout["Google Takeout (watch-history JSON)"]
    end

    subgraph Databricks_Medallion ["💎 Databricks Medallion Lakehouse"]
        Bronze[("🥉 Bronze Layer\nRaw Data Landing")]
        Silver[("🥈 Silver Layer\nCleaned, Typed, Deduplicated")]
        Enrichment["⚡ Enrichment Engine\nYouTube Metadata & Music Mapping"]
        Gold[("🥇 Gold Layer\nAnalytics Fact Tables")]
    end

    subgraph Serving_Layer ["🚀 Serving & API Layer"]
        Neon[("🐘 Neon PostgreSQL\nServing Database")]
        FastAPI["⚡ FastAPI Backend\n(Hosted on Render)"]
    end

    subgraph Presentation_Layer ["🖥️ Presentation Layer"]
        NextJS["🌐 Next.js Dashboard\n(Hosted on Vercel)"]
    end

    Takeout -->|"Ingest JSON"| Bronze
    Bronze -->|"Parse & Clean"| Silver
    Silver -->|"Add Metadata"| Enrichment
    Enrichment -->|"Aggregate Facts"| Gold
    Gold -->|"Load via Script"| Neon
    Neon -->|"SQL Query"| FastAPI
    FastAPI -->|"REST /api"| NextJS

    style Takeout fill:#ff0000,stroke:#333,stroke-width:2px,color:#fff
    style Bronze fill:#cd7f32,stroke:#333,stroke-width:2px,color:#fff
    style Silver fill:#c0c0c0,stroke:#333,stroke-width:2px,color:#000
    style Gold fill:#ffd700,stroke:#333,stroke-width:2px,color:#000
    style Neon fill:#336791,stroke:#333,stroke-width:2px,color:#fff
    style FastAPI fill:#009688,stroke:#333,stroke-width:2px,color:#fff
    style NextJS fill:#000000,stroke:#333,stroke-width:2px,color:#fff
```

## Tech Stack

| Layer | Tools |
| --- | --- |
| Data source | Google Takeout YouTube watch history |
| Lakehouse | Databricks Free Edition, Unity Catalog, Delta Lake |
| Transformation | PySpark, Databricks notebooks, medallion architecture |
| Enrichment | YouTube Data API, music metadata classification |
| Serving database | Neon Postgres |
| API | FastAPI, SQLAlchemy, Uvicorn |
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4, Recharts, Framer Motion |
| Deployment | Vercel, Render, Neon |

## Project Structure

```text
youtube-wrapped/
|-- api/                 # FastAPI service
|   |-- app/
|   |   |-- main.py      # App setup, CORS, router registration
|   |   |-- database.py  # Neon/Postgres connection
|   |   |-- models.py    # Pydantic response models
|   |   `-- routers/     # Analytics endpoints
|   `-- requirements.txt
|-- frontend/            # Next.js app
|   |-- src/app/         # App Router pages and global styles
|   |-- src/components/  # Dashboard cards and interactions
|   `-- src/lib/api.ts   # Typed API client
|-- notebooks/           # Databricks pipeline notebooks
|   |-- bronze/          # Raw ingestion
|   |-- silver/          # Clean, typed, deduplicated data
|   |-- enrichment/      # Metadata and music enrichment
|   `-- gold/            # Analytics fact tables
|-- scripts/
|   `-- load_to_neon.py  # Loads gold CSV exports into Neon
|-- docs/screenshots/    # README showcase images
`-- render.yaml          # Render API deployment config
```

## Analytics Included

- Overview totals: total watches, music share, unique artists, days tracked.
- Main character artist: the artist that defined the listening year.
- Top artists, channels, and genres.
- Genre split across Desi, Western, and untagged music.
- Listening rhythm by hour and day.
- Binge sessions with video count and duration.
- Loyal artists ranked by listening span.
- Last pipeline run timestamp surfaced in the dashboard footer.

## Run Locally

### Backend

```bash
cd api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Create an API environment file before running against Neon:

```bash
NEON_CONNECTION_STRING=postgresql://user:password@host:port/database
```

The API runs at `http://localhost:8000`, with Swagger docs at `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Create `frontend/.env.local` if your API is not running at the default local URL:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

The dashboard runs at `http://localhost:3000`.

## Data Workflow

1. Export YouTube watch history from Google Takeout.
2. Run `notebooks/bronze/02_bronze_ingest.ipynb` to land the raw history in Databricks.
3. Run `notebooks/silver/03_silver_clean.ipynb` to parse timestamps, clean titles, type columns, and deduplicate rows.
4. Run `notebooks/enrichment/04_enrich_youtube.ipynb` to add video, channel, artist, and genre context.
5. Run `notebooks/gold/05_gold_facts.ipynb` to produce dashboard-ready fact tables.
6. Export `fact_*.csv` files into `data/gold_exports/`.
7. Load the serving tables into Neon:

```bash
python scripts/load_to_neon.py
```

Raw exports, CSVs, and secrets are intentionally ignored by Git so personal watch history is not committed.

## API Surface

The FastAPI app exposes read-only analytics endpoints under `/api`, including:

```text
/api/overview
/api/top-artists
/api/top-channels
/api/top-genres
/api/genre-split
/api/listening-by-hour
/api/listening-by-dayofweek
/api/timeline
/api/main-character
/api/binge-sessions
/api/night-owl-score
/api/loyal-artists
/api/last-pipeline-run
```

## Deployment

- Frontend: deployed on Vercel.
- Backend: deployed on Render using `render.yaml`.
- Database: hosted on Neon Postgres.
- Pipeline: run in Databricks, then loaded into Neon with `scripts/load_to_neon.py`.

## License

MIT License. See [LICENSE](LICENSE).
