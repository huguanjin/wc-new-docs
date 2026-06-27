---
sidebar_position: 1
title: 安装部署
description: 使用 Docker、Docker Compose 或手动方式安装 New API。
---

# 安装部署

## Docker Compose（推荐）

```bash
git clone https://github.com/QuantumNous/new-api.git
cd new-api
nano docker-compose.yml
docker-compose up -d
```

## Docker 运行

### SQLite（默认）

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

:::tip 数据持久化
挂载 `-v ./data:/data` 以持久化 SQLite 数据和配置。
:::

## 系统要求

| 组件 | 要求 |
|------|------|
| 本地数据库 | SQLite（Docker 中挂载 `/data`） |
| 远程数据库 | MySQL ≥ 5.7.8 或 PostgreSQL ≥ 9.6 |
| 运行环境 | Docker / Docker Compose |

## 首次登录

部署完成后访问 `http://your-server:3000`。默认 root 账户凭据在首次启动时设置 — 请查看容器日志获取初始管理员密码。

## 下一步

- [环境变量](./environment-variables)
- [Docker 高级配置](./docker)
- [宝塔面板部署](./bt-panel)
