---
slug: /
sidebar_position: 1
title: API 概要
description: エンタープライズ AI ゲートウェイ API — OpenAI、Claude、Gemini など。
---

# API 概要

単一 API キーで **ChatGPT**、**Claude**、**Gemini** にアクセスできる統合ゲートウェイ。

## ベース URL

```
https://your-gateway.com
```

Webchannel のデプロイ URL に置き換えてください。

## 認証

すべてのリレーエンドポイントは Bearer トークン認証を使用：

```http
Authorization: Bearer YOUR_API_KEY
```

```bash
curl https://your-gateway.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## API カテゴリ

| カテゴリ | 説明 | ドキュメント |
|----------|-------------|-----|
| モデル | 利用可能なモデル一覧 | [モデル](./api/models) |
| OpenAI 形式 | ChatGPT、Responses、Embeddings、画像など | [OpenAI 形式](./api/openai) |
| Anthropic 形式 | Claude Messages API | [Anthropic 形式](./api/anthropic) |
| Google Gemini | generateContent と streamGenerateContent | [Google Gemini](./api/gemini) |

Apifox エクスポート **135 エンドポイント**。

## インタラクティブリファレンス

[インタラクティブ API リファレンス](/api-reference) または [Apifox](https://ppf3lcwzqr.apifox.cn/) で試してください。

## OpenAPI 仕様

仕様ファイルをダウンロード：

- [enterprise.json](/openapi/enterprise.json) — Full Apifox export (135 endpoints)
- [relay.json](/openapi/relay.json) — Relay API
