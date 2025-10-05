#!/bin/bash
set -euo pipefail

IMAGE_TAG="mediverse:latest"

printf 'Building Docker image...\n'
docker build -t "${IMAGE_TAG}" .

if command -v alembic >/dev/null 2>&1; then
  printf 'Running database migrations...\n'
  alembic upgrade head
else
  printf 'Alembic not found. Skipping migrations.\n'
fi

printf 'Running test suite...\n'
pytest tests/

printf 'Starting services...\n'
docker compose up -d

printf 'Waiting for service to become healthy...\n'
sleep 10
curl --fail http://localhost:8000/health

printf 'Deployment complete.\n'
