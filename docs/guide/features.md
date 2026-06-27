---
sidebar_position: 1
title: Features
description: Core features of Webchannel including UI, billing, security, and smart routing.
---

# Features Overview

## Core Functions

| Feature | Description |
|---------|-------------|
| 🎨 New UI | Modern user interface design |
| 🌍 Multi-language | Simplified Chinese, Traditional Chinese, English, French, Japanese, Russian, Vietnamese |
| 🔄 Data Compatibility | Fully compatible with the original One API database |
| 📈 Data Dashboard | Visual console and statistical analysis |
| 🔒 Permission Management | Token grouping, model restrictions, user management |

## Billing & Accounting

- Internal top-up and quota allocation (EPay, Stripe)
- Per-request, usage-based, and cache-hit cost accounting
- Cache billing for OpenAI, Azure, DeepSeek, Claude, Qwen models
- Flexible billing policies for enterprise customers

## Authentication & Security

- Discord, LinuxDO, Telegram OAuth login
- OIDC unified authentication
- WebAuthn / Passkeys support
- Key quota query and usage tracking

## Advanced Features

### API Format Support

- OpenAI Chat Completions & Responses
- OpenAI Realtime API (including Azure)
- Claude Messages format
- Google Gemini format
- Rerank models (Cohere, Jina)

### Smart Routing

- Channel weighted random selection
- Automatic retry on failure
- User-level model rate limiting

### Format Conversion

- OpenAI Compatible ⇄ Claude Messages
- OpenAI Compatible → Google Gemini
- Google Gemini → OpenAI Compatible
- Thinking-to-content functionality

## Reasoning Effort Models

**OpenAI:** `o3-mini-high`, `o3-mini-medium`, `o3-mini-low`, `gpt-5-high`, etc.

**Claude:** `claude-3-7-sonnet-20250219-thinking`

**Gemini:** `gemini-2.5-flash-thinking`, `gemini-2.5-pro-thinking`, etc.

Append `-low`, `-medium`, or `-high` to Gemini model names for reasoning effort control.
