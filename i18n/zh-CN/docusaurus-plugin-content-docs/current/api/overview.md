---
slug: /
sidebar_position: 1
title: API 概览
description: 企业级 AI 网关 API — OpenAI、Claude、Gemini 等。
---

# API 概览

统一 AI 服务网关，通过单一 API 密钥访问 **ChatGPT**、**Claude**、**Gemini** 等模型。

## 基础 URL

```
https://your-gateway.com
```

替换为你的 Webchannel 部署地址或服务商端点。

## 身份验证

所有中继接口使用 Bearer 令牌认证：

```http
Authorization: Bearer YOUR_API_KEY
```

```bash
curl https://your-gateway.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## API 分类

| 分类 | 说明 | 文档 |
|----------|-------------|-----|
| 模型列表 | 列出可用模型 | [模型列表](./api/models) |
| OpenAI 格式 | ChatGPT、Responses、Embeddings、图像等 | [OpenAI 格式](./api/openai) |
| Anthropic 格式 | Claude Messages API | [Anthropic 格式](./api/anthropic) |
| Google Gemini | Gemini generateContent 与流式接口 | [Google Gemini](./api/gemini) |

Apifox 导出共 **135 个接口**。

## 交互式参考

在 [交互式 API 参考页](/api-reference) 浏览完整 API，或在 [Apifox](https://ppf3lcwzqr.apifox.cn/) 在线调试。

## OpenAPI 规范

下载机器可读规范文件：

- [enterprise.json](/openapi/enterprise.json) — Full Apifox export (135 endpoints)
- [relay.json](/openapi/relay.json) — Relay API
