.PHONY: help build up down debug test lint fmt

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

debug: ## Start the application in debug mode
	@echo "Debug:"
	docker-compose -f docker-compose.debug.yml up --build
	
down: ## Stop the application
	@echo "Down:"
	docker-compose down

lint: ## Check code (linting and formatting)
	@echo "Check code"
	ruff check app/
	ruff format --check app/

fmt: ## Fix and format code
	@echo "Fix and format code"
	ruff check --fix app/
	ruff format app/
