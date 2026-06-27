---
sidebar_position: 2
title: Supported Models & Services
description: AI models and services available through the enterprise API gateway.
---

# Supported Models & Services

The enterprise API gateway exposes **135 endpoints** across the following service categories:

## Text & Chat

| Service | Format | Key Endpoints |
|---------|--------|---------------|
| OpenAI | Chat Completions, Responses | `/v1/chat/completions`, `/v1/responses` |
| Anthropic Claude | Messages API | `/v1/messages` |
| Google Gemini | Native generateContent | `/v1beta/models/{model}:generateContent` |

## Image Generation

| Service | Description | Doc |
|---------|-------------|-----|
| OpenAI Images | DALL-E, GPT Image | [OpenAI](../api/openai) |
| Gemini | Image gen & edit | [Gemini](../api/gemini) |

## Model Discovery

```bash
curl https://your-gateway.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

See [Models API](../api/models) for details.

## Full API Reference

- [API Overview](/docs/) — All categories
- [Interactive Reference](/api-reference) — Redoc browser
- [Apifox](https://ppf3lcwzqr.apifox.cn/) — Try it out online
