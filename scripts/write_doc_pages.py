#!/usr/bin/env python3
"""Write localized static documentation pages (intro, overview)."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))
from i18n_constants import CAT_META_I18N, LOCALES
I18N = ROOT / "i18n"
DOCS = ROOT / "docs"

API_SLUGS = [
    "models",
    "openai",
    "anthropic",
    "gemini",
]

OVERVIEW_I18N: dict[str, dict[str, str]] = {
    "en": {
        "title": "API Overview",
        "description": "Enterprise AI gateway API — OpenAI, Claude, Gemini, and more.",
        "heading": "API Overview",
        "intro": "Unified AI service gateway providing access to **ChatGPT**, **Claude**, and **Gemini** models through a single API key.",
        "base_url": "Base URL",
        "base_hint": "Replace with your Webchannel deployment URL or provider endpoint.",
        "auth": "Authentication",
        "auth_desc": "All relay endpoints use Bearer token authentication:",
        "categories": "API Categories",
        "cat_col": "Category",
        "desc_col": "Description",
        "doc_col": "Doc",
        "endpoints": "**135 endpoints** documented from Apifox export.",
        "interactive": "Interactive Reference",
        "interactive_desc": "Browse the full API on the [interactive reference page](/api-reference) or try endpoints on [Apifox](https://ppf3lcwzqr.apifox.cn/).",
        "openapi": "OpenAPI Specs",
        "openapi_desc": "Download machine-readable specifications:",
    },
    "zh-CN": {
        "title": "API 概览",
        "description": "企业级 AI 网关 API — OpenAI、Claude、Gemini 等。",
        "heading": "API 概览",
        "intro": "统一 AI 服务网关，通过单一 API 密钥访问 **ChatGPT**、**Claude**、**Gemini** 等模型。",
        "base_url": "基础 URL",
        "base_hint": "替换为你的 Webchannel 部署地址或服务商端点。",
        "auth": "身份验证",
        "auth_desc": "所有中继接口使用 Bearer 令牌认证：",
        "categories": "API 分类",
        "cat_col": "分类",
        "desc_col": "说明",
        "doc_col": "文档",
        "endpoints": "Apifox 导出共 **135 个接口**。",
        "interactive": "交互式参考",
        "interactive_desc": "在 [交互式 API 参考页](/api-reference) 浏览完整 API，或在 [Apifox](https://ppf3lcwzqr.apifox.cn/) 在线调试。",
        "openapi": "OpenAPI 规范",
        "openapi_desc": "下载机器可读规范文件：",
    },
    "zh-TW": {
        "title": "API 概覽",
        "description": "企業級 AI 閘道 API — OpenAI、Claude、Gemini 等。",
        "heading": "API 概覽",
        "intro": "統一 AI 服務閘道，透過單一 API 金鑰存取 **ChatGPT**、**Claude**、**Gemini** 等模型。",
        "base_url": "基礎 URL",
        "base_hint": "替換為你的 Webchannel 部署位址或服務商端點。",
        "auth": "身份驗證",
        "auth_desc": "所有中繼介面使用 Bearer 令牌認證：",
        "categories": "API 分類",
        "cat_col": "分類",
        "desc_col": "說明",
        "doc_col": "文件",
        "endpoints": "Apifox 匯出共 **135 個介面**。",
        "interactive": "互動式參考",
        "interactive_desc": "在 [互動式 API 參考頁](/api-reference) 瀏覽完整 API，或在 [Apifox](https://ppf3lcwzqr.apifox.cn/) 線上調試。",
        "openapi": "OpenAPI 規範",
        "openapi_desc": "下載機器可讀規範檔案：",
    },
    "fr": {
        "title": "Vue d'ensemble API",
        "description": "API passerelle IA — OpenAI, Claude, Gemini, etc.",
        "heading": "Vue d'ensemble de l'API",
        "intro": "Passerelle AI unifiée pour **ChatGPT**, **Claude** et **Gemini** via une clé API unique.",
        "base_url": "URL de base",
        "base_hint": "Remplacez par l'URL de votre déploiement Webchannel.",
        "auth": "Authentification",
        "auth_desc": "Tous les endpoints relay utilisent l'authentification Bearer :",
        "categories": "Catégories API",
        "cat_col": "Catégorie",
        "desc_col": "Description",
        "doc_col": "Doc",
        "endpoints": "**135 endpoints** documentés depuis l'export Apifox.",
        "interactive": "Référence interactive",
        "interactive_desc": "Parcourez l'API sur la [page de référence interactive](/api-reference) ou testez sur [Apifox](https://ppf3lcwzqr.apifox.cn/).",
        "openapi": "Spécifications OpenAPI",
        "openapi_desc": "Téléchargez les spécifications :",
    },
    "ja": {
        "title": "API 概要",
        "description": "エンタープライズ AI ゲートウェイ API — OpenAI、Claude、Gemini など。",
        "heading": "API 概要",
        "intro": "単一 API キーで **ChatGPT**、**Claude**、**Gemini** にアクセスできる統合ゲートウェイ。",
        "base_url": "ベース URL",
        "base_hint": "Webchannel のデプロイ URL に置き換えてください。",
        "auth": "認証",
        "auth_desc": "すべてのリレーエンドポイントは Bearer トークン認証を使用：",
        "categories": "API カテゴリ",
        "cat_col": "カテゴリ",
        "desc_col": "説明",
        "doc_col": "ドキュメント",
        "endpoints": "Apifox エクスポート **135 エンドポイント**。",
        "interactive": "インタラクティブリファレンス",
        "interactive_desc": "[インタラクティブ API リファレンス](/api-reference) または [Apifox](https://ppf3lcwzqr.apifox.cn/) で試してください。",
        "openapi": "OpenAPI 仕様",
        "openapi_desc": "仕様ファイルをダウンロード：",
    },
    "ru": {
        "title": "Обзор API",
        "description": "Корпоративный AI-шлюз — OpenAI, Claude, Gemini и др.",
        "heading": "Обзор API",
        "intro": "Единый шлюз для **ChatGPT**, **Claude** и **Gemini** через один API-ключ.",
        "base_url": "Базовый URL",
        "base_hint": "Замените на URL вашего развёртывания Webchannel.",
        "auth": "Аутентификация",
        "auth_desc": "Все relay endpoints используют Bearer-токен:",
        "categories": "Категории API",
        "cat_col": "Категория",
        "desc_col": "Описание",
        "doc_col": "Док",
        "endpoints": "**135 эндпоинтов** из экспорта Apifox.",
        "interactive": "Интерактивный справочник",
        "interactive_desc": "Полный API на [интерактивной странице](/api-reference) или [Apifox](https://ppf3lcwzqr.apifox.cn/).",
        "openapi": "Спецификации OpenAPI",
        "openapi_desc": "Скачать спецификации:",
    },
    "vi": {
        "title": "Tổng quan API",
        "description": "API cổng AI doanh nghiệp — OpenAI, Claude, Gemini, v.v.",
        "heading": "Tổng quan API",
        "intro": "Cổng AI thống nhất cho **ChatGPT**, **Claude** và **Gemini** qua một khóa API.",
        "base_url": "URL cơ sở",
        "base_hint": "Thay bằng URL triển khai Webchannel của bạn.",
        "auth": "Xác thực",
        "auth_desc": "Tất cả relay endpoint dùng xác thực Bearer:",
        "categories": "Danh mục API",
        "cat_col": "Danh mục",
        "desc_col": "Mô tả",
        "doc_col": "Tài liệu",
        "endpoints": "**135 endpoint** từ xuất Apifox.",
        "interactive": "Tham chiếu tương tác",
        "interactive_desc": "Xem API đầy đủ tại [trang tham chiếu](/api-reference) hoặc [Apifox](https://ppf3lcwzqr.apifox.cn/).",
        "openapi": "Đặc tả OpenAPI",
        "openapi_desc": "Tải đặc tả:",
    },
}


def docs_dir(locale: str) -> Path:
    if locale == "en":
        return DOCS
    return I18N / locale / "docusaurus-plugin-content-docs" / "current"


def write_overview(locale: str) -> None:
    L = OVERVIEW_I18N[locale]
    rows = []
    for slug in API_SLUGS:
        meta = CAT_META_I18N[slug][locale]
        rows.append(f"| {meta[0]} | {meta[1]} | [{meta[0]}](./api/{slug}) |")

    content = f"""---
slug: /
sidebar_position: 1
title: {L['title']}
description: {L['description']}
---

# {L['heading']}

{L['intro']}

## {L['base_url']}

```
https://your-gateway.com
```

{L['base_hint']}

## {L['auth']}

{L['auth_desc']}

```http
Authorization: Bearer YOUR_API_KEY
```

```bash
curl https://your-gateway.com/v1/models \\
  -H "Authorization: Bearer YOUR_API_KEY"
```

## {L['categories']}

| {L['cat_col']} | {L['desc_col']} | {L['doc_col']} |
|----------|-------------|-----|
{chr(10).join(rows)}

{L['endpoints']}

## {L['interactive']}

{L['interactive_desc']}

## {L['openapi']}

{L['openapi_desc']}

- [enterprise.json](/openapi/enterprise.json) — Full Apifox export (135 endpoints)
- [relay.json](/openapi/relay.json) — Relay API
"""
    out = docs_dir(locale) / "api" / "overview.md"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(content, encoding="utf-8")


def main() -> None:
    for locale in LOCALES:
        write_overview(locale)
        print(f"✓ {locale} overview")


if __name__ == "__main__":
    main()
