---
sidebar_position: 2
title: Docker Deployment
description: Advanced Docker and Docker Compose configuration for Webchannel.
---

# Docker Deployment

## Latest Image

```
calciumion/new-api:latest
```

## Docker Compose Example

```yaml
version: '3.4'
services:
  new-api:
    image: calciumion/new-api:latest
    container_name: new-api
    restart: always
    ports:
      - "3000:3000"
    volumes:
      - ./data:/data
    environment:
      - SESSION_SECRET=your_random_secret_here
      - TZ=Asia/Shanghai
      # - SQL_DSN=root:password@tcp(mysql:3306)/newapi
      # - REDIS_CONN_STRING=redis://redis:6379
```

## Multi-Instance Deployment

When running multiple instances, set these environment variables consistently across all nodes:

- `SESSION_SECRET` — Required for shared sessions
- `CRYPTO_SECRET` — Required when using Redis
- `SQL_DSN` — Shared database connection
- `REDIS_CONN_STRING` — Shared cache

## Health Check

```bash
curl -f http://localhost:3000/api/status
```

## Development Mode

For frontend development with a backend-only Docker build:

```bash
docker compose -f docker-compose.dev.yml up -d
```

See the project `Dockerfile.dev` for details.
