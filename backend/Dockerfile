FROM python:3.12-slim-bookworm

WORKDIR /app

RUN apt-get update && \
	apt-get upgrade -y && \
	apt-get install -y --no-install-recommends build-essential && \
	apt-get clean && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install --upgrade pip && \
	pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY .env ./

ENV PYTHONPATH="/app"

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
