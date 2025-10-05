# Mediverse

Mediverse is a full-stack clinical AI platform that combines a production-ready FastAPI backend with a Next.js landing experience. It orchestrates Google Gemini, OpenRouter multi-model endpoints, Redis caching, and Supabase/PostgreSQL persistence to deliver safe, auditable healthcare guidance.

## At a glance

- 🤝 **Multi-model orchestration** – flip between Gemini and OpenRouter without redeploying.
- 🩺 **Clinical guardrails** – emergency detection, medication validation, and disclaimers on every answer.
- ⚙️ **Operational tooling** – Redis caching, Prometheus metrics, rate limiting, and Postgres logging baked in.
- 🌐 **Immersive frontend** – animated landing page with live demo, testimonials, modal dialogs, and working CTAs.
- � **Ready for production** – Docker workflow, Supabase compatibility, and environment templates.

## Repository structure

```plaintext
mediverse/
├── backend/                # FastAPI service, tests, Docker assets
│   ├── app/
│   ├── scripts/
│   ├── tests/
│   ├── .env
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/               # Next.js 14 app with Tailwind + Framer Motion
│   ├── app/
│   ├── components/
│   ├── public/
│   ├── package.json
│   └── tailwind.config.ts
├── .gitignore
└── .venv/ (optional local virtualenv)
```

> The backend and frontend are intentionally decoupled so each stack can evolve independently while sharing a single repo and README.

## Backend (FastAPI)

### Prerequisites

- Python 3.11+
- Redis 7+
- PostgreSQL 15+ (or Supabase Postgres)
- Tavily and Gemini API keys (OpenRouter optional)

### Install & run locally

```bash
cd backend
python -m venv ..\.venv
..\.venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Populate `backend/.env` using the provided defaults as a starting point. Key variables:

| Variable | Description |
| --- | --- |
| `GEMINI_API_KEY` | Google Gemini API key |
| `TAVILY_API_KEY` | Tavily search key |
| `LLM_PROVIDER` | `gemini` (default) or `openrouter` |
| `OPENROUTER_API_KEY` | Required when using OpenRouter |
| `OPENROUTER_MODEL` | Desired OpenRouter model slug |
| `DATABASE_URL` | Primary Postgres connection (defaults to `mediverse`) |
| `SUPABASE_DB_URL` | Optional override for Supabase-hosted Postgres |
| `REDIS_URL` | Redis instance for caching |

#### Supabase quick start

1. Copy the Supabase "connection string" and place it in `SUPABASE_DB_URL` (SSL enforced automatically).
2. Provision tables:

   ```bash
   cd backend
   python -m dotenv run -- python scripts/init_db.py
   ```

3. Launch the API (see commands above).

#### Switching to OpenRouter

Update the provider block in `backend/.env`:

```properties
LLM_PROVIDER=openrouter
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_MODEL=meta-llama/llama-3.1-70b-instruct
OPENROUTER_SITE_URL=https://your-mediverse-instance
OPENROUTER_APP_NAME="Mediverse"
```

Restart Uvicorn and Mediverse will automatically forward the required headers (`HTTP-Referer`, `X-Title`).

### Tests & quality gates

```bash
cd backend
..\.venv\Scripts\activate
python -m pytest
```

### Docker workflow

```bash
cd backend
docker compose up --build
```

Services launched: FastAPI (`web`), Postgres (`db`), Redis (`redis`), and NGINX (`nginx`). The helper script `deploy.sh` demonstrates a CI-friendly flow (build → migrations → tests → health check).

## Frontend (Next.js)

The landing page lives in `frontend/` and showcases Mediverse with smooth animations (Framer Motion), Tailwind styling, Headless UI dialogs, and a live demo console that talks to the backend.

### Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local   # optional – customise API base URL
npm run dev
```

The development server runs on `http://localhost:3000` and the backend demo console defaults to `http://localhost:8000` unless overridden via `NEXT_PUBLIC_API_BASE_URL`.

### Frontend highlights

- Animated hero, metric counters, and feature reveals powered by Framer Motion.
- Modal booking flow built with Headless UI, including working CTA buttons.
- Live demo widget that posts sample prompts to the FastAPI backend and renders responses.
- Testimonial carousel with autoplay and manual navigation.
- Responsive sections for workflow, FAQ, partners, and contact form with validation states.

### Production build

```bash
cd frontend
npm run build
npm run start
```

## Running the full stack

1. Start the backend (`uvicorn` or `docker compose`).
2. Run the frontend dev server (`npm run dev`).
3. Visit `http://localhost:3000` to explore the Mediverse experience.

> Tip: For local HTTPS or edge deployments, point the frontend `.env.local` at the corresponding backend URL.

## API surface (backend)

- `GET /health` – heartbeat returning service metadata.
- `POST /api/v1/query` – submit a medical question with optional source aggregation.
- `GET /api/v1/history` – retrieve recent questions (requires DB).
- `GET /metrics` – Prometheus metrics endpoint.

Interactive docs remain available at `/docs` while the server runs.

## 🚀 Deployment

### Vercel (Recommended for Production)

Deploy both frontend and backend serverless on Vercel:

1. **Quick Deploy**: See [DEPLOY_QUICK.md](./DEPLOY_QUICK.md) for 3-step guide
2. **Full Guide**: See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for complete documentation

**Key Features**:
- ✅ Automatic HTTPS and CDN
- ✅ Serverless scaling (pay per use)
- ✅ Free tier available (100GB bandwidth, 100 hours compute)
- ✅ Auto-deploy on git push
- ✅ Built-in analytics and monitoring

**Deploy Now**: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Meidverse/Mediverse-AI-assistant)

### Docker (Alternative)

Traditional container deployment:
```bash
cd backend
docker-compose up -d
```

## Security & compliance checklist

- Every AI response includes an explicit disclaimer and medication scan.
- Emergency queries are flagged and short-circuited.
- Redis-backed caching honours TTLs to prevent stale unsafe content.
- Postgres schemas are ready for analytics and audit trails.
- NGINX config + SSL assets ship with the backend for production hardening.

## Roadmap

- Fine-tuned analytics dashboard within the frontend.
- Authentication & multi-tenant admin controls.
- Expanded integration recipes (Epic, Cerner, Salesforce Health Cloud).

---

Mediverse is provided as-is. Adapt the stack and configuration to meet your organisation's regulatory requirements before going live.
