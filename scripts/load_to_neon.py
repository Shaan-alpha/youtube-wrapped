"""
Load gold-layer CSV exports from Databricks into Neon Postgres.
Run: python scripts/load_to_neon.py
"""
import os
import pandas as pd
from sqlalchemy import create_engine, text
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

NEON_URL = os.getenv("NEON_CONNECTION_STRING")
if not NEON_URL:
    raise SystemExit("Missing NEON_CONNECTION_STRING in .env")

# SQLAlchemy needs the postgresql+psycopg2 prefix
sqlalchemy_url = NEON_URL.replace("postgresql://", "postgresql+psycopg2://", 1)
engine = create_engine(sqlalchemy_url)

DATA_DIR = Path(__file__).parent.parent / "data" / "gold_exports"

if not DATA_DIR.exists():
    raise SystemExit(f"Data directory not found: {DATA_DIR}")

csv_files = sorted(DATA_DIR.glob("fact_*.csv"))
if not csv_files:
    raise SystemExit(f"No fact_*.csv files in {DATA_DIR}")

print(f"Found {len(csv_files)} CSVs to load\n")

# Test connection
with engine.connect() as conn:
    version = conn.execute(text("SELECT version()")).scalar() or "unknown"
    print(f"Connected to: {version[:60]}...\n")

# Load each CSV → Postgres table
for csv_file in csv_files:
    table_name = csv_file.stem
    df = pd.read_csv(csv_file)
    
    df.to_sql(
        table_name,
        engine,
        if_exists="replace",
        index=False,
        method="multi",
    )
    print(f"  loaded {table_name}: {len(df):,} rows")

print("\nAll gold tables loaded into Neon")

# Verify
with engine.connect() as conn:
    tables = conn.execute(text(
        "SELECT table_name FROM information_schema.tables "
        "WHERE table_schema = 'public' AND table_name LIKE 'fact_%' "
        "ORDER BY table_name"
    )).all()
    print(f"\nTables in Neon ({len(tables)}):")
    for (name,) in tables:
        print(f"  - {name}")