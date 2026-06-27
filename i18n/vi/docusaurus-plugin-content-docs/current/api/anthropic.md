---
sidebar_position: 4
title: Định dạng Anthropic
description: Claude Messages API
---

# Định dạng Anthropic

Claude Messages API.

## Xác thực



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

| Phương thức | Đường dẫn | Mô tả |
|--------|------|-------------|
| `POST` | `/v1/messages` | Tạo message · _7 trường hợp_ |

:::tip Tài liệu tương tác
Dùng thử các endpoint trên [Apifox](https://ppf3lcwzqr.apifox.cn/).
:::
