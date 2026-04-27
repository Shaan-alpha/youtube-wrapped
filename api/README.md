# YouTube Wrapped API

FastAPI backend service for the YouTube Wrapped dashboard. Provides RESTful endpoints to query YouTube analytics from the Neon Postgres database.

## Overview

This API serves the Next.js frontend with aggregated YouTube watch history analytics. All data is pre-computed in the data warehouse (Databricks) and loaded into Postgres for fast queries.

## Tech Stack

- **Framework:** FastAPI (Python async web framework)
- **Database:** Neon Postgres (serverless)
- **Deployment:** Render
- **ORM:** SQLAlchemy

## Project Structure

```
api/
├── app/
│   ├── __init__.py
│   ├── main.py           # FastAPI app initialization
│   ├── database.py       # Database connection setup
│   ├── models.py         # SQLAlchemy models
│   └── routers/
│       ├── __init__.py
│       └── facts.py      # Endpoints for analytics data
├── requirements.txt
└── README.md
```

## API Endpoints

### Facts Router (`/api/facts/`)

All endpoints return pre-computed analytics data:

- `GET /api/facts/overview` — User's YouTube overview statistics
- `GET /api/facts/top-artists` — Top music artists/channels
- `GET /api/facts/top-genres` — Genre distribution
- `GET /api/facts/loyal-artists` — Most frequently listened artists
- `GET /api/facts/main-character-artist` — The defining artist of your year
- `GET /api/facts/listening-timeline` — Viewing history over time
- `GET /api/facts/listening-by-hour` — Hourly distribution
- `GET /api/facts/listening-by-dayofweek` — Day of week patterns
- `GET /api/facts/binge-sessions` — Longest viewing sessions
- `GET /api/facts/night-owl-score` — Late night viewing metric
- `GET /api/facts/genre-split` — Detailed genre breakdown
- `GET /api/facts/top-channels` — Most watched channels

## Environment Setup

### Local Development

1. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables:**
   Create a `.env` file:
   ```
   DATABASE_URL=postgresql://user:password@host:port/database
   ENVIRONMENT=development
   ```

4. **Run the development server:**
   ```bash
   python -m uvicorn app.main:app --reload
   ```

The API will be available at `http://localhost:8000`

### API Documentation

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## Production Deployment

The API is deployed on Render:

1. Push code to the `main` branch
2. Render automatically builds and deploys the service
3. The API is available at `https://youtube-wrapped-api.onrender.com`

## Database Schema

All tables are created from the Databricks Gold layer:

- `fact_overview` — Overall statistics
- `fact_top_artists` — Top artists
- `fact_top_genres` — Genre breakdown
- `fact_top_channels` — Top channels
- `fact_listening_timeline` — Historical timeline
- `fact_listening_by_hour` — Hourly patterns
- `fact_listening_by_dayofweek` — Weekly patterns
- `fact_binge_sessions` — Long viewing sessions
- `fact_night_owl_score` — Night time viewing score
- `fact_loyal_artists` — Artist loyalty metrics
- `fact_main_character_artist` — Main character artist
- `fact_genre_split` — Detailed genre split

## Requirements

See [requirements.txt](requirements.txt) for all dependencies.

Key packages:
- `fastapi` — Web framework
- `uvicorn` — ASGI server
- `sqlalchemy` — ORM
- `psycopg2-binary` — PostgreSQL adapter
- `python-dotenv` — Environment variable management

## Contributing

To add new endpoints:

1. Create a new router in `app/routers/`
2. Define SQLAlchemy models in `app/models.py`
3. Add your routes and return JSON responses
4. Document the endpoint in this README
5. Push to a feature branch and create a PR

## License

MIT
