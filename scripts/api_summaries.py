"""API operation summaries and section layout aligned with OpenAI-style API reference."""

from __future__ import annotations

import re
from typing import Callable

from api_path_i18n import (
    EXTRA_PATH_BASE,
    NAME_I18N,
    derive_english_name,
    has_cjk,
    pick,
)

OPENAI_SECTIONS: list[tuple[str, int, Callable[[str, str], bool]]] = [
    ("models", 1, lambda m, p: m == "GET" and p == "/v1/models"),
    ("chat-completions", 2, lambda m, p: p == "/v1/chat/completions"),
    ("responses", 3, lambda m, p: p == "/v1/responses"),
    ("completions", 4, lambda m, p: p == "/v1/completions"),
    ("embeddings", 5, lambda m, p: p == "/v1/embeddings"),
    ("images", 6, lambda m, p: p.startswith("/v1/images/")),
    ("audio", 7, lambda m, p: p.startswith("/v1/audio/")),
]

OPENAI_SECTION_I18N: dict[str, dict[str, str]] = {
    "models": {"en": "Models", "zh-CN": "Models（模型）", "zh-TW": "Models（模型）", "fr": "Models", "ja": "Models（モデル）", "ru": "Models", "vi": "Models"},
    "chat-completions": {"en": "Chat Completions", "zh-CN": "Chat Completions（聊天补全）", "zh-TW": "Chat Completions（聊天補全）", "fr": "Chat Completions", "ja": "Chat Completions", "ru": "Chat Completions", "vi": "Chat Completions"},
    "responses": {"en": "Responses", "zh-CN": "Responses（模型响应）", "zh-TW": "Responses（模型回應）", "fr": "Responses", "ja": "Responses", "ru": "Responses", "vi": "Responses"},
    "completions": {"en": "Completions", "zh-CN": "Completions（文本补全）", "zh-TW": "Completions（文字補全）", "fr": "Completions", "ja": "Completions", "ru": "Completions", "vi": "Completions"},
    "embeddings": {"en": "Embeddings", "zh-CN": "Embeddings（嵌入向量）", "zh-TW": "Embeddings（嵌入向量）", "fr": "Embeddings", "ja": "Embeddings", "ru": "Embeddings", "vi": "Embeddings"},
    "images": {"en": "Images", "zh-CN": "Images（图像）", "zh-TW": "Images（影像）", "fr": "Images", "ja": "Images", "ru": "Images", "vi": "Images"},
    "audio": {"en": "Audio", "zh-CN": "Audio（音频）", "zh-TW": "Audio（音訊）", "fr": "Audio", "ja": "Audio", "ru": "Audio", "vi": "Audio"},
    "other": {"en": "Other", "zh-CN": "其他", "zh-TW": "其他", "fr": "Autres", "ja": "その他", "ru": "Прочее", "vi": "Khác"},
}

OPENAI_SECTION_DESC: dict[str, dict[str, str]] = {
    "models": {"en": "List and describe models available in the API.", "zh-CN": "列出并查询 API 中可用的各类模型。", "zh-TW": "列出並查詢 API 中可用的各類模型。", "fr": "Lister les modèles disponibles.", "ja": "利用可能なモデル一覧。", "ru": "Список моделей API.", "vi": "Liệt kê mô hình khả dụng."},
    "chat-completions": {"en": "Create chat completions from a list of messages. See OpenAI Chat Completions API.", "zh-CN": "给定消息列表创建聊天补全。兼容 OpenAI Chat Completions API。", "zh-TW": "給定訊息列表建立聊天補全。相容 OpenAI Chat Completions API。", "fr": "Créer des complétions de chat.", "ja": "Chat Completions API。", "ru": "Chat Completions API.", "vi": "Chat Completions API."},
    "responses": {"en": "Create model responses with tools, reasoning, and streaming. See OpenAI Responses API.", "zh-CN": "创建模型响应，支持工具、推理与流式输出。", "zh-TW": "建立模型回應，支援工具、推理與串流輸出。", "fr": "Créer des réponses de modèle.", "ja": "Responses API。", "ru": "Responses API.", "vi": "Responses API."},
    "completions": {"en": "Legacy text completions API.", "zh-CN": "旧版文本补全 API。", "zh-TW": "舊版文字補全 API。", "fr": "API Completions legacy.", "ja": "レガシー Completions。", "ru": "Legacy Completions.", "vi": "Completions legacy."},
    "embeddings": {"en": "Create vector embeddings from text.", "zh-CN": "将文本转换为向量嵌入。", "zh-TW": "將文字轉換為向量嵌入。", "fr": "Créer des embeddings.", "ja": "テキスト埋め込み。", "ru": "Embeddings текста.", "vi": "Embeddings văn bản."},
    "images": {"en": "Generate and edit images from prompts.", "zh-CN": "根据提示词生成或编辑图像。", "zh-TW": "根據提示詞生成或編輯影像。", "fr": "Générer et modifier des images.", "ja": "画像生成・編集。", "ru": "Генерация изображений.", "vi": "Tạo và chỉnh sửa hình ảnh."},
    "audio": {"en": "Transcribe, translate, and synthesize speech.", "zh-CN": "语音转文字、翻译与语音合成。", "zh-TW": "語音轉文字、翻譯與語音合成。", "fr": "Transcription et synthèse vocale.", "ja": "音声認識・合成。", "ru": "Транскрипция и TTS.", "vi": "Nhận dạng và tổng hợp giọng nói."},
}

