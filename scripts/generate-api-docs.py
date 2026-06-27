#!/usr/bin/env python3
"""Generate OpenAPI spec and Markdown docs from Apifox project export."""

from __future__ import annotations

import json
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))
from api_path_i18n import (
    has_cjk,
    localize_description,
    localize_param,
    localize_request_example,
    localize_response,
    normalize_route_path,
)
from i18n_constants import CAT_META_I18N, LOCALE_DOC_STRINGS, LOCALES
from api_summaries import (
    CANONICAL_GEMINI_GENERATE_PATH,
    CATEGORY_SECTIONS,
    canonicalize_gemini_generate_path,
    get_api_summary,
    get_category_section,
    get_path_base,
    section_description,
    section_sort_key,
    section_title,
)

DEFAULT_INPUT = ROOT / "data" / "enterprise.apifox.json"
OPENAPI_OUT = ROOT / "static" / "openapi" / "enterprise.json"
CATALOG_OUT = ROOT / "static" / "api"
DOCS_OUT = ROOT / "docs" / "api"

# OpenAI Chat Completions listed under Gemini in Apifox — not a native Gemini API.
GEMINI_EXCLUDED_PATHS = frozenset({"/v1/chat/completions"})
# NanoBanana duplicates Gemini/OpenAI image routes — excluded from docs.
EXCLUDED_CATEGORY_SLUGS = frozenset(
    {"nanobanana", "doubao-video", "suno", "doubao-image", "flux", "jimeng", "rerank", "midjourney"}
)
AUDIO_EXCLUDED_PATH_PREFIXES = ("/v1/audio/",)
# Individual Apifox operations excluded from docs (matched by exact, trimmed name).
EXCLUDED_OPERATION_NAMES = frozenset(
    {
        "Grok 视频生成",
        "GPT-4o-audio",
        "deepseek-ocr 识别",
        "创建聊天补全 qwen-mt-turbo",
    }
)


def exclude_unwanted_apis(apis: list[dict]) -> list[dict]:
    return [
        api
        for api in apis
        if api.get("category_slug") not in EXCLUDED_CATEGORY_SLUGS
        and (api.get("name") or "").strip() not in EXCLUDED_OPERATION_NAMES
        and not (
            api.get("category_slug") == "gemini"
            and api.get("path") in GEMINI_EXCLUDED_PATHS
        )
        and not any((api.get("path") or "").startswith(prefix) for prefix in AUDIO_EXCLUDED_PATH_PREFIXES)
    ]


SLUG_MAP = {
    "列出模型": "models",
    "OpenAI 格式(支持各大原厂模型)": "openai",
    "Anthropic 格式": "anthropic",
    "谷歌Gemini 接口": "gemini",
    "Midjourney 格式": "midjourney",
    "豆包系列-视频生成": "doubao-video",
    "豆包系列-绘画": "doubao-image",
    "flux-kontext-max系列": "flux",
    "即梦 AI": "jimeng",
    "Rerank 重排序模型": "rerank",
    "文生音乐 Suno": "suno",
}

