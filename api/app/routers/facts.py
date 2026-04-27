"""
All fact endpoints. Each one queries a single gold table from Postgres
and returns it as JSON validated against a Pydantic model.
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.database import get_db
from app import models

router = APIRouter(prefix="/api", tags=["facts"])


def fetch_all(db: Session, sql: str) -> list[dict]:
    """Run a query and return rows as list of dicts."""
    return [dict(row._mapping) for row in db.execute(text(sql)).fetchall()]


def fetch_one(db: Session, sql: str) -> dict | None:
    """Run a query and return single row as dict (or None)."""
    row = db.execute(text(sql)).fetchone()
    return dict(row._mapping) if row else None


@router.get("/overview", response_model=models.Overview)
def get_overview(db: Session = Depends(get_db)):
    row = fetch_one(db, "SELECT * FROM fact_overview LIMIT 1")
    if not row:
        raise HTTPException(404, "Overview data not found")
    return row


@router.get("/top-artists", response_model=List[models.TopArtist])
def get_top_artists(
    limit: int = Query(20, ge=1, le=50),
    db: Session = Depends(get_db),
):
    return fetch_all(db, f"""
        SELECT artist_name, plays, unique_videos
        FROM fact_top_artists
        ORDER BY plays DESC
        LIMIT {limit}
    """)


@router.get("/top-channels", response_model=List[models.TopChannel])
def get_top_channels(
    limit: int = Query(20, ge=1, le=50),
    db: Session = Depends(get_db),
):
    return fetch_all(db, f"""
        SELECT channel_id, channel_name, watches, unique_videos
        FROM fact_top_channels
        ORDER BY watches DESC
        LIMIT {limit}
    """)


@router.get("/top-genres", response_model=List[models.TopGenre])
def get_top_genres(
    limit: int = Query(20, ge=1, le=30),
    db: Session = Depends(get_db),
):
    return fetch_all(db, f"""
        SELECT genre, artists, total_plays
        FROM fact_top_genres
        ORDER BY total_plays DESC
        LIMIT {limit}
    """)


@router.get("/genre-split", response_model=List[models.GenreSplit])
def get_genre_split(db: Session = Depends(get_db)):
    return fetch_all(db, """
        SELECT music_category, plays, pct
        FROM fact_genre_split
        ORDER BY plays DESC
    """)


@router.get("/listening-by-hour", response_model=List[models.HourlyListening])
def get_listening_by_hour(db: Session = Depends(get_db)):
    return fetch_all(db, """
        SELECT watch_hour, watches
        FROM fact_listening_by_hour
        ORDER BY watch_hour
    """)


@router.get("/listening-by-dayofweek", response_model=List[models.DailyListening])
def get_listening_by_dayofweek(db: Session = Depends(get_db)):
    return fetch_all(db, """
        SELECT watch_day_of_week, watch_day_name, watches
        FROM fact_listening_by_dayofweek
        ORDER BY watch_day_of_week
    """)


@router.get("/timeline", response_model=List[models.TimelinePoint])
def get_timeline(db: Session = Depends(get_db)):
    return fetch_all(db, """
        SELECT watch_year, watch_month, year_month, watches, music_watches
        FROM fact_listening_timeline
        ORDER BY watch_year, watch_month
    """)


@router.get("/main-character", response_model=models.MainCharacter)
def get_main_character(db: Session = Depends(get_db)):
    row = fetch_one(db, "SELECT * FROM fact_main_character_artist LIMIT 1")
    if not row:
        raise HTTPException(404, "Main character not found")
    return row


@router.get("/binge-sessions", response_model=List[models.BingeSession])
def get_binge_sessions(
    limit: int = Query(5, ge=1, le=10),
    db: Session = Depends(get_db),
):
    return fetch_all(db, f"""
        SELECT session_id, session_start, session_end, videos_in_session, duration_minutes
        FROM fact_binge_sessions
        ORDER BY videos_in_session DESC
        LIMIT {limit}
    """)


@router.get("/night-owl-score", response_model=models.NightOwlScore)
def get_night_owl_score(db: Session = Depends(get_db)):
    row = fetch_one(db, "SELECT * FROM fact_night_owl_score LIMIT 1")
    if not row:
        raise HTTPException(404, "Night owl score not found")
    return row


@router.get("/loyal-artists", response_model=List[models.LoyalArtist])
def get_loyal_artists(
    limit: int = Query(10, ge=1, le=20),
    db: Session = Depends(get_db),
):
    return fetch_all(db, f"""
        SELECT artist_name, loyalty_span_days, distinct_listening_days,
               total_plays, first_listened, last_listened, days_active_pct
        FROM fact_loyal_artists
        ORDER BY loyalty_span_days DESC
        LIMIT {limit}
    """)