.PHONY: help build up down test checks lint fmt lint-fix fmt-check

help: ## Show this help message
	@echo "Help:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
	awk -F':.*?## ' '{printf "make %s: %s\n", $$1, $$2}'

build: ## Build Docker image
	@echo "Build:"
	docker-compose build

up: ## Start the application
	@echo "Up:"
	docker-compose up -d
	
down: ## Stop the application
	@echo "Down:"
	docker-compose down

lint: ## Run Ruff linter
	@echo "Running Ruff linter..."
	ruff check app/

fmt-check: ## Check code formatting with Ruff
	@echo "Checking code formatting with Ruff..."
	ruff format --check app/

lint-fix: ## Run Ruff linter with auto-fix
	@echo "Running Ruff linter with auto-fix..."
	ruff check --fix app/

fmt: ## Format code with Ruff
	@echo "Formatting code with Ruff..."
	ruff format app/

checks: lint fmt-check ## Run all code checks (linting and formatting)
	@echo "All checks completed!"
	