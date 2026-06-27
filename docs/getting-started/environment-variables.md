---
sidebar_position: 3
title: Environment Variables
description: Complete environment variable reference for Webchannel configuration.
---

# Environment Variables

## Core Settings

| Variable | Description | Default |
|----------|-------------|---------|
| `SESSION_SECRET` | Session secret (required for multi-instance) | — |
| `CRYPTO_SECRET` | Encryption secret (required for Redis) | — |
| `SQL_DSN` | Database connection string | SQLite in `/data` |
| `REDIS_CONN_STRING` | Redis connection string | — |
| `TZ` | Timezone | `Asia/Shanghai` |

## Performance

| Variable | Description | Default |
|----------|-------------|---------|
| `STREAMING_TIMEOUT` | Streaming timeout (seconds) | `300` |
| `STREAM_SCANNER_MAX_BUFFER_MB` | Max per-line buffer for streaming (MB) | `64` |
| `MAX_REQUEST_BODY_MB` | Max request body size after decompression (MB) | `32` |

## Azure

| Variable | Description | Default |
|----------|-------------|---------|
| `AZURE_DEFAULT_API_VERSION` | Azure API version | `2025-04-01-preview` |

## Monitoring

| Variable | Description | Default |
|----------|-------------|---------|
| `ERROR_LOG_ENABLED` | Enable error logging | `false` |
| `PYROSCOPE_URL` | Pyroscope server address | — |
| `PYROSCOPE_APP_NAME` | Pyroscope application name | `new-api` |
| `HOSTNAME` | Hostname tag for Pyroscope | `new-api` |

## Example `.env`

```bash
SESSION_SECRET=change-me-to-a-long-random-string
CRYPTO_SECRET=another-long-random-string
SQL_DSN=root:password@tcp(localhost:3306)/newapi
REDIS_CONN_STRING=redis://localhost:6379
TZ=Asia/Shanghai
STREAMING_TIMEOUT=300
```

:::warning Production
Always set `SESSION_SECRET` and `CRYPTO_SECRET` to strong random values in production.
:::
