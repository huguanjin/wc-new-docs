---
sidebar_position: 1
title: FAQ
description: Frequently asked questions about Webchannel installation and usage.
---

# FAQ

## General

### What is Webchannel?

Webchannel is an open-source LLM gateway that aggregates multiple AI providers behind a unified OpenAI-compatible API with billing, user management, and an admin dashboard.

### Is it compatible with One API?

Yes. Webchannel is fully compatible with the original One API database schema.

## Installation

### Which database should I use?

- **SQLite** — Simplest setup, good for single-instance deployments
- **MySQL** — Recommended for production multi-instance setups
- **PostgreSQL** — Alternative for production environments

### Why is my container restarting?

Check logs with `docker logs new-api`. Common causes:
- Missing `SESSION_SECRET` in multi-instance setup
- Invalid `SQL_DSN` connection string
- Port 3000 already in use

## Usage

### How do I add a new model provider?

1. Go to **Channels** in the dashboard
2. Click **Add Channel**
3. Select the provider type and enter API credentials
4. Configure model mapping and pricing ratio

### How does billing work?

Webchannel uses an internal quota system. Each model has a ratio multiplier. Token usage is converted to quota based on the model ratio and group pricing.

## API

### Can I use the OpenAI SDK?

Yes. Point the OpenAI SDK to your Webchannel gateway URL:

```python
from openai import OpenAI
client = OpenAI(
    api_key="sk-your-token",
    base_url="https://your-gateway.com/v1"
)
```

### Where is the full API documentation?

- [Apifox Interactive Docs](https://ppf3lcwzqr.apifox.cn/)
- [Built-in API Reference](/api-reference)
- [OpenAPI Specs](/openapi/relay.json)
