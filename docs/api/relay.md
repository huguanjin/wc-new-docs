---
sidebar_position: 2
title: Relay API
description: AI model relay endpoints — chat, embeddings, images, audio, and more.
---

# Relay API

The relay API provides OpenAI-compatible endpoints for AI model inference.

## Chat Completions

```bash
curl https://your-gateway.com/v1/chat/completions \
  -H "Authorization: Bearer sk-xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Hello!"}
    ],
    "stream": true
  }'
```

## Streaming

Set `"stream": true` for server-sent events (SSE) streaming responses.

## Claude Messages

```bash
curl https://your-gateway.com/v1/messages \
  -H "Authorization: Bearer sk-xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-4-20250514",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

## Embeddings

```bash
curl https://your-gateway.com/v1/embeddings \
  -H "Authorization: Bearer sk-xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "text-embedding-3-small",
    "input": "The food was delicious."
  }'
```

## Error Responses

```json
{
  "error": {
    "message": "Insufficient quota",
    "type": "insufficient_quota",
    "code": "insufficient_quota"
  }
}
```

:::info Full Reference
See [Apifox documentation](https://ppf3lcwzqr.apifox.cn/) for complete request/response schemas.
:::