# Apifox Chinese category name → localized tag label
CATEGORY_I18N: dict[str, dict[str, str]] = {
    "列出模型": {
        "en": "Models",
        "zh-CN": "列出模型",
        "zh-TW": "列出模型",
        "fr": "Modèles",
        "ja": "モデル",
        "ru": "Модели",
        "vi": "Mô hình",
    },
    "OpenAI 格式(支持各大原厂模型)": {
        "en": "OpenAI Format",
        "zh-CN": "OpenAI 格式",
        "zh-TW": "OpenAI 格式",
        "fr": "Format OpenAI",
        "ja": "OpenAI 形式",
        "ru": "Формат OpenAI",
        "vi": "Định dạng OpenAI",
    },
    "Anthropic 格式": {
        "en": "Anthropic Format",
        "zh-CN": "Anthropic 格式",
        "zh-TW": "Anthropic 格式",
        "fr": "Format Anthropic",
        "ja": "Anthropic 形式",
        "ru": "Формат Anthropic",
        "vi": "Định dạng Anthropic",
    },
    "谷歌Gemini 接口": {
        "en": "Google Gemini",
        "zh-CN": "谷歌 Gemini 接口",
        "zh-TW": "Google Gemini 介面",
        "fr": "Google Gemini",
        "ja": "Google Gemini",
        "ru": "Google Gemini",
        "vi": "Google Gemini",
    },
    "Midjourney 格式": {
        "en": "Midjourney Format",
        "zh-CN": "Midjourney 格式",
        "zh-TW": "Midjourney 格式",
        "fr": "Format Midjourney",
        "ja": "Midjourney 形式",
        "ru": "Формат Midjourney",
        "vi": "Định dạng Midjourney",
    },
    "豆包系列-视频生成": {
        "en": "Doubao Video",
        "zh-CN": "豆包系列-视频生成",
        "zh-TW": "豆包系列-影片生成",
        "fr": "Doubao Vidéo",
        "ja": "Doubao 動画",
        "ru": "Doubao Видео",
        "vi": "Doubao Video",
    },
    "豆包系列-绘画": {
        "en": "Doubao Image",
        "zh-CN": "豆包系列-绘画",
        "zh-TW": "豆包系列-繪畫",
        "fr": "Doubao Image",
        "ja": "Doubao 画像",
        "ru": "Doubao Изображения",
        "vi": "Doubao Hình ảnh",
    },
    "flux-kontext-max系列": {
        "en": "Flux Kontext",
        "zh-CN": "Flux Kontext Max",
        "zh-TW": "Flux Kontext Max",
        "fr": "Flux Kontext",
        "ja": "Flux Kontext",
        "ru": "Flux Kontext",
        "vi": "Flux Kontext",
    },
    "即梦 AI": {
        "en": "Jimeng AI",
        "zh-CN": "即梦 AI",
        "zh-TW": "即夢 AI",
        "fr": "Jimeng AI",
        "ja": "Jimeng AI",
        "ru": "Jimeng AI",
        "vi": "Jimeng AI",
    },
    "Rerank 重排序模型": {
        "en": "Rerank",
        "zh-CN": "Rerank 重排序模型",
        "zh-TW": "Rerank 重排序模型",
        "fr": "Rerank",
        "ja": "Rerank",
        "ru": "Rerank",
        "vi": "Rerank",
    },
    "文生音乐 Suno": {
        "en": "Suno Music",
        "zh-CN": "文生音乐 Suno",
        "zh-TW": "文生音樂 Suno",
        "fr": "Suno Musique",
        "ja": "Suno 音楽",
        "ru": "Suno Музыка",
        "vi": "Suno Âm nhạc",
    },
}

LOCALE_INFO: dict[str, dict[str, str]] = {
    "en": {
        "title": "Enterprise AI Gateway API",
        "description": "Unified API for OpenAI, Claude, Gemini, Midjourney, Suno, and 40+ AI providers.",
        "server_desc": "Webchannel Gateway",
        "auth_desc": "API Key: Bearer YOUR_API_KEY",
        "resp_200": "Successful response",
        "resp_401": "Unauthorized",
        "resp_429": "Rate limit exceeded",
    },
    "zh-CN": {
        "title": "企业级 AI 网关 API",
        "description": "统一接入 OpenAI、Claude、Gemini、Midjourney、Suno 等 40+ AI 服务。",
        "server_desc": "Webchannel 网关",
        "auth_desc": "API 密钥：Bearer YOUR_API_KEY",
        "resp_200": "请求成功",
        "resp_401": "未授权",
        "resp_429": "超出速率限制",
    },
    "zh-TW": {
        "title": "企業級 AI 閘道 API",
        "description": "統一接入 OpenAI、Claude、Gemini、Midjourney、Suno 等 40+ AI 服務。",
        "server_desc": "Webchannel 閘道",
        "auth_desc": "API 金鑰：Bearer YOUR_API_KEY",
        "resp_200": "請求成功",
        "resp_401": "未授權",
        "resp_429": "超出速率限制",
    },
    "fr": {
        "title": "API Passerelle IA Entreprise",
        "description": "API unifiée pour OpenAI, Claude, Gemini, Midjourney, Suno et 40+ fournisseurs IA.",
        "server_desc": "Passerelle Webchannel",
        "auth_desc": "Clé API : Bearer YOUR_API_KEY",
        "resp_200": "Réponse réussie",
        "resp_401": "Non autorisé",
        "resp_429": "Limite de débit dépassée",
    },
    "ja": {
        "title": "エンタープライズ AI ゲートウェイ API",
        "description": "OpenAI、Claude、Gemini、Midjourney、Suno など 40 以上の AI プロバイダー向け統合 API。",
        "server_desc": "Webchannel ゲートウェイ",
        "auth_desc": "API キー：Bearer YOUR_API_KEY",
        "resp_200": "成功",
        "resp_401": "認証エラー",
        "resp_429": "レート制限超過",
    },
    "ru": {
        "title": "Корпоративный AI-шлюз API",
        "description": "Единый API для OpenAI, Claude, Gemini, Midjourney, Suno и 40+ провайдеров.",
        "server_desc": "Шлюз Webchannel",
        "auth_desc": "API-ключ: Bearer YOUR_API_KEY",
        "resp_200": "Успешный ответ",
        "resp_401": "Не авторизован",
        "resp_429": "Превышен лимит запросов",
    },
    "vi": {
        "title": "API Cổng AI Doanh nghiệp",
        "description": "API thống nhất cho OpenAI, Claude, Gemini, Midjourney, Suno và 40+ nhà cung cấp AI.",
        "server_desc": "Cổng Webchannel",
        "auth_desc": "Khóa API: Bearer YOUR_API_KEY",
        "resp_200": "Phản hồi thành công",
        "resp_401": "Không được phép",
        "resp_429": "Vượt giới hạn tốc độ",
    },
}