PATH_BASE: dict[tuple[str, str], dict[str, str]] = {
    ("GET", "/v1/models"): {"en": "List models", "zh-CN": "列出模型", "zh-TW": "列出模型", "fr": "Lister les modèles", "ja": "モデル一覧を取得", "ru": "Список моделей", "vi": "Liệt kê mô hình"},
    ("POST", "/v1/chat/completions"): {"en": "Create chat completion", "zh-CN": "创建聊天补全", "zh-TW": "建立聊天補全", "fr": "Créer une complétion de chat", "ja": "チャット補完を作成", "ru": "Создать chat completion", "vi": "Tạo chat completion"},
    ("POST", "/v1/responses"): {"en": "Create response", "zh-CN": "创建模型响应", "zh-TW": "建立模型回應", "fr": "Créer une réponse", "ja": "レスポンスを作成", "ru": "Создать response", "vi": "Tạo response"},
    ("POST", "/v1/completions"): {"en": "Create completion", "zh-CN": "创建文本补全", "zh-TW": "建立文字補全", "fr": "Créer une complétion", "ja": "テキスト補完を作成", "ru": "Создать completion", "vi": "Tạo completion"},
    ("POST", "/v1/embeddings"): {"en": "Create embeddings", "zh-CN": "创建嵌入向量", "zh-TW": "建立嵌入向量", "fr": "Créer des embeddings", "ja": "埋め込みを作成", "ru": "Создать embeddings", "vi": "Tạo embeddings"},
    ("POST", "/v1/images/generations"): {
        "en": "Text-to-image (gpt-image-2)",
        "zh-CN": "文生图（gpt-image-2）",
        "zh-TW": "文生圖（gpt-image-2）",
        "fr": "Text-to-image (gpt-image-2)",
        "ja": "Text-to-image (gpt-image-2)",
        "ru": "Text-to-image (gpt-image-2)",
        "vi": "Text-to-image (gpt-image-2)",
    },
    ("POST", "/v1/images/edits"): {"en": "Create image edit", "zh-CN": "编辑图像", "zh-TW": "編輯影像", "fr": "Modifier une image", "ja": "画像を編集", "ru": "Редактировать изображение", "vi": "Chỉnh sửa hình ảnh"},
    ("POST", "/v1/audio/transcriptions"): {"en": "Create transcription", "zh-CN": "创建语音转文字", "zh-TW": "建立語音轉文字", "fr": "Créer une transcription", "ja": "文字起こしを作成", "ru": "Создать транскрипцию", "vi": "Tạo bản ghi âm"},
    ("POST", "/v1/audio/translations"): {"en": "Create translation", "zh-CN": "创建音频翻译", "zh-TW": "建立音訊翻譯", "fr": "Créer une traduction audio", "ja": "音声翻訳を作成", "ru": "Создать перевод аудио", "vi": "Tạo bản dịch audio"},
    ("POST", "/v1/audio/speech"): {"en": "Create speech", "zh-CN": "创建语音合成", "zh-TW": "建立語音合成", "fr": "Créer une synthèse vocale", "ja": "音声合成を作成", "ru": "Создать синтез речи", "vi": "Tạo giọng nói"},
    ("POST", "/v1/messages"): {"en": "Create message", "zh-CN": "创建消息", "zh-TW": "建立訊息", "fr": "Créer un message", "ja": "メッセージを作成", "ru": "Создать сообщение", "vi": "Tạo message"},
    ("POST", "/v1beta/models/{model-name}:generateContent"): {
        "en": "Generate content",
        "zh-CN": "生成内容",
        "zh-TW": "生成內容",
        "fr": "Generate content",
        "ja": "コンテンツ生成",
        "ru": "Generate content",
        "vi": "Generate content",
    },
}

