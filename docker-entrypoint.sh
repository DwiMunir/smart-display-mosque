#!/bin/sh
set -e

echo "Starting Smart Mosque Display..."

# Run database migrations if DATABASE_URL is set
if [ -n "$DATABASE_URL" ]; then
    echo "Running database migrations..."
    node ./node_modules/prisma/build/index.js migrate deploy
    echo "Migrations completed."
else
    echo "Warning: DATABASE_URL not set, skipping migrations."
fi

# Execute the main command
exec "$@"
