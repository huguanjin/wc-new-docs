---
sidebar_position: 1
title: Установка
description: Установка Webchannel через Docker.
---

# Установка

## Docker Compose (рекомендуется)

```bash
git clone https://github.com/QuantumNous/new-api.git
cd new-api
docker-compose up -d
```

## Docker Run

```bash
docker pull calciumion/new-api:latest
docker run --name new-api -d --restart always \
  -p 3000:3000 \
  -v ./data:/data \
  calciumion/new-api:latest
```

После развёртывания откройте `http://localhost:3000`.
