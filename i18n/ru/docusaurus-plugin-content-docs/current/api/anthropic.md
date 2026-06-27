---
sidebar_position: 4
title: Формат Anthropic
description: Claude Messages API
---

# Формат Anthropic

Claude Messages API.

## Аутентификация



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

| Метод | Путь | Описание |
|--------|------|-------------|
| `POST` | `/v1/messages` | Создать сообщение · _7 сценариев_ |

:::tip Интерактивная документация
Попробуйте endpoints на [Apifox](https://ppf3lcwzqr.apifox.cn/).
:::
