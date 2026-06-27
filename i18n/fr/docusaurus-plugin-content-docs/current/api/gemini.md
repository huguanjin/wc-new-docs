---
sidebar_position: 5
title: Google Gemini
description: generateContent et streamGenerateContent
---

# Google Gemini

generateContent et streamGenerateContent.

Format des requêtes/réponses : [référence API Gemini](https://ai.google.dev/api?hl=zh-cn). Mêmes chemins sur l'URL de votre passerelle.

## Authentification

Officiel : en-tête `x-goog-api-key`. Sur cette passerelle : aussi `Authorization: Bearer`.

```http
x-goog-api-key: YOUR_API_KEY
```

## Generate content

Générez du contenu avec n'importe quel modèle Gemini. Remplacez `{model-name}` par l'ID du modèle.

| Méthode | Chemin | Résumé |
|--------|------|-------------|
| `POST` | `/v1beta/models/{model-name}:generateContent` | Generate content · _30 cas d'usage_ |

## Stream generate content

| Méthode | Chemin | Résumé |
|--------|------|-------------|
| `POST` | `/v1beta/models/gemini-2.5-pro:streamGenerateContent` | Stream generate content · _1 cas d'usage_ |
| `POST` | `/v1beta/models/gemini-3-pro-preview:streamGenerateContent` | Stream generate content |
| `POST` | `/v1beta/models/{module_name}:streamGenerateContent` | Stream generate content · _1 cas d'usage_ |

## Imagen

| Méthode | Chemin | Résumé |
|--------|------|-------------|
| `POST` | `/v1beta/models/imagen-4.0-generate-001:predict` | Imagen predict · _1 cas d'usage_ |

:::tip Documentation interactive
Testez ces endpoints sur [Apifox](https://ppf3lcwzqr.apifox.cn/).
:::
