FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN pip install --no-cache-dir uv

COPY pyproject.toml .

RUN uv pip install --system -r pyproject.toml

COPY app/ ./

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
