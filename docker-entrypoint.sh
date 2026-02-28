#!/bin/sh
set -e

echo "Starting Smart Mosque Display..."

# Run database migrations if DATABASE_URL is set
if [ -n "$DATABASE_URL" ]; then
    echo "Running database migrations..."
    npx prisma migrate deploy --schema=./prisma/schema.prisma
    echo "Migrations completed."
else
    echo "Warning: DATABASE_URL not set, skipping migrations."
fi

# Execute the main command
exec "$@"