def has_cjk(text: str) -> bool:
    return bool(re.search(r"[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff]", text))


def slugify(name: str) -> str:
    if name in SLUG_MAP:
        return SLUG_MAP[name]
    s = re.sub(r"[^\w\s-]", "", name.lower())
    s = re.sub(r"[\s_]+", "-", s).strip("-")
    return s or "api"


def normalize_path(path: str) -> str:
    return normalize_route_path(re.sub(r"\{\{([^}]+)\}\}", r"{\1}", path))


def walk_items(
    items: list,
    root_category: str | None = None,
    sub_category: str | None = None,
) -> list[dict]:
    results = []
    for item in items:
        name = item.get("name", "")
        if "api" in item:
            api = item["api"]
            results.append(
                {
                    "category": root_category or "General",
                    "category_slug": slugify(root_category or "general"),
                    "sub_category": sub_category or "",
                    "name": name,
                    "method": (api.get("method") or "get").upper(),
                    "path": normalize_path(api.get("path") or ""),
                    "description": (api.get("description") or item.get("description") or "").strip(),
                    "operation_id": api.get("operationId") or "",
                    "request_example": extract_example(api),
                    "parameters": extract_parameters(api),
                    "responses_raw": api.get("responses") or [],
                }
            )
        elif "items" in item:
            if root_category is None:
                results.extend(walk_items(item["items"], root_category=name))
            else:
                results.extend(
                    walk_items(item["items"], root_category=root_category, sub_category=name)
                )
    return results


def extract_example(api: dict) -> str | None:
    rb = api.get("requestBody") or {}
    for ex in rb.get("examples") or []:
        val = ex.get("value")
        if val:
            if isinstance(val, str):
                return val.strip()
            return json.dumps(val, ensure_ascii=False, indent=2)
    return None


def extract_parameters(api: dict) -> list[dict]:
    params_out: list[dict] = []
    raw = api.get("parameters") or {}
    if not isinstance(raw, dict):
        return params_out
    for loc in ("header", "query", "path", "cookie"):
        for param in raw.get(loc) or []:
            if param.get("enable") is False:
                continue
            name = (param.get("name") or "").strip()
            if not name:
                continue
            params_out.append(
                {
                    "in": loc,
                    "name": name,
                    "required": bool(param.get("required")),
                    "description": (param.get("description") or "").strip(),
                    "type": param.get("type") or "string",
                    "example": param.get("example"),
                }
            )
    return params_out


def extract_responses(api: dict, locale: str) -> list[dict]:
    meta = LOCALE_INFO.get(locale, LOCALE_INFO["en"])
    seen: set[str] = set()
    out: list[dict] = []
    for resp in api.get("responses_raw") or []:
        code = str(resp.get("code") or "200")
        seen.add(code)
        desc = (resp.get("description") or resp.get("name") or "").strip()
        item = {
            "code": code,
            "name": (resp.get("name") or "").strip(),
            "description": desc or meta["resp_200"],
        }
        out.append(localize_response(item, locale, meta))
    for code, key in (("401", "resp_401"), ("429", "resp_429")):
        if code not in seen:
            out.append({"code": code, "name": "", "description": meta[key]})
    out.sort(key=lambda item: item["code"])
    return out


def make_endpoint_id(method: str, path: str, name: str, seq: int) -> str:
    base = re.sub(r"[^a-zA-Z0-9]+", "-", f"{method.lower()}-{path}-{name}").strip("-").lower()
    return (base[:96] if base else f"endpoint-{seq}")


def route_endpoint_id(method: str, path: str) -> str:
    base = re.sub(r"[^a-zA-Z0-9]+", "-", f"{method.lower()}-{path}").strip("-").lower()
    return base[:96] or "endpoint"


def shorten_variant_label(base: str, label: str) -> str:
    if label == base:
        return label
    prefix = f"{base} ("
    if label.startswith(prefix) and label.endswith(")"):
        return label[len(prefix) : -1]
    return label


