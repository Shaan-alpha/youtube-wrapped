#!/usr/bin/env bash
# Render uses this to start the API
uvicorn app.main:app --host 0.0.0.0 --port $PORT