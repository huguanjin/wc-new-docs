---
sidebar_position: 5
title: Google Gemini
description: generateContent và streamGenerateContent
---

# Google Gemini

generateContent và streamGenerateContent.

Định dạng request/response theo [Gemini API reference](https://ai.google.dev/api?hl=zh-cn). Cùng path trên URL gateway của bạn.

## Xác thực

Chính thức: header `x-goog-api-key`. Trên gateway này cũng có thể dùng `Authorization: Bearer`.

```http
x-goog-api-key: YOUR_API_KEY
```

## Generate content

Tạo nội dung với bất kỳ model Gemini nào. Thay `{model-name}` bằng ID model.

| Phương thức | Đường dẫn | Mô tả |
|--------|------|-------------|
| `POST` | `/v1beta/models/{model-name}:generateContent` | Generate content · _30 trường hợp_ |

## Stream generate content

| Phương thức | Đường dẫn | Mô tả |
|--------|------|-------------|
| `POST` | `/v1beta/models/gemini-2.5-pro:streamGenerateContent` | Stream generate content · _1 trường hợp_ |
| `POST` | `/v1beta/models/gemini-3-pro-preview:streamGenerateContent` | Stream generate content |
| `POST` | `/v1beta/models/{module_name}:streamGenerateContent` | Stream generate content · _1 trường hợp_ |

## Imagen

| Phương thức | Đường dẫn | Mô tả |
|--------|------|-------------|
| `POST` | `/v1beta/models/imagen-4.0-generate-001:predict` | Imagen predict · _1 trường hợp_ |

:::tip Tài liệu tương tác
Dùng thử các endpoint trên [Apifox](https://ppf3lcwzqr.apifox.cn/).
:::
