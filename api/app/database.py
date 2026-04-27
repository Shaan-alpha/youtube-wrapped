"""
Postgres connection setup using SQLAlchemy.
Reads connection string from NEON_CONNECTION_STRING in .env.
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv

load_dotenv()

NEON_URL = os.getenv("NEON_CONNECTION_STRING")
if not NEON_URL:
    raise RuntimeError("Missing NEON_CONNECTION_STRING in environment")

# SQLAlchemy needs the +psycopg2 prefix; Neon URLs may use either
# postgresql:// or the legacy postgres:// form.
if NEON_URL.startswith("postgres://"):
    sqlalchemy_url = NEON_URL.replace("postgres://", "postgresql+psycopg2://", 1)
elif NEON_URL.startswith("postgresql://"):
    sqlalchemy_url = NEON_URL.replace("postgresql://", "postgresql+psycopg2://", 1)
else:
    sqlalchemy_url = NEON_URL

engine = create_engine(
    sqlalchemy_url,
    pool_pre_ping=True,   # verify connection before use (helps with Neon cold starts)
    pool_recycle=300,     # recycle connections every 5 min (Neon may close idle ones)
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """FastAPI dependency that yields a DB session and closes it after the request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()