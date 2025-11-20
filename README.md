# A simple to-do list application

## Setup

Before running the application, you need to configure environment variables:

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file and update the values, especially `POSTGRES_PASSWORD` with a secure password.

## How to run

Build (no debugger):

```
make build
```

Run (no debugger):

```
make up
```

Debug run:

```
make debug
```

Help:

```
make help
```

Go to `http://localhost:8000/docs` or `http://localhost:8000/redoc` to try all endpoints

Enjoy!
