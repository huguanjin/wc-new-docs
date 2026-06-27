---
sidebar_position: 4
title: Anthropic Format
description: Claude Messages API
---

# Anthropic Format

Claude Messages API.

Request and response format follows the [Claude API overview](https://platform.claude.com/docs/en/api/overview). Use the same paths on your gateway base URL; see the interactive API Reference for per-use-case request JSON.

## Authentication

Required headers per the [Claude API overview](https://platform.claude.com/docs/en/api/overview): `x-api-key` (or `Authorization: Bearer`), `anthropic-version` (e.g. `2023-06-01`), and `content-type: application/json`.

| Header | Value | Required |
|--------|-------|----------|
| `x-api-key` | Your API key from Console | One of `x-api-key` or `Authorization` |
| `anthropic-version` | e.g. `2023-06-01` | Yes |
| `content-type` | `application/json` | Yes |

```http
x-api-key: YOUR_API_KEY
anthropic-version: 2023-06-01
content-type: application/json
```

## Messages

| Method | Path | Summary |
|--------|------|-------------|
| `POST` | `/v1/messages` | Create message · _7 use cases_ |

:::tip Interactive Docs
Try these endpoints interactively on [Apifox](https://ppf3lcwzqr.apifox.cn/).
:::
