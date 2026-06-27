---
slug: /
sidebar_position: 1
title: API Overview
description: Enterprise AI gateway API — OpenAI, Claude, Gemini, and more.
---

# API Overview

Unified AI service gateway providing access to **ChatGPT**, **Claude**, and **Gemini** models through a single API key.

## Base URL

```
https://your-gateway.com
```

Replace with your Webchannel deployment URL or provider endpoint.

## Authentication

All relay endpoints use Bearer token authentication:

```http
Authorization: Bearer YOUR_API_KEY
```

```bash
curl https://your-gateway.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## API Categories

| Category | Description | Doc |
|----------|-------------|-----|
| Models | List available models | [Models](./api/models) |
| OpenAI Format | ChatGPT, Responses, Embeddings, Images, and more | [OpenAI Format](./api/openai) |
| Anthropic Format | Claude Messages API | [Anthropic Format](./api/anthropic) |
| Google Gemini | Gemini generateContent and streamGenerateContent | [Google Gemini](./api/gemini) |

**135 endpoints** documented from Apifox export.

## Interactive Reference

Browse the full API on the [interactive reference page](/api-reference) or try endpoints on [Apifox](https://ppf3lcwzqr.apifox.cn/).

## OpenAPI Specs

Download machine-readable specifications:

- [enterprise.json](/openapi/enterprise.json) — Full Apifox export (135 endpoints)
- [relay.json](/openapi/relay.json) — Relay API
