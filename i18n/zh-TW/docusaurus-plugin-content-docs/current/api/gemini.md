---
sidebar_position: 5
title: Google Gemini
description: Gemini generateContent 與串流介面
---

# Google Gemini

Gemini generateContent 與串流介面.

請求/回應格式以 [Gemini API 參考](https://ai.google.dev/api?hl=zh-cn) 為準；路徑與官方相同，將主機換成你的閘道位址即可。

## 身份驗證

官方使用標頭 `x-goog-api-key`；經本閘道也可使用 `Authorization: Bearer` 平台權杖。

```http
x-goog-api-key: YOUR_API_KEY
```

## Generate content（內容生成）

使用任意 Gemini 模型生成文字、影像及多模態內容。將路徑中的 `{model-name}` 替換為模型 ID（如 `gemini-2.5-flash`、`gemini-2.5-pro`、`gemini-3-pro-preview`）。

| 方法 | 路徑 | 說明 |
|--------|------|-------------|
| `POST` | `/v1beta/models/{model-name}:generateContent` | 生成內容 · _30 種用法_ |

## Stream generate content（串流生成）

| 方法 | 路徑 | 說明 |
|--------|------|-------------|
| `POST` | `/v1beta/models/gemini-2.5-pro:streamGenerateContent` | 流式生成内容 · _1 種用法_ |
| `POST` | `/v1beta/models/gemini-3-pro-preview:streamGenerateContent` | 流式生成内容 · _1 種用法_ |
| `POST` | `/v1beta/models/{module_name}:streamGenerateContent` | 流式生成内容 · _1 種用法_ |

## Imagen

| 方法 | 路徑 | 說明 |
|--------|------|-------------|
| `POST` | `/v1beta/models/imagen-4.0-generate-001:predict` | Imagen 预测 · _1 種用法_ |

:::tip 線上調試
在 [Apifox](https://ppf3lcwzqr.apifox.cn/) 上互動式調試這些介面。
:::
