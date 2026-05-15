import sys
import os
from pathlib import Path

# Provide a mock database connection string before importing app
os.environ["NEON_CONNECTION_STRING"] = "postgresql://dummy:dummy@localhost/dummy"

# Add api directory to sys.path
sys.path.insert(0, str(Path(__file__).parent.parent.absolute()))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root_health():
    """Test health check root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["name"] == "YouTube Wrapped API"
    assert "/api/overview" in data["endpoints"]
