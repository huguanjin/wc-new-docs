---
sidebar_position: 1
title: インストール
description: Docker で Webchannel をインストールします。
---

# インストール

## Docker Compose（推奨）

```bash
git clone https://github.com/QuantumNous/new-api.git
cd new-api
docker-compose up -d
```

## Docker 実行

```bash
docker pull calciumion/new-api:latest
docker run --name new-api -d --restart always \
  -p 3000:3000 \
  -v ./data:/data \
  calciumion/new-api:latest
```

デプロイ後、`http://localhost:3000` にアクセスしてください。
