# To-Do List Application

A modern full-stack to-do list application with Kanban board interface, built with FastAPI and React.

## Setup

1. Copy environment file:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file and update the values, especially `POSTGRES_PASSWORD`.

## How to Run

```bash
# Build Docker images
make build

# Start the application
make up
```

## Usage

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**:
  - http://localhost:8000/docs (Swagger UI)
  - http://localhost:8000/redoc (ReDoc)

## Available Commands

Run `make help` to see all available commands.
