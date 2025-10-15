.PHONY: help build up down test checks

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

test: ## Run tests
	@echo "Tests:"
	#доделаю в следующем ПР

checks: ## Run code checks
	@echo "Checks:"
	#доделаю в следующем ПР
