# Webchannel Documentation Site

Official documentation for [Webchannel](https://github.com/QuantumNous/new-api) — a next-generation LLM gateway and AI asset management system.

Built with [Docusaurus](https://docusaurus.io/) for SEO-friendly static site generation, multi-language support
## Features

- **SEO Optimized** — Static generation, sitemap, meta tags, Open Graph, RSS/Atom feeds
- **Multi-language** — English, 简体中文, 繁體中文, Français, 日本語, Русский, Tiếng Việt
- **Public Access** — All documentation pages are accessible without login
- **OpenAPI Specs** — enterprise.json, relay.json, api.json

## Quick Start

### Development


> **多语言开发说明：** `npm start` 默认只加载 **英文**。直接访问 `/zh-CN/` 会 404。
>
> - 开发中文：`npm run start:zh` → 访问 http://localhost:3000/zh-CN/
> - 预览全部 7 种语言：`npm run preview` → 构建后访问 http://localhost:3000/zh-CN/
>
> 生产环境（Docker / `npm run build`）所有语言均可正常访问。


Configure via `admin-server/.env`:

```bash
cp admin-server/.env.example admin-server/.env
```

### Production Build

```bash
npm run build
npm run serve
```

### Docker

```bash
docker compose up -d
# Docs: http://localhost:8080
```

## Multi-language

Supported locales: **en**, **zh-CN**, **zh-TW**, **fr**, **ja**, **ru**, **vi**

| 场景 | 命令 | 访问中文 |
|------|------|----------|
| 英文热更新开发 | `npm start` | ❌ `/zh-CN/` 不可用 |
| 中文热更新开发 | `npm run start:zh` | ✅ http://localhost:3000/zh-CN/ |
| 预览全部语言 | `npm run preview` | ✅ 构建后全部可用 |

```bash
# Regenerate UI translations (navbar, footer, sidebar, homepage)
npm run setup:i18n

# Dev with a specific locale
npm run start:zh      # zh-CN
npm run start:zh-tw   # zh-TW
npm run start:fr      # fr
npm run start:ja      # ja

# Build + serve all locales (production-like)
npm run preview
```

Translation files live in `i18n/{locale}/`. Chinese locales include full API docs from Apifox.

## API Documentation (Apifox)

Enterprise API docs are generated from `data/enterprise.apifox.json`:

```bash
# Copy your Apifox export
cp /path/to/企业级.Apifox.json data/enterprise.apifox.json

# Regenerate OpenAPI + Markdown docs
npm run generate:api-docs
```

Categories: OpenAI, Anthropic, Gemini, Midjourney, Suno, Doubao, Jimeng, Flux, Rerank, and more.

## Project Structure

```
new-api-docs/
├── docs/                  # English documentation (default locale)
├── i18n/                  # Translated content and UI strings
│   ├── zh-CN/
│   ├── zh-TW/
│   └── ...
├── src/pages/
│   ├── index.tsx          # Homepage
│   └── api-reference.tsx 
├── static/openapi/        # OpenAPI JSON specs
└── docusaurus.config.ts   # Site configuration
```

## Adding Translations

1. Run `npm run write-translations` to generate translation templates
2. Edit files in `i18n/{locale}/`
3. Add translated docs in `i18n/{locale}/docusaurus-plugin-content-docs/current/`

## API Documentation

- **Built-in:** `/api-reference` page
- **OpenAPI:** `/openapi/relay.json`, `/openapi/api.json`

## License

Documentation content follows the Webchannel project license. Docusaurus is MIT licensed.
