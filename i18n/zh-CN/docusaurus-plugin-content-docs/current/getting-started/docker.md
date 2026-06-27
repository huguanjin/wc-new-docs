---
sidebar_position: 2
title: Docker 部署
description: Webchannel Docker 与 Docker Compose 高级配置。
---

# Docker 部署

## 最新镜像

```
calciumion/new-api:latest
```

## Docker Compose 示例

```yaml
services:
  new-api:
    image: calciumion/new-api:latest
    ports:
      - "3000:3000"
    volumes:
      - ./data:/data
    environment:
      - SESSION_SECRET=your_random_secret
      - TZ=Asia/Shanghai
```

## 健康检查

```bash
curl -f http://localhost:3000/api/status
```
