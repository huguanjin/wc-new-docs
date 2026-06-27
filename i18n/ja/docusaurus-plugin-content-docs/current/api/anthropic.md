---
sidebar_position: 4
title: Anthropic 形式
description: Claude Messages API
---

# Anthropic 形式

Claude Messages API.

## 認証



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

| メソッド | パス | 概要 |
|--------|------|-------------|
| `POST` | `/v1/messages` | メッセージを作成 · _7 ユースケース_ |

:::tip インタラクティブドキュメント
[Apifox](https://ppf3lcwzqr.apifox.cn/) でエンドポイントを試せます。
:::
