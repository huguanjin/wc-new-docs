---
sidebar_position: 4
title: Anthropic 格式
description: Claude Messages API
---

# Anthropic 格式

Claude Messages API.

## 身份驗證



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

| 方法 | 路徑 | 說明 |
|--------|------|-------------|
| `POST` | `/v1/messages` | 建立訊息 · _7 種用法_ |

:::tip 線上調試
在 [Apifox](https://ppf3lcwzqr.apifox.cn/) 上互動式調試這些介面。
:::
