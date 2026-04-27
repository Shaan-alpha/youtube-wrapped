# YouTube Wrapped

A Spotify Wrapped-style dashboard for your YouTube watch history. Analyze your viewing patterns, discover your top channels, genres, and artists, and visualize your watching habits over time.

**Demo:** https://youtube-wrapped-by-shaan.vercel.app

## Features

- 📊 **Comprehensive Analytics** — View your top channels, genres, artists, and viewing patterns
- 🎬 **Detailed Breakdowns** — See listening rhythms, binge sessions, and your night owl score
- 📈 **Timeline Visualization** — Track your viewing history over time
- 🎯 **Personalized Insights** — Discover your main character artist and loyalty patterns
- 🔄 **Real-time Data** — Easy upload and processing of your YouTube watch history

## Architecture

**Data Pipeline:**
```
Google Takeout (JSON) 
  ↓
Databricks (Bronze → Silver → Gold)
  ↓
Enrichment (YouTube Data API, MusicBrainz API)
  ↓
Neon Postgres (Serving Layer)
  ↓
FastAPI Backend
  ↓
Next.js Frontend
```

## Tech Stack

| Component | Technology |
|-----------|-----------|
| **Data Ingestion** | Google Takeout (JSON export) |
| **Data Warehouse** | Databricks Free Edition, Unity Catalog, Delta Lake |
| **Data Transformation** | PySpark (Medallion architecture: Bronze → Silver → Gold) |
| **Data Enrichment** | YouTube Data API v3, MusicBrainz API |
| **Orchestration** | Databricks Workflows |
| **Database** | Neon Postgres (serverless, free tier) |
| **Backend API** | FastAPI on Render |
| **Frontend** | Next.js on Vercel |
| **Styling** | Tailwind CSS |

## Project Structure

```
youtube-wrapped/
├── api/                 # FastAPI backend service
│   ├── app/
│   │   ├── main.py     # API endpoints
│   │   ├── database.py # Database connections
│   │   ├── models.py   # Data models
│   │   └── routers/    # API route handlers
│   └── requirements.txt
├── frontend/            # Next.js web application
│   ├── src/
│   │   ├── app/        # Next.js app directory
│   │   ├── components/ # React components
│   │   └── lib/        # Utilities and API client
│   └── package.json
├── notebooks/           # Databricks notebooks
│   ├── bronze/          # Data ingestion
│   ├── silver/          # Data cleaning and standardization
│   ├── gold/            # Analytics and aggregations
│   └── enrichment/      # API enrichment
├── data/                # Sample data exports
│   └── gold_exports/
├── scripts/             # Utility scripts
└── docs/                # Architecture documentation
```

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+
- Google Takeout data export (your YouTube watch history)
- Databricks account (free tier)
- Neon account (free tier)

### Local Development

**Backend Setup:**
```bash
cd api
pip install -r requirements.txt
python -m app.main
```

**Frontend Setup:**
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Data Pipeline

1. **Export Data** — Download your YouTube watch history from Google Takeout
2. **Ingest** — Upload to Databricks using the Bronze notebook
3. **Clean** — Transform raw data using the Silver notebook
4. **Enrich** — Add metadata using YouTube Data API and MusicBrainz
5. **Aggregate** — Create analytics views using the Gold notebook
6. **Serve** — Query results via FastAPI and display in Next.js dashboard

## Deployment

- **Backend:** Deployed on Render with automated deployments
- **Frontend:** Deployed on Vercel with continuous deployment from GitHub
- **Database:** Neon Postgres serverless

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Status:** ✅ Complete