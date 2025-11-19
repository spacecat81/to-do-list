.PHONY: help build up down debug test test-quiet install-test lint fmt db-shell db-logs db-reset logs

help: ## Show this help message
	@echo "Help:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
	awk -F':.*?## ' '{printf "make %s: %s\n", $$1, $$2}'

build: ## Build Docker image
	@echo "Build:"
	docker compose build

up: ## Start the application
	@echo "Up:"
	docker compose up -d

debug: ## Start the application in debug mode
	@echo "Debug:"
	docker compose -f docker-compose.debug.yml up --build
	
down: ## Stop the application
	@echo "Down:"
	docker compose down

logs: ## Show application logs
	@echo "Logs:"
	docker compose logs -f app

db-logs: ## Show PostgreSQL logs
	@echo "Database logs:"
	docker compose logs -f postgres

db-shell: ## Connect to PostgreSQL shell
	@echo "Connecting to PostgreSQL:"
	docker compose exec postgres psql -U postgres -d todolist

db-reset: ## Reset database (WARNING: deletes all data)
	@echo "Resetting database:"
	docker compose down -v
	docker compose up -d postgres
	@echo "Waiting for PostgreSQL to be ready..."
	@for i in $$(seq 1 30); do \
		if docker compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then \
			echo "PostgreSQL is ready!"; \
			break; \
		fi; \
		echo "Waiting... ($$i/30)"; \
		sleep 1; \
	done
	@echo "Database reset complete"

lint: ## Check code (linting and formatting)
	@echo "Check code"
	ruff check app/
	ruff format --check app/

fmt: ## Fix and format code
	@echo "Fix and format code"
	ruff check --fix app/
	ruff format app/

test: ## Run tests
	@echo "Running tests"
	@echo "Note: Data may persist between test runs. Use 'make test-clean' to reset DB first."
	uv run pytest test.py -v

test-clean: ## Clean database and run tests
	@echo "Cleaning database and running tests"
	@docker compose exec -T postgres psql -U postgres -d todolist -c "TRUNCATE TABLE todos RESTART IDENTITY CASCADE;" || true
	@make test
