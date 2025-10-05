# Mediverse Backend

Production-ready FastAPI service for clinical AI workflows with multi-model LLM orchestration, Redis caching, Postgres logging, and safety guardrails.

## Quick start

```bash
python -m venv ..\.venv
..\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Ensure `.env` is populated with API keys and database credentials before starting.

## Run tests

```bash
python -m pytest
```

## Docker deployment

```bash
docker compose up --build
```

Services: FastAPI (`web`), Postgres (`db`), Redis (`redis`), NGINX (`nginx`).

## Key endpoints

- `GET /health` – heartbeat
- `POST /api/v1/query` – submit a medical question
- `GET /api/v1/history` – retrieve recent queries
- `GET /metrics` – Prometheus metrics
- `GET /docs` – interactive API documentation

## Configuration

All settings live in `app/config.py` and can be overridden via environment variables in `.env`:

- `GEMINI_API_KEY` / `TAVILY_API_KEY`
- `LLM_PROVIDER` (`gemini` or `openrouter`)
- `DATABASE_URL` / `SUPABASE_DB_URL`
- `REDIS_URL`
- `SECRET_KEY`, `LOG_LEVEL`, rate limits, cache TTL, etc.

## Database provisioning

If using Supabase or a fresh Postgres instance:

```bash
python -m dotenv run -- python scripts/init_db.py
```

This creates the required tables (`medical_queries`, `users`, etc.).

---

For frontend setup and full project overview, see the main [README](../README.md).
