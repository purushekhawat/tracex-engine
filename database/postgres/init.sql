-- TRACE-X PostgreSQL Main Initializer
\i /docker-entrypoint-initdb.d/migrations/000001_create_tracex_tables.up.sql
\i /docker-entrypoint-initdb.d/seeds/001_synthetic_demo_seed.sql