CANONICAL_GEMINI_GENERATE_PATH = "/v1beta/models/{model-name}:generateContent"
_GEMINI_GENERATE_PATH = re.compile(r"^/v1beta/models/([^/:]+):generateContent$")

VARIANT_RULES: list[tuple[re.Pattern[str], dict[str, str]]] = [
    (re.compile(r"流式|streaming", re.I), {"en": "streaming", "zh-CN": "流式", "zh-TW": "串流", "fr": "streaming", "ja": "ストリーミング", "ru": "streaming", "vi": "streaming"}),
    (re.compile(r"非流"), {"en": "non-streaming", "zh-CN": "非流式", "zh-TW": "非串流", "fr": "non-streaming", "ja": "非ストリーミング", "ru": "non-streaming", "vi": "non-streaming"}),
    (re.compile(r"识图|vision|图片理解|图像理解|分析图片"), {"en": "vision", "zh-CN": "识图", "zh-TW": "識圖", "fr": "vision", "ja": "ビジョン", "ru": "vision", "vi": "vision"}),
    (re.compile(r"函数调用|function.?call|Function calling|工具调用", re.I), {"en": "function calling", "zh-CN": "函数调用", "zh-TW": "函數呼叫", "fr": "function calling", "ja": "関数呼び出し", "ru": "function calling", "vi": "function calling"}),
    (re.compile(r"网络搜索|google search|web search", re.I), {"en": "web search", "zh-CN": "网络搜索", "zh-TW": "網路搜尋", "fr": "recherche web", "ja": "ウェブ検索", "ru": "веб-поиск", "vi": "web search"}),
    (re.compile(r"结构化|JSON|格式化输出"), {"en": "structured output", "zh-CN": "结构化输出", "zh-TW": "結構化輸出", "fr": "sortie structurée", "ja": "構造化出力", "ru": "structured output", "vi": "structured output"}),
    (re.compile(r"思考|reasoning|深度思考|推理|gpt-5"), {"en": "reasoning", "zh-CN": "推理", "zh-TW": "推理", "fr": "raisonnement", "ja": "推論", "ru": "reasoning", "vi": "reasoning"}),
    (re.compile(r"文生图|创作图"), {"en": "text-to-image", "zh-CN": "文生图", "zh-TW": "文生圖", "fr": "text-to-image", "ja": "テキストから画像", "ru": "text-to-image", "vi": "text-to-image"}),
    (re.compile(r"图生图|i2i|seededit"), {"en": "image-to-image", "zh-CN": "图生图", "zh-TW": "圖生圖", "fr": "image-to-image", "ja": "画像から画像", "ru": "image-to-image", "vi": "image-to-image"}),
    (re.compile(r"whisper", re.I), {"en": "Whisper", "zh-CN": "Whisper", "zh-TW": "Whisper", "fr": "Whisper", "ja": "Whisper", "ru": "Whisper", "vi": "Whisper"}),
    (re.compile(r"gpt-4o-audio", re.I), {"en": "GPT-4o audio", "zh-CN": "GPT-4o 音频", "zh-TW": "GPT-4o 音訊", "fr": "GPT-4o audio", "ja": "GPT-4o 音声", "ru": "GPT-4o audio", "vi": "GPT-4o audio"}),
    (re.compile(r"控制思考|思考长度|努力程度"), {"en": "reasoning effort", "zh-CN": "思考长度控制", "zh-TW": "思考長度控制", "fr": "reasoning effort", "ja": "推論努力度", "ru": "reasoning effort", "vi": "reasoning effort"}),
    (re.compile(r"prompt cache|缓存", re.I), {"en": "prompt caching", "zh-CN": "Prompt 缓存", "zh-TW": "Prompt 快取", "fr": "prompt caching", "ja": "プロンプトキャッシュ", "ru": "prompt caching", "vi": "prompt caching"}),
    (re.compile(r"best64|base64", re.I), {"en": "base64", "zh-CN": "Base64", "zh-TW": "Base64", "fr": "base64", "ja": "base64", "ru": "base64", "vi": "base64"}),
    (re.compile(r"文档理解|document", re.I), {"en": "document understanding", "zh-CN": "文档理解", "zh-TW": "文件理解", "fr": "document understanding", "ja": "ドキュメント理解", "ru": "document understanding", "vi": "document understanding"}),
    (re.compile(r"图片生成|文生图|文生图片"), {"en": "image generation", "zh-CN": "图片生成", "zh-TW": "圖片生成", "fr": "image generation", "ja": "画像生成", "ru": "image generation", "vi": "image generation"}),
    (re.compile(r"图片编辑|图生图"), {"en": "image editing", "zh-CN": "图片编辑", "zh-TW": "圖片編輯", "fr": "image editing", "ja": "画像編集", "ru": "image editing", "vi": "image editing"}),
    (re.compile(r"视频理解|video", re.I), {"en": "video understanding", "zh-CN": "视频理解", "zh-TW": "影片理解", "fr": "video understanding", "ja": "動画理解", "ru": "video understanding", "vi": "video understanding"}),
    (re.compile(r"URL context|url.?context", re.I), {"en": "URL context", "zh-CN": "URL context", "zh-TW": "URL context", "fr": "URL context", "ja": "URL context", "ru": "URL context", "vi": "URL context"}),
    (re.compile(r"原生格式"), {"en": "native format", "zh-CN": "原生格式", "zh-TW": "原生格式", "fr": "native format", "ja": "ネイティブ形式", "ru": "native format", "vi": "native format"}),
    (re.compile(r"宽高比|aspect.?ratio", re.I), {"en": "aspect ratio", "zh-CN": "宽高比", "zh-TW": "寬高比", "fr": "aspect ratio", "ja": "アスペクト比", "ru": "aspect ratio", "vi": "aspect ratio"}),
    (re.compile(r"多图融合"), {"en": "multi-image fusion", "zh-CN": "多图融合", "zh-TW": "多圖融合", "fr": "multi-image fusion", "ja": "マルチ画像融合", "ru": "multi-image fusion", "vi": "multi-image fusion"}),
    (re.compile(r"文生视频"), {"en": "text-to-video", "zh-CN": "文生视频", "zh-TW": "文生影片", "fr": "text-to-video", "ja": "テキストから動画", "ru": "text-to-video", "vi": "text-to-video"}),
]

