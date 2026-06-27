---
sidebar_position: 4
title: BT Panel Deployment
description: Deploy Webchannel on Baota (BT) Panel using Docker.
---

# BT Panel Deployment

This guide covers deploying Webchannel using the Baota (BT) Panel Docker feature.

## Prerequisites

| Item | Requirement |
|------|-------------|
| BT Panel | ≥ 9.2.0 |
| OS | CentOS 7+, Ubuntu 18.04+, Debian 10+ |
| Server | At least 1 CPU, 2 GB RAM |

## Step 1: Install Docker in BT Panel

1. Log in to BT Panel
2. Click **Docker** in the left menu
3. Click **Install Now** when prompted

## Step 2: Install Webchannel

### Method A: App Store (Recommended)

1. Open **Docker → App Store**
2. Search for **New-API**
3. Click **Install**
4. Configure:
   - **Port**: `3000:3000`
   - **SESSION_SECRET**: Required random string
   - **CRYPTO_SECRET**: Required if using Redis
5. Click **Confirm** and wait for installation

### Method B: Docker Compose

Create `/www/wwwroot/new-api/docker-compose.yml`:

```yaml
version: '3'
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
      - SESSION_SECRET=your_session_secret_here
      - TZ=Asia/Shanghai
```

Then run:

```bash
cd /www/wwwroot/new-api
docker-compose up -d
```

## Access

Visit `http://your-server-ip:3000` after deployment completes.
