---
slug: /
sidebar_position: 1
title: Vue d'ensemble API
description: API passerelle IA — OpenAI, Claude, Gemini, etc.
---

# Vue d'ensemble de l'API

Passerelle AI unifiée pour **ChatGPT**, **Claude** et **Gemini** via une clé API unique.

## URL de base

```
https://your-gateway.com
```

Remplacez par l'URL de votre déploiement Webchannel.

## Authentification

Tous les endpoints relay utilisent l'authentification Bearer :

```http
Authorization: Bearer YOUR_API_KEY
```

```bash
curl https://your-gateway.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Catégories API

| Catégorie | Description | Doc |
|----------|-------------|-----|
| Modèles | Lister les modèles disponibles | [Modèles](./api/models) |
| Format OpenAI | ChatGPT, Responses, Embeddings, Images, etc. | [Format OpenAI](./api/openai) |
| Format Anthropic | API Claude Messages | [Format Anthropic](./api/anthropic) |
| Google Gemini | generateContent et streamGenerateContent | [Google Gemini](./api/gemini) |

**135 endpoints** documentés depuis l'export Apifox.

## Référence interactive

Parcourez l'API sur la [page de référence interactive](/api-reference) ou testez sur [Apifox](https://ppf3lcwzqr.apifox.cn/).

## Spécifications OpenAPI

Téléchargez les spécifications :

- [enterprise.json](/openapi/enterprise.json) — Full Apifox export (135 endpoints)
- [relay.json](/openapi/relay.json) — Relay API
