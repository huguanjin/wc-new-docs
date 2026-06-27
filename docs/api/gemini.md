---
sidebar_position: 5
title: Google Gemini
description: Gemini generateContent and streamGenerateContent
---

# Google Gemini

Gemini generateContent and streamGenerateContent.

Request and response bodies follow the [Gemini API reference](https://ai.google.dev/api?hl=zh-cn). Use the same paths on your gateway base URL; see the interactive API Reference for per-use-case request JSON.

## Authentication

Official: `x-goog-api-key` header. On this gateway you may also use `Authorization: Bearer` with your platform token.

```http
x-goog-api-key: YOUR_API_KEY
```

## Generate content

Generate text, images, and multimodal output with any Gemini model. Set `{model-name}` in the path to the model ID (e.g. `gemini-2.5-flash`, `gemini-2.5-pro`, `gemini-3-pro-preview`).

| Method | Path | Summary |
|--------|------|-------------|
| `POST` | `/v1beta/models/{model-name}:generateContent` | Generate content · _30 use cases_ |

## Stream generate content

| Method | Path | Summary |
|--------|------|-------------|
| `POST` | `/v1beta/models/gemini-2.5-pro:streamGenerateContent` | Stream generate content · _1 use cases_ |
| `POST` | `/v1beta/models/gemini-3-pro-preview:streamGenerateContent` | Stream generate content |
| `POST` | `/v1beta/models/{module_name}:streamGenerateContent` | Stream generate content · _1 use cases_ |

## Imagen

| Method | Path | Summary |
|--------|------|-------------|
| `POST` | `/v1beta/models/imagen-4.0-generate-001:predict` | Imagen predict · _1 use cases_ |

:::tip Interactive Docs
Try these endpoints interactively on [Apifox](https://ppf3lcwzqr.apifox.cn/).
:::
