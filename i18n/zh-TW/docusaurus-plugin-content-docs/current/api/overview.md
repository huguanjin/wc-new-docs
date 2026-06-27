---
slug: /
sidebar_position: 1
title: API 概覽
description: 企業級 AI 閘道 API — OpenAI、Claude、Gemini 等。
---

# API 概覽

統一 AI 服務閘道，透過單一 API 金鑰存取 **ChatGPT**、**Claude**、**Gemini** 等模型。

## 基礎 URL

```
https://your-gateway.com
```

替換為你的 Webchannel 部署位址或服務商端點。

## 身份驗證

所有中繼介面使用 Bearer 令牌認證：

```http
Authorization: Bearer YOUR_API_KEY
```

```bash
curl https://your-gateway.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## API 分類

| 分類 | 說明 | 文件 |
|----------|-------------|-----|
| 模型列表 | 列出可用模型 | [模型列表](./api/models) |
| OpenAI 格式 | ChatGPT、Responses、Embeddings、影像等 | [OpenAI 格式](./api/openai) |
| Anthropic 格式 | Claude Messages API | [Anthropic 格式](./api/anthropic) |
| Google Gemini | Gemini generateContent 與串流介面 | [Google Gemini](./api/gemini) |

Apifox 匯出共 **135 個介面**。

## 互動式參考

在 [互動式 API 參考頁](/api-reference) 瀏覽完整 API，或在 [Apifox](https://ppf3lcwzqr.apifox.cn/) 線上調試。

## OpenAPI 規範

下載機器可讀規範檔案：

- [enterprise.json](/openapi/enterprise.json) — Full Apifox export (135 endpoints)
- [relay.json](/openapi/relay.json) — Relay API
