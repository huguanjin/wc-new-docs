---
sidebar_position: 1
title: Cài đặt
description: Cài đặt Webchannel bằng Docker.
---

# Cài đặt

## Docker Compose (Khuyến nghị)

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

Truy cập `http://localhost:3000` sau khi triển khai.
