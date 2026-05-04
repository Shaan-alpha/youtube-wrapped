# YouTube Wrapped

A personal "Spotify Wrapped" for YouTube watch history. The project turns a Google Takeout export into a polished year-in-review dashboard with Databricks, Neon Postgres, FastAPI, and Next.js.

[Live demo](https://youtube-wrapped-by-shaan.vercel.app) | [API docs](https://youtube-wrapped-api.onrender.com/docs)

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

```text
Google Takeout watch-history JSON
        |
        v
Databricks Bronze layer
        |
        v
Databricks Silver layer
cleaning, typing, deduplication
        |
        v
Enrichment layer
YouTube metadata + artist/genre mapping
        |
        v
Databricks Gold layer
analytics fact tables
        |
        v
Neon Postgres
        |
        v
FastAPI on Render
        |
        v
Next.js dashboard on Vercel
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