def canonicalize_api_paths(apis: list[dict]) -> None:
    """Normalize Gemini generateContent routes that only differ by model name."""
    for api in apis:
        canon, literal_model = canonicalize_gemini_generate_path(api["path"])
        if canon == CANONICAL_GEMINI_GENERATE_PATH:
            api["path"] = canon
            if literal_model:
                api["literal_model"] = literal_model


def gemini_model_name_param(locale: str, models: list[str]) -> dict:
    loc = locale if locale in LOCALE_INFO else "en"
    examples = ", ".join(models[:10])
    if loc.startswith("zh"):
        desc = "Gemini 模型 ID。"
        if examples:
            desc += f" 例如：{examples}"
    else:
        desc = "Gemini model ID."
        if examples:
            desc += f" Examples: {examples}"
    return {
        "in": "path",
        "name": "model-name",
        "required": True,
        "description": desc,
        "type": "string",
        "example": models[0] if models else "gemini-2.5-flash",
    }


def merge_apis_by_route(apis: list[dict], locale: str) -> list[dict]:
    """Merge duplicate method+path entries into one route with variant examples."""
    groups: dict[tuple[str, str], list] = defaultdict(list)
    for api in apis:
        groups[(api["method"], api["path"])].append(api)

    merged: list[dict] = []
    for (method, path), items in sorted(groups.items(), key=lambda pair: (pair[0][1], pair[0][0])):
        base = get_path_base(method, path, locale) or get_api_summary(
            items[0]["name"], method, path, locale
        )

        seen_labels: set[str] = set()
        variants: list[dict] = []
        for api in items:
            label = get_api_summary(api["name"], method, path, locale)
            literal_model = api.get("literal_model")
            if literal_model and literal_model not in label:
                if label == base:
                    label = f"{base} ({literal_model})"
                else:
                    label = f"{label} [{literal_model}]"
            if label in seen_labels:
                continue
            seen_labels.add(label)
            short = shorten_variant_label(base, label)
            if literal_model and short == base:
                short = literal_model
            variants.append(
                {
                    "summary": label,
                    "label": short,
                    "description": localize_description(
                        api.get("description") or "",
                        method,
                        path,
                        locale,
                        summary=label,
                    ),
                    "requestExample": localize_request_example(
                        api.get("request_example"), locale
                    ),
                    "modelName": literal_model,
                }
            )

        if len(variants) == 1 and variants[0]["summary"] == base:
            variants = []

        params_map: dict[tuple[str, str], dict] = {}
        for api in items:
            for param in api.get("parameters") or []:
                key = (param["in"], param["name"])
                prev = params_map.get(key)
                if not prev or len(param.get("description", "")) > len(prev.get("description", "")):
                    params_map[key] = param

        if path == CANONICAL_GEMINI_GENERATE_PATH:
            models = sorted({a["literal_model"] for a in items if a.get("literal_model")})
            params_map[("path", "model-name")] = gemini_model_name_param(locale, models)

        descs = [
            localize_description(d, method, path, locale, summary=base)
            for d in (api.get("description") for api in items)
            if d
        ]
        description = max(descs, key=len) if descs else ""
        if not description:
            description = localize_description("", method, path, locale, summary=base)

        request_example = next(
            (v["requestExample"] for v in variants if v.get("requestExample")),
            localize_request_example(items[0].get("request_example"), locale),
        )

        merged.append(
            {
                "id": route_endpoint_id(method, path),
                "method": method,
                "path": path,
                "summary": base,
                "description": description,
                "variants": variants,
                "variantCount": len(items),
                "parameters": [localize_param(p, locale) for p in params_map.values()],
                "responses": extract_responses(items[0], locale),
                "requestExample": request_example,
            }
        )
    return merged


def merged_table_summary(ep: dict, locale: str) -> str:
    summary = escape_mdx(ep["summary"])
    variants = ep.get("variants") or []
    if not variants:
        return summary
    strings = LOCALE_DOC_STRINGS.get(locale, LOCALE_DOC_STRINGS["en"])
    count = ep.get("variantCount", len(variants))
    hint = strings.get("variantHint", "{count} use cases").replace("{count}", str(count))
    return f"{summary} · _{hint}_"


def localize_tag(category: str, locale: str) -> str:
    mapping = CATEGORY_I18N.get(category, {})
    return mapping.get(locale, mapping.get("en", category))


