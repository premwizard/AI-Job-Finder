#!/bin/sh
set -e

echo "Starting Frontend Entrypoint..."

# If in production, Next.js starts via standard start
if [ "$NODE_ENV" = "production" ]; then
    echo "Starting Next.js Production Server..."
    exec npm run start
else
    # Fallback to dev if somehow environment is not production
    echo "Starting Next.js Development Server..."
    exec npm run dev
fi