EXACT_NAMES: dict[str, dict[str, str]] = {
    "gpt-image-2 文生图": {
        "en": "Text-to-image (gpt-image-2)",
        "zh-CN": "gpt-image-2 文生图",
        "zh-TW": "gpt-image-2 文生圖",
        "fr": "Text-to-image (gpt-image-2)",
        "ja": "Text-to-image (gpt-image-2)",
        "ru": "Text-to-image (gpt-image-2)",
        "vi": "Text-to-image (gpt-image-2)",
    },
    "GPT-4o-audio": {"en": "Create chat completion (GPT-4o audio)", "zh-CN": "GPT-4o 音频对话", "zh-TW": "GPT-4o 音訊對話", "fr": "Chat completion GPT-4o audio", "ja": "GPT-4o 音声", "ru": "GPT-4o audio chat", "vi": "GPT-4o audio chat"},
    "Embeddings": {"en": "Create embeddings", "zh-CN": "创建嵌入向量", "zh-TW": "建立嵌入向量", "fr": "Créer des embeddings", "ja": "埋め込みを作成", "ru": "Create embeddings", "vi": "Tạo embeddings"},
    "文本向量化": {"en": "Create embeddings", "zh-CN": "文本向量化", "zh-TW": "文字向量化", "fr": "Créer des embeddings", "ja": "テキスト埋め込み", "ru": "Embeddings", "vi": "Embeddings"},
    "重排序": {"en": "Rerank documents", "zh-CN": "重排序", "zh-TW": "重排序", "fr": "Rerank", "ja": "再ランキング", "ru": "Rerank", "vi": "Rerank"},
}