def build_openapi(apis: list[dict], info: dict, locale: str = "en") -> dict:
    paths: dict = defaultdict(dict)
    seen: set[tuple[str, str]] = set()
    meta = LOCALE_INFO.get(locale, LOCALE_INFO["en"])

    for api in apis:
        key = (api["path"], api["method"].lower())
        if key in seen:
            suffix = re.sub(r"[^a-zA-Z0-9]", "_", api["name"])[:40]
            op_id = f"{api['method'].lower()}_{suffix}"
        else:
            seen.add(key)
            op_id = api["operation_id"] or re.sub(r"[^a-zA-Z0-9]", "_", f"{api['method']}_{api['path']}")

        operation = {
            "operationId": op_id,
            "summary": get_api_summary(api["name"], api["method"], api["path"], locale),
            "tags": [localize_tag(api["category"], locale)],
            "responses": {
                "200": {"description": meta["resp_200"]},
                "401": {"description": meta["resp_401"]},
                "429": {"description": meta["resp_429"]},
            },
        }
        if api["description"]:
            operation["description"] = localize_description(
                api["description"],
                api["method"],
                api["path"],
                locale,
                summary=operation["summary"],
            )
        if api["request_example"]:
            operation["requestBody"] = {
                "required": True,
                "content": {"application/json": {"schema": {"type": "object"}}},
            }
        paths[api["path"]][api["method"].lower()] = operation

    return {
        "openapi": "3.0.3",
        "info": {
            "title": meta["title"],
            "description": meta["description"],
            "version": "1.0.0",
        },
        "servers": [{"url": "https://your-gateway.com", "description": meta["server_desc"]}],
        "security": [{"bearerAuth": []}],
        "components": {
            "securitySchemes": {
                "bearerAuth": {
                    "type": "http",
                    "scheme": "bearer",
                    "description": meta["auth_desc"],
                }
            }
        },
        "paths": dict(sorted(paths.items())),
    }


def try_parse_json(text: str):
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return text


def localize_subcategory(name: str, locale: str) -> str:
    strings = LOCALE_DOC_STRINGS.get(locale, LOCALE_DOC_STRINGS["en"])
    if not name:
        return strings["general"]
    if locale in ("zh-CN", "zh-TW"):
        return escape_mdx(name)
    for m in re.finditer(r"[（(]([^）)]+)[）)]", name):
        part = m.group(1).strip()
        if part and not has_cjk(part):
            return part
    latin = re.match(r"^([A-Za-z][A-Za-z0-9 /.\-_]*)", name)
    if latin:
        return latin.group(1).strip()
    if not has_cjk(name):
        return name
    return strings["general"]


def escape_mdx(text: str) -> str:
    return text.replace("{", "\\{").replace("}", "\\}")


def format_summary(name: str, method: str, path: str, locale: str) -> str:
    return escape_mdx(get_api_summary(name, method, path, locale))


def group_apis_for_docs(slug: str, items: list[dict]) -> list[tuple[str, list[dict]]]:
    """Group endpoints by OpenAI-style sections when defined, else Apifox sub-categories."""
    if slug in CATEGORY_SECTIONS:
        by_section: dict[str, list] = defaultdict(list)
        for api in items:
            section_id = get_category_section(slug, api["method"], api["path"])
            by_section[section_id].append(api)
        return sorted(
            by_section.items(),
            key=lambda pair: section_sort_key(slug, pair[0]),
        )

    by_sub: dict[str, list] = defaultdict(list)
    for api in items:
        by_sub[api.get("sub_category") or ""].append(api)
    return list(by_sub.items())


def docs_out_dir(locale: str) -> Path:
    if locale == "en":
        return DOCS_OUT
    return ROOT / "i18n" / locale / "docusaurus-plugin-content-docs" / "current" / "api"


