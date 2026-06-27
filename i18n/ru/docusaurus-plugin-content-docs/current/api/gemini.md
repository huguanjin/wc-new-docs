---
sidebar_position: 5
title: Google Gemini
description: generateContent и streamGenerateContent
---

# Google Gemini

generateContent и streamGenerateContent.

Формат запросов/ответов: [справочник Gemini API](https://ai.google.dev/api?hl=zh-cn). Те же пути на базовом URL шлюза.

## Аутентификация

Официально: заголовок `x-goog-api-key`. На шлюзе также `Authorization: Bearer`.

```http
x-goog-api-key: YOUR_API_KEY
```

## Generate content

Генерация контента любой моделью Gemini. Замените `{model-name}` на ID модели.

| Метод | Путь | Описание |
|--------|------|-------------|
| `POST` | `/v1beta/models/{model-name}:generateContent` | Generate content · _30 сценариев_ |

## Stream generate content

| Метод | Путь | Описание |
|--------|------|-------------|
| `POST` | `/v1beta/models/gemini-2.5-pro:streamGenerateContent` | Stream generate content · _1 сценариев_ |
| `POST` | `/v1beta/models/gemini-3-pro-preview:streamGenerateContent` | Stream generate content |
| `POST` | `/v1beta/models/{module_name}:streamGenerateContent` | Stream generate content · _1 сценариев_ |

## Imagen

| Метод | Путь | Описание |
|--------|------|-------------|
| `POST` | `/v1beta/models/imagen-4.0-generate-001:predict` | Imagen predict · _1 сценариев_ |

:::tip Интерактивная документация
Попробуйте endpoints на [Apifox](https://ppf3lcwzqr.apifox.cn/).
:::
