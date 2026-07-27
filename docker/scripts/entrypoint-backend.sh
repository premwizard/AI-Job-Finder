#!/bin/bash
set -e

echo "Starting Backend Entrypoint..."

# Ensure we are in the correct directory
cd /app

# Wait for DB to be ready (handled by compose depends_on usually, but good practice)
# We can run Alembic migrations here
# echo "Running Database Migrations..."
# python -m alembic upgrade head

# Start Uvicorn
echo "Starting Uvicorn Server..."
exec uvicorn app.server:app --host 0.0.0.0 --port 8000