def write_category_docs(apis: list[dict]) -> list[str]:
    by_cat: dict[str, list] = defaultdict(list)
    for api in apis:
        by_cat[api["category_slug"]].append(api)

    generated_slugs: list[str] = []

    for slug in sorted(by_cat.keys(), key=lambda s: CAT_META_I18N.get(s, {}).get("en", (s, "", 99))[2]):
        items = by_cat[slug]
        generated_slugs.append(slug)

        for locale in LOCALES:
            strings = LOCALE_DOC_STRINGS.get(locale, LOCALE_DOC_STRINGS["en"])
            meta = CAT_META_I18N.get(slug, {}).get(locale) or CAT_META_I18N.get(slug, {}).get("en")
            if not meta:
                meta = (slug.replace("-", " ").title(), "API endpoints", 99)
            title, desc, pos = meta

            lines = [
                "---",
                f"sidebar_position: {pos}",
                f"title: {title}",
                f"description: {desc}",
                "---",
                "",
                f"# {title}",
                "",
                desc + "." if desc else "",
                "",
            ]

            if slug == "openai" and strings.get("openai_ref"):
                lines.extend([strings["openai_ref"], ""])

            if slug == "anthropic" and strings.get("anthropic_ref"):
                lines.extend([strings["anthropic_ref"], ""])

            if slug == "gemini" and strings.get("gemini_ref"):
                lines.extend([strings["gemini_ref"], ""])
                lines.extend(
                    [
                        f"## {strings['auth']}",
                        "",
                        strings.get("gemini_auth_note", ""),
                        "",
                        "```http",
                        "x-goog-api-key: YOUR_API_KEY",
                        "```",
                        "",
                    ]
                )
            elif slug == "anthropic":
                lines.extend(
                    [
                        f"## {strings['auth']}",
                        "",
                        strings.get("anthropic_auth_note", ""),
                        "",
                        "| Header | Value | Required |",
                        "|--------|-------|----------|",
                        "| `x-api-key` | Your API key from Console | One of `x-api-key` or `Authorization` |",
                        "| `anthropic-version` | e.g. `2023-06-01` | Yes |",
                        "| `content-type` | `application/json` | Yes |",
                        "",
                        "```http",
                        "x-api-key: YOUR_API_KEY",
                        "anthropic-version: 2023-06-01",
                        "content-type: application/json",
                        "```",
                        "",
                    ]
                )
            else:
                lines.extend(
                    [
                        f"## {strings['auth']}",
                        "",
                        "```http",
                        "Authorization: Bearer YOUR_API_KEY",
                        "```",
                        "",
                    ]
                )

            section_groups = group_apis_for_docs(slug, items)
            seen_paths: set[tuple[str, str]] = set()
            examples_section = []

            for section_key, section_items in section_groups:
                if slug in CATEGORY_SECTIONS:
                    heading = section_title(slug, section_key, locale)
                    section_desc = section_description(slug, section_key, locale)
                else:
                    heading = localize_subcategory(section_key, locale)
                    section_desc = ""

                lines.extend([f"## {heading}", ""])
                if section_desc:
                    lines.extend([section_desc, ""])

                lines.extend(
                    [
                        f"| {strings['method']} | {strings['path']} | {strings['summary']} |",
                        "|--------|------|-------------|",
                    ]
                )
                merged_routes = merge_apis_by_route(section_items, locale)
                for ep in merged_routes:
                    summary = merged_table_summary(ep, locale)
                    lines.append(f"| `{ep['method']}` | `{ep['path']}` | {summary} |")
                    path_key = (ep["method"], ep["path"])
                    if path_key in seen_paths:
                        continue
                    seen_paths.add(path_key)
                    variant_list = ep.get("variants") or []
                    if variant_list:
                        for variant in variant_list:
                            if variant.get("requestExample"):
                                examples_section.append(
                                    (
                                        variant.get("label") or variant["summary"],
                                        ep["method"],
                                        ep["path"],
                                        variant["requestExample"],
                                    )
                                )
                    elif ep.get("requestExample"):
                        examples_section.append(
                            (ep["summary"], ep["method"], ep["path"], ep["requestExample"])
                        )
                lines.append("")

            if examples_section and slug not in ("gemini", "anthropic"):
                lines.extend(["", f"## {strings['examples']}", ""])
                for name, method, path, example in examples_section[:5]:
                    lines.extend([f"### {name}", ""])
                    parsed = try_parse_json(example)
                    if isinstance(parsed, (dict, list)):
                        body = json.dumps(parsed, ensure_ascii=False, indent=2)
                    else:
                        body = example
                    if slug == "anthropic":
                        curl_headers = [
                            '  -H "x-api-key: YOUR_API_KEY" \\',
                            '  -H "Content-Type: application/json" \\',
                        ]
                    else:
                        curl_headers = [
                            '  -H "Authorization: Bearer YOUR_API_KEY" \\',
                            '  -H "Content-Type: application/json" \\',
                        ]
                    lines.extend(
                        [
                            "```bash",
                            f"curl -X {method} https://your-gateway.com{path} \\",
                            *curl_headers,
                            "  -d @request.json",
                            "```",
                            "",
                            '```json title="request.json"',
                            body,
                            "```",
                            "",
                        ]
                    )

            lines.extend(
                [
                    f":::tip {strings['tip_title']}",
                    strings["tip_body"],
                    ":::",
                    "",
                ]
            )

            out_dir = docs_out_dir(locale)
            out_dir.mkdir(parents=True, exist_ok=True)
            (out_dir / f"{slug}.md").write_text("\n".join(lines), encoding="utf-8")

    return generated_slugs


