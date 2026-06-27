---
slug: /
sidebar_position: 1
title: Tổng quan API
description: API cổng AI doanh nghiệp — OpenAI, Claude, Gemini, v.v.
---

# Tổng quan API

Cổng AI thống nhất cho **ChatGPT**, **Claude** và **Gemini** qua một khóa API.

## URL cơ sở

```
https://your-gateway.com
```

Thay bằng URL triển khai Webchannel của bạn.

## Xác thực

Tất cả relay endpoint dùng xác thực Bearer:

```http
Authorization: Bearer YOUR_API_KEY
```

```bash
curl https://your-gateway.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Danh mục API

| Danh mục | Mô tả | Tài liệu |
|----------|-------------|-----|
| Mô hình | Liệt kê mô hình khả dụng | [Mô hình](./api/models) |
| Định dạng OpenAI | ChatGPT, Responses, Embeddings, hình ảnh, v.v. | [Định dạng OpenAI](./api/openai) |
| Định dạng Anthropic | Claude Messages API | [Định dạng Anthropic](./api/anthropic) |
| Google Gemini | generateContent và streamGenerateContent | [Google Gemini](./api/gemini) |

**135 endpoint** từ xuất Apifox.

## Tham chiếu tương tác

Xem API đầy đủ tại [trang tham chiếu](/api-reference) hoặc [Apifox](https://ppf3lcwzqr.apifox.cn/).

## Đặc tả OpenAPI

Tải đặc tả:

- [enterprise.json](/openapi/enterprise.json) — Full Apifox export (135 endpoints)
- [relay.json](/openapi/relay.json) — Relay API
