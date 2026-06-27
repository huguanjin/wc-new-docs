---
sidebar_position: 5
title: Google Gemini
description: Gemini generateContent 与流式接口
---

# Google Gemini

Gemini generateContent 与流式接口.

请求/响应格式以 [Gemini API 参考](https://ai.google.dev/api?hl=zh-cn) 为准；路径与官方一致，将主机替换为你的网关地址即可。各用法的请求 JSON 见交互式 API Reference。

## 身份验证

官方使用请求头 `x-goog-api-key`；经本网关也可使用 `Authorization: Bearer` 平台令牌。

```http
x-goog-api-key: YOUR_API_KEY
```

## Generate content（内容生成）

使用任意 Gemini 模型生成文本、图像及多模态内容。将路径中的 `{model-name}` 替换为模型 ID（如 `gemini-2.5-flash`、`gemini-2.5-pro`、`gemini-3-pro-preview`）。

| 方法 | 路径 | 说明 |
|--------|------|-------------|
| `POST` | `/v1beta/models/{model-name}:generateContent` | 生成内容 · _30 种用法_ |

## Stream generate content（流式生成）

| 方法 | 路径 | 说明 |
|--------|------|-------------|
| `POST` | `/v1beta/models/gemini-2.5-pro:streamGenerateContent` | 流式生成内容 · _1 种用法_ |
| `POST` | `/v1beta/models/gemini-3-pro-preview:streamGenerateContent` | 流式生成内容 · _1 种用法_ |
| `POST` | `/v1beta/models/{module_name}:streamGenerateContent` | 流式生成内容 · _1 种用法_ |

## Imagen

| 方法 | 路径 | 说明 |
|--------|------|-------------|
| `POST` | `/v1beta/models/imagen-4.0-generate-001:predict` | Imagen 预测 · _1 种用法_ |

:::tip 在线调试
在 [Apifox](https://ppf3lcwzqr.apifox.cn/) 上交互式调试这些接口。
:::
