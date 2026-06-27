---
sidebar_position: 5
title: Google Gemini
description: generateContent と streamGenerateContent
---

# Google Gemini

generateContent と streamGenerateContent.

リクエスト/レスポンス形式は [Gemini API リファレンス](https://ai.google.dev/api?hl=zh-cn) に準拠。パスは同一でホストをゲートウェイに置き換えます。

## 認証

公式: `x-goog-api-key` ヘッダー。本ゲートウェイでは `Authorization: Bearer` も可。

```http
x-goog-api-key: YOUR_API_KEY
```

## Generate content

任意の Gemini モデルでコンテンツを生成します。パスの `{model-name}` をモデル ID に置き換えてください。

| メソッド | パス | 概要 |
|--------|------|-------------|
| `POST` | `/v1beta/models/{model-name}:generateContent` | コンテンツ生成 · _30 ユースケース_ |

## Stream generate content

| メソッド | パス | 概要 |
|--------|------|-------------|
| `POST` | `/v1beta/models/gemini-2.5-pro:streamGenerateContent` | Stream generate content · _1 ユースケース_ |
| `POST` | `/v1beta/models/gemini-3-pro-preview:streamGenerateContent` | Stream generate content |
| `POST` | `/v1beta/models/{module_name}:streamGenerateContent` | Stream generate content · _1 ユースケース_ |

## Imagen

| メソッド | パス | 概要 |
|--------|------|-------------|
| `POST` | `/v1beta/models/imagen-4.0-generate-001:predict` | Imagen predict · _1 ユースケース_ |

:::tip インタラクティブドキュメント
[Apifox](https://ppf3lcwzqr.apifox.cn/) でエンドポイントを試せます。
:::