PATH_PATTERN_BASE: list[tuple[re.Pattern[str], dict[str, str]]] = [
    (re.compile(r":streamGenerateContent$"), {"en": "Stream generate content", "zh-CN": "流式生成内容", "zh-TW": "串流生成內容", "fr": "Stream generate content", "ja": "ストリーム生成", "ru": "Stream generate content", "vi": "Stream generate content"}),
    (re.compile(r":generateContent$"), {"en": "Generate content", "zh-CN": "生成内容", "zh-TW": "生成內容", "fr": "Generate content", "ja": "コンテンツ生成", "ru": "Generate content", "vi": "Generate content"}),
    (re.compile(r":predict$"), {"en": "Predict", "zh-CN": "Imagen 预测", "zh-TW": "Imagen 預測", "fr": "Predict", "ja": "Predict", "ru": "Predict", "vi": "Predict"}),
]

CATEGORY_SECTIONS: dict[str, list[tuple[str, int, Callable[[str, str], bool]]]] = {
    "openai": OPENAI_SECTIONS,
    "anthropic": [("messages", 1, lambda m, p: p == "/v1/messages")],
    "gemini": [
        ("generate-content", 1, lambda m, p: ":generateContent" in p and "stream" not in p),
        ("stream-generate-content", 2, lambda m, p: "streamGenerateContent" in p),
        ("imagen", 3, lambda m, p: "imagen" in p.lower() or ":predict" in p),
    ],
    "midjourney": [
        ("submit", 1, lambda m, p: "/submit/" in p),
        ("task", 2, lambda m, p: "/task/" in p or "/insight-face/" in p),
    ],
    "suno": [
        ("submit", 1, lambda m, p: "/submit/" in p),
        ("fetch", 2, lambda m, p: "/fetch" in p),
    ],
}

CATEGORY_SECTION_I18N: dict[str, dict[str, dict[str, str]]] = {
    "anthropic": {"messages": {"en": "Messages", "zh-CN": "Messages", "zh-TW": "Messages", "fr": "Messages", "ja": "Messages", "ru": "Messages", "vi": "Messages"}},
    "gemini": {
        "generate-content": {"en": "Generate content", "zh-CN": "Generate content（内容生成）", "zh-TW": "Generate content（內容生成）", "fr": "Generate content", "ja": "Generate content", "ru": "Generate content", "vi": "Generate content"},
        "stream-generate-content": {"en": "Stream generate content", "zh-CN": "Stream generate content（流式生成）", "zh-TW": "Stream generate content（串流生成）", "fr": "Stream generate content", "ja": "Stream generate content", "ru": "Stream generate content", "vi": "Stream generate content"},
        "imagen": {"en": "Imagen", "zh-CN": "Imagen", "zh-TW": "Imagen", "fr": "Imagen", "ja": "Imagen", "ru": "Imagen", "vi": "Imagen"},
    },
}

GEMINI_SECTION_DESC: dict[str, dict[str, str]] = {
    "generate-content": {
        "en": "Generate text, images, and multimodal output with any Gemini model. Set `{model-name}` in the path to the model ID (e.g. `gemini-2.5-flash`, `gemini-2.5-pro`, `gemini-3-pro-preview`).",
        "zh-CN": "使用任意 Gemini 模型生成文本、图像及多模态内容。将路径中的 `{model-name}` 替换为模型 ID（如 `gemini-2.5-flash`、`gemini-2.5-pro`、`gemini-3-pro-preview`）。",
        "zh-TW": "使用任意 Gemini 模型生成文字、影像及多模態內容。將路徑中的 `{model-name}` 替換為模型 ID（如 `gemini-2.5-flash`、`gemini-2.5-pro`、`gemini-3-pro-preview`）。",
        "fr": "Générez du contenu avec n'importe quel modèle Gemini. Remplacez `{model-name}` par l'ID du modèle.",
        "ja": "任意の Gemini モデルでコンテンツを生成します。パスの `{model-name}` をモデル ID に置き換えてください。",
        "ru": "Генерация контента любой моделью Gemini. Замените `{model-name}` на ID модели.",
        "vi": "Tạo nội dung với bất kỳ model Gemini nào. Thay `{model-name}` bằng ID model.",
    },
}

CATEGORY_SECTION_I18N["midjourney"] = {
    "submit": {"en": "Submit tasks", "zh-CN": "提交任务", "zh-TW": "提交任務", "fr": "Submit tasks", "ja": "Submit tasks", "ru": "Submit tasks", "vi": "Submit tasks"},
    "task": {"en": "Task management", "zh-CN": "任务管理", "zh-TW": "任務管理", "fr": "Task management", "ja": "Task management", "ru": "Task management", "vi": "Task management"},
}
CATEGORY_SECTION_I18N["suno"] = {
    "submit": {"en": "Submit", "zh-CN": "提交", "zh-TW": "提交", "fr": "Submit", "ja": "Submit", "ru": "Submit", "vi": "Submit"},
    "fetch": {"en": "Fetch", "zh-CN": "查询", "zh-TW": "查詢", "fr": "Fetch", "ja": "Fetch", "ru": "Fetch", "vi": "Fetch"},
}


