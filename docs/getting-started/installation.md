---
sidebar_position: 1
title: Installation
description: Install Webchannel using Docker, Docker Compose, or manual deployment.
---

# Installation

## Docker Compose (Recommended)

```bash
git clone https://github.com/QuantumNous/new-api.git
cd new-api
nano docker-compose.yml
docker-compose up -d
```

## Docker Run

### SQLite (Default)

```bash
docker pull calciumion/new-api:latest

docker run --name new-api -d --restart always \
  -p 3000:3000 \
  -e TZ=Asia/Shanghai \
  -v ./data:/data \
  calciumion/new-api:latest
```

### MySQL

```bash
docker run --name new-api -d --restart always \
  -p 3000:3000 \
  -e SQL_DSN="root:password@tcp(localhost:3306)/newapi" \
  -e TZ=Asia/Shanghai \
  -v ./data:/data \
  calciumion/new-api:latest
```

:::tip Data Persistence
Mount `-v ./data:/data` to persist SQLite data and configuration.
:::

## Requirements

| Component | Requirement |
|-----------|-------------|
| Local DB | SQLite (mount `/data` in Docker) |
| Remote DB | MySQL ≥ 5.7.8 or PostgreSQL ≥ 9.6 |
| Runtime | Docker / Docker Compose |

## First Login

After deployment, visit `http://your-server:3000`. The default root account credentials are set during first startup — check the container logs for the initial admin password.

## Next Steps

- [Environment Variables](./environment-variables)
- [Docker Advanced](./docker)
- [BT Panel Deployment](./bt-panel)