def write_sidebar_snippet(slugs: list[str]) -> None:
    snippet_path = ROOT / "scripts" / "api-sidebar-items.json"
    items = ["api/overview"] + [f"api/{s}" for s in slugs]
    snippet_path.write_text(json.dumps(items, indent=2), encoding="utf-8")


def _gpt_image_t2i_example(prompt: str, response_format: str) -> str:
    return json.dumps(
        {
            "model": "gpt-image-2",
            "prompt": prompt,
            "response_format": response_format,
        },
        ensure_ascii=False,
        indent=2,
    )


GPT_IMAGE_T2I_CATALOG: dict[str, dict] = {
    "en": {
        "summary": "Text-to-image (gpt-image-2)",
        "description": (
            "Generate images from text prompts using gpt-image-2. "
            "Put aspect ratio and style in the prompt — the size field is ignored."
        ),
        "b64_prompt": (
            "Landscape 16:9 cinematic frame, old lighthouse at dusk by the sea, photorealistic"
        ),
        "url_prompt": (
            "Landscape 16:9 cinematic frame, old lighthouse at dusk by the sea, photorealistic"
        ),
        "b64_label": "b64_json (default)",
        "url_label": "url",
        "b64_desc": (
            "Default response format. Returns a base64 data URL in data[0].b64_json "
            "(includes the data:image/png;base64, prefix)."
        ),
        "url_desc": "Returns a CDN URL in data[0].url. Recommended for browser playgrounds.",
    },
    "zh-CN": {
        "summary": "文生图（gpt-image-2-all）",
        "description": (
            "使用 gpt-image-2 根据文本提示词生成图片。"
            "尺寸、比例和风格请写在 prompt 中，size 字段不生效。"
        ),
        "b64_prompt": "横版 16:9 电影画幅，黄昏时的海边老灯塔，写实风格",
        "url_prompt": "横版 16:9 电影画幅，黄昏时的海边老灯塔，写实风格",
        "b64_label": "b64_json（默认）",
        "url_label": "url",
        "b64_desc": (
            "默认响应格式。返回 base64 data URL，位于 data[0].b64_json"
            "（已含 data:image/png;base64, 前缀）。"
        ),
        "url_desc": "返回 CDN 链接，位于 data[0].url。适合浏览器 Playground 预览。",
    },
    "zh-TW": {
        "summary": "文生圖（gpt-image-2-all）",
        "description": (
            "使用 gpt-image-2 根據文字提示詞生成圖片。"
            "尺寸、比例和風格請寫在 prompt 中，size 欄位不生效。"
        ),
        "b64_prompt": "橫版 16:9 電影畫幅，黃昏時的海邊老燈塔，寫實風格",
        "url_prompt": "橫版 16:9 電影畫幅，黃昏時的海邊老燈塔，寫實風格",
        "b64_label": "b64_json（預設）",
        "url_label": "url",
        "b64_desc": (
            "預設回應格式。回傳 base64 data URL，位於 data[0].b64_json"
            "（已含 data:image/png;base64, 前綴）。"
        ),
        "url_desc": "回傳 CDN 連結，位於 data[0].url。適合瀏覽器 Playground 預覽。",
    },
}


def apply_gpt_image_t2i_catalog_override(ep: dict, locale: str) -> None:
    """Align gpt-image-2 text-to-image docs with the canonical API reference."""
    if ep.get("method") != "POST" or ep.get("path") != "/v1/images/generations":
        return
    meta = GPT_IMAGE_T2I_CATALOG.get(locale) or GPT_IMAGE_T2I_CATALOG["en"]
    b64_example = _gpt_image_t2i_example(meta["b64_prompt"], "b64_json")
    url_example = _gpt_image_t2i_example(meta["url_prompt"], "url")
    ep["summary"] = meta["summary"]
    ep["description"] = meta["description"]
    ep["variants"] = [
        {
            "summary": f"{meta['summary']} ({meta['b64_label']})",
            "label": meta["b64_label"],
            "description": meta["b64_desc"],
            "requestExample": b64_example,
            "modelName": None,
        },
        {
            "summary": f"{meta['summary']} ({meta['url_label']})",
            "label": meta["url_label"],
            "description": meta["url_desc"],
            "requestExample": url_example,
            "modelName": None,
        },
    ]
    ep["variantCount"] = 2
    ep["requestExample"] = b64_example
    loc_meta = LOCALE_INFO.get(locale, LOCALE_INFO["en"])
    resp_500 = {
        "en": "Server internal error",
        "zh-CN": "服务器内部错误",
        "zh-TW": "伺服器內部錯誤",
        "fr": "Erreur interne du serveur",
        "ja": "サーバー内部エラー",
        "ru": "Внутренняя ошибка сервера",
        "vi": "Lỗi máy chủ nội bộ",
    }
    ep["responses"] = [
        {"code": "200", "name": "", "description": loc_meta["resp_200"]},
        {"code": "401", "name": "", "description": loc_meta["resp_401"]},
        {"code": "429", "name": "", "description": loc_meta["resp_429"]},
        {"code": "500", "name": "", "description": resp_500.get(locale, resp_500["en"])},
    ]


