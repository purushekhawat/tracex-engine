#!/bin/bash
# TRACE-X Migration Script
set -e

PG_HOST="${POSTGRES_HOST:-localhost}"
PG_PORT="${POSTGRES_PORT:-5432}"
PG_USER="${POSTGRES_USER:-tracex}"
PG_DB="${POSTGRES_DB:-tracex_db}"
PG_PASSWORD="${POSTGRES_PASSWORD:-tracex_secret_password}"

echo "==> Running PostgreSQL migrations on $PG_HOST:$PG_PORT/$PG_DB..."
PGPASSWORD=$PG_PASSWORD psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d "$PG_DB" -f database/postgres/migrations/000001_create_tracex_tables.up.sql
echo "==> Migrations completed successfully."
