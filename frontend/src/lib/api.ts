const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/+$/, "");

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    next: { revalidate: 3600 }, // cache for 1 hour — data is static
  });
  if (!res.ok) {
    throw new Error(`API ${path} failed: ${res.status}`);
  }
  return res.json();
}

// Types matching your FastAPI response models
export type Overview = {
  total_watches: number;
  unique_videos: number;
  unique_channels: number;
  music_watches: number;
  unique_artists: number;
  first_watch: string;
  latest_watch: string;
  days_of_history: number;
  music_pct: number;
};

export type TopArtist = { artist_name: string; plays: number; unique_videos: number };
export type TopChannel = { channel_id: string | null; channel_name: string; watches: number; unique_videos: number };
export type TopGenre = { genre: string; artists: number; total_plays: number };
export type GenreSplit = { music_category: string; plays: number; pct: number };
export type HourlyListening = { watch_hour: number; watches: number };
export type DailyListening = { watch_day_of_week: number; watch_day_name: string; watches: number };
export type TimelinePoint = { watch_year: number; watch_month: number; year_month: string; watches: number; music_watches: number };
export type MainCharacter = {
  artist_name: string;
  total_plays: number;
  peak_month: string;
  peak_month_plays: number;
  peak_month_pct_of_artist: number;
};
export type BingeSession = {
  session_id: number;
  session_start: string;
  session_end: string;
  videos_in_session: number;
  duration_minutes: number;
};
export type NightOwlScore = {
  night_owl_pct: number;
  morning_pct: number;
  afternoon_pct: number;
  evening_pct: number;
};
export type LoyalArtist = {
  artist_name: string;
  loyalty_span_days: number;
  distinct_listening_days: number;
  total_plays: number;
  first_listened: string;
  last_listened: string;
  days_active_pct: number;
};

export const api = {
  overview: () => fetchJson<Overview>("/api/overview"),
  topArtists: (limit = 10) => fetchJson<TopArtist[]>(`/api/top-artists?limit=${limit}`),
  topChannels: (limit = 10) => fetchJson<TopChannel[]>(`/api/top-channels?limit=${limit}`),
  topGenres: (limit = 10) => fetchJson<TopGenre[]>(`/api/top-genres?limit=${limit}`),
  genreSplit: () => fetchJson<GenreSplit[]>("/api/genre-split"),
  byHour: () => fetchJson<HourlyListening[]>("/api/listening-by-hour"),
  byDayOfWeek: () => fetchJson<DailyListening[]>("/api/listening-by-dayofweek"),
  timeline: () => fetchJson<TimelinePoint[]>("/api/timeline"),
  mainCharacter: () => fetchJson<MainCharacter>("/api/main-character"),
  bingeSessions: (limit = 5) => fetchJson<BingeSession[]>(`/api/binge-sessions?limit=${limit}`),
  nightOwlScore: () => fetchJson<NightOwlScore>("/api/night-owl-score"),
  loyalArtists: (limit = 5) => fetchJson<LoyalArtist[]>(`/api/loyal-artists?limit=${limit}`),
};