def write_api_catalog(apis: list[dict]) -> None:
    CATALOG_OUT.mkdir(parents=True, exist_ok=True)
    for locale in LOCALES:
        by_cat: dict[str, list] = defaultdict(list)
        for api in apis:
            by_cat[api["category_slug"]].append(api)

        categories: list[dict] = []
        for slug in sorted(
            by_cat.keys(),
            key=lambda s: CAT_META_I18N.get(s, {}).get("en", (s, "", 99))[2],
        ):
            items = by_cat[slug]
            meta = CAT_META_I18N.get(slug, {}).get(locale) or CAT_META_I18N.get(slug, {}).get("en")
            title = meta[0] if meta else slug.replace("-", " ").title()
            desc = meta[1] if meta else ""

            sections: list[dict] = []
            for section_id, section_items in group_apis_for_docs(slug, items):
                endpoints: list[dict] = []
                for ep in merge_apis_by_route(section_items, locale):
                    if slug == "openai":
                        apply_gpt_image_t2i_catalog_override(ep, locale)
                    endpoints.append(
                        {
                            **ep,
                            "docHref": f"/docs/api/{slug}",
                        }
                    )
                if slug in CATEGORY_SECTIONS:
                    label = section_title(slug, section_id, locale)
                    section_desc = section_description(slug, section_id, locale)
                else:
                    strings = LOCALE_DOC_STRINGS.get(locale, LOCALE_DOC_STRINGS["en"])
                    label = localize_subcategory(section_id, locale)
                    section_desc = strings["general"] if not section_id else ""
                sections.append(
                    {
                        "id": section_id or "default",
                        "label": label,
                        "description": section_desc,
                        "endpoints": endpoints,
                    }
                )

            categories.append(
                {
                    "slug": slug,
                    "label": title,
                    "description": desc,
                    "docHref": f"/docs/api/{slug}",
                    "sections": sections,
                }
            )

        catalog = {
            "version": 1,
            "baseUrl": "https://your-gateway.com",
            "categories": categories,
        }
        fname = "catalog.json" if locale == "en" else f"catalog.{locale}.json"
        out_path = CATALOG_OUT / fname
        out_path.write_text(json.dumps(catalog, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"Wrote API catalog: {out_path.name}")


def main() -> int:
    input_path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_INPUT
    if not input_path.exists():
        print(f"Error: input file not found: {input_path}", file=sys.stderr)
        return 1

    with open(input_path, encoding="utf-8") as f:
        data = json.load(f)

    apis = walk_items(data["apiCollection"][0]["items"])
    canonicalize_api_paths(apis)
    before = len(apis)
    apis = exclude_unwanted_apis(apis)
    if before != len(apis):
        print(f"Excluded {before - len(apis)} route(s) (NanoBanana / Gemini chat-completion)")
    print(f"Parsed {len(apis)} API endpoints from {input_path.name}")

    openapi = build_openapi(apis, data.get("info", {}), locale="en")
    OPENAPI_OUT.parent.mkdir(parents=True, exist_ok=True)
    with open(OPENAPI_OUT, "w", encoding="utf-8") as f:
        json.dump(openapi, f, ensure_ascii=False, indent=2)
    print(f"Wrote OpenAPI spec: {OPENAPI_OUT} ({OPENAPI_OUT.stat().st_size // 1024} KB)")

    for locale in LOCALES:
        if locale == "en":
            continue
        loc_path = OPENAPI_OUT.parent / f"enterprise.{locale}.json"
        loc_spec = build_openapi(apis, data.get("info", {}), locale=locale)
        with open(loc_path, "w", encoding="utf-8") as f:
            json.dump(loc_spec, f, ensure_ascii=False, indent=2)
        print(f"Wrote localized OpenAPI: {loc_path.name}")

    slugs = write_category_docs(apis)
    write_api_catalog(apis)
    write_sidebar_snippet(slugs)
    print(f"Generated {len(slugs)} category docs: {', '.join(slugs)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