def canonicalize_gemini_generate_path(path: str) -> tuple[str, str | None]:
    """Map literal model paths to /v1beta/models/{model-name}:generateContent."""
    m = _GEMINI_GENERATE_PATH.match(path)
    if not m:
        return path, None
    segment = m.group(1)
    if segment.startswith("{") and segment.endswith("}"):
        return CANONICAL_GEMINI_GENERATE_PATH, None
    return CANONICAL_GEMINI_GENERATE_PATH, segment


def _loc(locale: str) -> str:
    return locale if locale in ("en", "zh-CN", "zh-TW", "fr", "ja", "ru", "vi") else "en"


def extract_variants(name: str, locale: str) -> list[str]:
    loc = _loc(locale)
    found: list[str] = []
    for pattern, labels in VARIANT_RULES:
        if pattern.search(name):
            label = labels.get(loc, labels["en"])
            if label in found:
                continue
            if label == "reasoning effort" and "reasoning" in found:
                continue
            if label == "reasoning" and "reasoning effort" in found:
                found = [x for x in found if x != "reasoning effort"]
            found.append(label)
    return found


def get_path_base(method: str, path: str, locale: str) -> str | None:
    loc = _loc(locale)
    key = (method.upper(), path)
    if key in PATH_BASE:
        return PATH_BASE[key].get(loc, PATH_BASE[key]["en"])
    if key in EXTRA_PATH_BASE:
        return pick(EXTRA_PATH_BASE[key], loc)
    for pattern, labels in PATH_PATTERN_BASE:
        if pattern.search(path):
            return labels.get(loc, labels["en"])
    return None


def get_api_summary(name: str, method: str, path: str, locale: str) -> str:
    loc = _loc(locale)
    clean = name.strip()
    if clean in EXACT_NAMES:
        return EXACT_NAMES[clean].get(loc, EXACT_NAMES[clean]["en"])
    if loc in ("zh-CN", "zh-TW"):
        return clean

    if clean in NAME_I18N:
        base = pick(NAME_I18N[clean], loc)
        variants = extract_variants(clean, loc)
        if variants:
            return f"{base} ({', '.join(variants)})"
        return base

    base = get_path_base(method, path, loc)
    variants = extract_variants(clean, loc)
    if base and variants:
        return f"{base} ({', '.join(variants)})"
    if base:
        return base
    derived = derive_english_name(clean)
    if derived:
        return derived
    if re.match(r"^[A-Za-z0-9 /._\-]+$", clean):
        return clean
    return get_path_base(method, path, "en") or ""


def get_category_section(category_slug: str, method: str, path: str) -> str:
    sections = CATEGORY_SECTIONS.get(category_slug)
    if not sections:
        return "default"
    for section_id, _, matcher in sections:
        if matcher(method, path):
            return section_id
    return "other" if category_slug == "openai" else "default"


def section_title(category_slug: str, section_id: str, locale: str) -> str:
    loc = _loc(locale)
    if category_slug == "openai":
        return OPENAI_SECTION_I18N.get(section_id, OPENAI_SECTION_I18N["other"]).get(loc, section_id)
    cat = CATEGORY_SECTION_I18N.get(category_slug, {})
    if section_id in cat:
        return cat[section_id].get(loc, section_id)
    return section_id.replace("-", " ").title()


def section_description(category_slug: str, section_id: str, locale: str) -> str:
    loc = _loc(locale)
    if category_slug == "openai" and section_id in OPENAI_SECTION_DESC:
        return OPENAI_SECTION_DESC[section_id].get(loc, "")
    if category_slug == "gemini" and section_id in GEMINI_SECTION_DESC:
        return GEMINI_SECTION_DESC[section_id].get(loc, "")
    return ""


def section_sort_key(category_slug: str, section_id: str) -> int:
    sections = CATEGORY_SECTIONS.get(category_slug, [])
    for sid, order, _ in sections:
        if sid == section_id:
            return order
    return 50 if section_id != "default" else 0
