---
slug: /
sidebar_position: 1
title: Обзор API
description: Корпоративный AI-шлюз — OpenAI, Claude, Gemini и др.
---

# Обзор API

Единый шлюз для **ChatGPT**, **Claude** и **Gemini** через один API-ключ.

## Базовый URL

```
https://your-gateway.com
```

Замените на URL вашего развёртывания Webchannel.

## Аутентификация

Все relay endpoints используют Bearer-токен:

```http
Authorization: Bearer YOUR_API_KEY
```

```bash
curl https://your-gateway.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Категории API

| Категория | Описание | Док |
|----------|-------------|-----|
| Модели | Список доступных моделей | [Модели](./api/models) |
| Формат OpenAI | ChatGPT, Responses, Embeddings, изображения и др. | [Формат OpenAI](./api/openai) |
| Формат Anthropic | Claude Messages API | [Формат Anthropic](./api/anthropic) |
| Google Gemini | generateContent и streamGenerateContent | [Google Gemini](./api/gemini) |

**135 эндпоинтов** из экспорта Apifox.

## Интерактивный справочник

Полный API на [интерактивной странице](/api-reference) или [Apifox](https://ppf3lcwzqr.apifox.cn/).

## Спецификации OpenAPI

Скачать спецификации:

- [enterprise.json](/openapi/enterprise.json) — Full Apifox export (135 endpoints)
- [relay.json](/openapi/relay.json) — Relay API
