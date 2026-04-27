"""
Pydantic response models — one per fact table.
These define the JSON shape the API returns.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class Overview(BaseModel):
    total_watches: int
    unique_videos: int
    unique_channels: int
    music_watches: int
    unique_artists: int
    first_watch: Optional[datetime] = None
    latest_watch: Optional[datetime] = None
    days_of_history: int
    music_pct: float


class TopArtist(BaseModel):
    artist_name: str
    plays: int
    unique_videos: int


class TopChannel(BaseModel):
    channel_id: Optional[str] = None
    channel_name: str
    watches: int
    unique_videos: int


class TopGenre(BaseModel):
    genre: str
    artists: int
    total_plays: int


class GenreSplit(BaseModel):
    music_category: str
    plays: int
    pct: float


class HourlyListening(BaseModel):
    watch_hour: int
    watches: int


class DailyListening(BaseModel):
    watch_day_of_week: int
    watch_day_name: str
    watches: int


class TimelinePoint(BaseModel):
    watch_year: int
    watch_month: int
    year_month: str
    watches: int
    music_watches: int


class MainCharacter(BaseModel):
    artist_name: str
    total_plays: int
    peak_month: str
    peak_month_plays: int
    peak_month_pct_of_artist: float


class BingeSession(BaseModel):
    session_id: int
    session_start: datetime
    session_end: datetime
    videos_in_session: int
    duration_minutes: float


class NightOwlScore(BaseModel):
    night_owl_pct: float
    morning_pct: float
    afternoon_pct: float
    evening_pct: float


class LoyalArtist(BaseModel):
    artist_name: str
    loyalty_span_days: int
    distinct_listening_days: int
    total_plays: int
    first_listened: datetime
    last_listened: datetime
    days_active_pct: float