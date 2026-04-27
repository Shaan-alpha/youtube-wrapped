"""
YouTube Wrapped API — FastAPI entry point.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import facts

app = FastAPI(
    title="YouTube Wrapped API",
    description="Personal YouTube watch history insights served from Postgres",
    version="0.1.0",
)

# CORS — allow frontend to call this API
# In production, replace "*" with your Vercel URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(facts.router)


@app.get("/")
def root():
    """Health check + API discovery."""
    return {
        "status": "ok",
        "name": "YouTube Wrapped API",
        "docs": "/docs",
        "endpoints": [
            "/api/overview",
            "/api/top-artists",
            "/api/top-channels",
            "/api/top-genres",
            "/api/genre-split",
            "/api/listening-by-hour",
            "/api/listening-by-dayofweek",
            "/api/timeline",
            "/api/main-character",
            "/api/binge-sessions",
            "/api/night-owl-score",
            "/api/loyal-artists",
        ],
    }