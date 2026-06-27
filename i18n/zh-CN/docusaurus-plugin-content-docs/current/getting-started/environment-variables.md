---
sidebar_position: 3
title: 环境变量
description: Webchannel 完整环境变量参考。
---

# 环境变量

## 核心配置

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `SESSION_SECRET` | 会话密钥（多实例必填） | — |
| `CRYPTO_SECRET` | 加密密钥（Redis 必填） | — |
| `SQL_DSN` | 数据库连接 | SQLite `/data` |
| `REDIS_CONN_STRING` | Redis 连接 | — |

## 性能

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `STREAMING_TIMEOUT` | 流式超时（秒） | `300` |
| `MAX_REQUEST_BODY_MB` | 最大请求体（MB） | `32` |

:::warning 生产环境
务必为 `SESSION_SECRET` 和 `CRYPTO_SECRET` 设置强随机值。
:::
