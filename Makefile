.PHONY: all dev-db test-backend test-analytics test-all build-backend build-frontend build-all migrate-up migrate-down seed-db clean help

all: test-all build-all

dev-db:
	docker-compose up -d postgres neo4j redis

dev-all:
	docker-compose up -d

migrate-up:
	@echo "==> Applying PostgreSQL migration UP..."
	docker-compose exec -T postgres psql -U tracex -d tracex_db -f /docker-entrypoint-initdb.d/migrations/000001_create_tracex_tables.up.sql

migrate-down:
	@echo "==> Applying PostgreSQL migration DOWN..."
	docker-compose exec -T postgres psql -U tracex -d tracex_db -f /docker-entrypoint-initdb.d/migrations/000001_create_tracex_tables.down.sql

seed-db:
	@echo "==> Seeding synthetic dataset into PostgreSQL..."
	docker-compose exec -T postgres psql -U tracex -d tracex_db -f /docker-entrypoint-initdb.d/seeds/001_synthetic_demo_seed.sql

test-backend:
	@echo "==> Running Go backend unit tests..."
	cd backend && go test ./... -v

test-analytics:
	@echo "==> Running Python analytics unit tests..."
	python -m pytest analytics/tests

test-all: test-backend test-analytics

build-backend:
	@echo "==> Building Go backend binary..."
	cd backend && go build -o bin/tracex-server.exe ./cmd/api

build-frontend:
	@echo "==> Building React frontend production bundle..."
	cd frontend && npm run build

build-all: build-backend build-frontend

clean:
	@echo "==> Cleaning build artifacts..."
	rm -rf backend/bin frontend/dist
