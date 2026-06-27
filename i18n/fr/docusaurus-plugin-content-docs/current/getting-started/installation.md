---
sidebar_position: 1
title: Installation
description: Install Webchannel with Docker or Docker Compose.
---

# Installation

## Docker Compose (Recommended)

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

Visit `http://localhost:3000` after deployment.
