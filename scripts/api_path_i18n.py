"""Path-based API summaries and description localization for non-Chinese locales."""

from __future__ import annotations

import json
import re

LOCALES = ("en", "zh-CN", "zh-TW", "fr", "ja", "ru", "vi")


def _loc(locale: str) -> str:
    return locale if locale in LOCALES else "en"


def _t(
    en: str,
    zh_cn: str,
    *,
    zh_tw: str | None = None,
    fr: str | None = None,
    ja: str | None = None,
    ru: str | None = None,
    vi: str | None = None,
) -> dict[str, str]:
    return {
        "en": en,
        "zh-CN": zh_cn,
        "zh-TW": zh_tw or zh_cn,
        "fr": fr or en,
        "ja": ja or en,
        "ru": ru or en,
        "vi": vi or en,
    }


def has_cjk(text: str) -> bool:
    return bool(re.search(r"[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff]", text))


def pick(labels: dict[str, str], locale: str) -> str:
    loc = _loc(locale)
    return labels.get(loc, labels["en"])


# (METHOD, path) → localized summary
EXTRA_PATH_BASE: dict[tuple[str, str], dict[str, str]] = {
    ("POST", "/v1/completions"): _t("Create completion", "创建文本补全"),
    ("POST", "/v1/rerank"): _t("Rerank documents", "重排序文档"),
    ("POST", "/v1/images/edits/"): _t("Create image edit", "编辑图像"),
    ("POST", "/v1/messages"): _t("Create message", "创建消息", zh_tw="建立訊息"),
    # Midjourney — submit
    ("POST", "/mj/submit/action"): _t("Submit action", "执行 Action 动作"),
    ("POST", "/mj/submit/blend"): _t("Submit blend task", "提交 Blend 任务"),
    ("POST", "/mj/submit/describe"): _t("Submit describe task", "提交 Describe 任务"),
    ("POST", "/mj/submit/edit"): _t("Submit edit task", "编辑图片"),
    ("POST", "/mj/submit/imagine"): _t("Submit imagine task", "提交 Imagine 任务"),
    ("POST", "/mj/submit/modal"): _t("Submit modal", "提交 Modal"),
    ("POST", "/mj/submit/upload-discord-images"): _t("Upload Discord images", "上传图片"),
    # Midjourney — tasks
    ("POST", "/mj/insight-face/swap"): _t("Face swap", "换脸"),
    ("GET", "/mj/task/{task_id}/fetch"): _t("Fetch task by ID", "根据任务 ID 查询任务状态"),
    ("GET", "/mj/task/{id}/image-seed"): _t("Get image seed", "获取任务图片 seed"),
    ("GET", "/mj/task/{task_id}/image-seed"): _t("Get image seed", "获取种子"),
    ("POST", "/mj/task/list-by-condition"): _t("List tasks by IDs", "根据 ID 列表查询任务"),
    ("POST", "/mj/task/url/refresh"): _t("Refresh task URL", "刷新任务链接"),
    # Suno
    ("POST", "/suno/submit/music"): _t("Generate music", "生成歌曲"),
    ("POST", "/suno/submit/lyrics"): _t("Generate lyrics", "生成歌词"),
    ("POST", "/suno/submit/concat"): _t("Concatenate songs", "歌曲拼接"),
    ("POST", "/suno/fetch"): _t("Batch fetch tasks", "批量获取任务"),
    ("GET", "/suno/fetch/{task_id}"): _t("Fetch task by ID", "查询单个任务"),
    # Doubao / Volcengine video
    ("POST", "/volc/v1/contents/generations/tasks"): _t(
        "Create video generation task", "创建视频生成任务"
    ),
    ("GET", "/volc/v1/contents/generations/tasks"): _t(
        "List video generation tasks", "查询视频生成任务列表"
    ),
    ("GET", "/volc/v1/contents/generations/tasks/{task_id}"): _t(
        "Fetch video task by ID", "查询单个视频任务"
    ),
    # Jimeng
    ("POST", "/v1/ftjimeng/createTask"): _t("Submit task", "统一任务提交"),
    ("POST", "/v1/ftjimeng/queryTask"): _t("Query task", "统一任务查询"),
    # Gemini stream / imagen
    ("POST", "/v1beta/models/{module_name}:streamGenerateContent"): _t(
        "Stream generate content", "流式生成内容"
    ),
    ("POST", "/v1beta/models/gemini-2.5-pro:streamGenerateContent"): _t(
        "Stream generate content", "流式生成内容"
    ),
    ("POST", "/v1beta/models/gemini-3-pro-preview:streamGenerateContent"): _t(
        "Stream generate content", "流式生成内容"
    ),
    ("POST", "/v1beta/models/imagen-4.0-generate-001:predict"): _t(
        "Imagen predict", "Imagen 预测"
    ),
}

# Apifox operation name → localized label (variants / edge cases)
NAME_I18N: dict[str, dict[str, str]] = {
    "聊天": _t("Create message", "聊天"),
    "创建完成": _t("Create completion", "创建完成"),
    "创建网络搜索": _t("Create response (web search)", "创建网络搜索"),
    "修改图片(images)": _t("Create image edit", "修改图片"),
    "gpt-image-2 文生图": _t("Create image (text-to-image)", "gpt-image-2 文生图"),
    "创建语音 gpt-4o-mini-tts": _t("Create speech", "创建语音"),
    "音频转文字 gpt-4o-transcribe": _t("Create transcription", "音频转文字"),
    "创建翻译 (不支持)": _t("Create translation (unsupported)", "创建翻译（不支持）"),
    "Models（列出模型）": _t("List models", "列出模型"),
    "提取任务": _t("Fetch task", "提取任务"),
    "文档理解": _t("Document understanding", "文档理解"),
    "图片生成": _t("Image generation", "图片生成"),
    "图片编辑 ": _t("Image editing", "图片编辑"),
    "格式化输出": _t("Structured output", "格式化输出"),
    "函数调用": _t("Function calling", "函数调用"),
    "文本生成": _t("Text generation", "文本生成"),
    "文本生成-流 ": _t("Text generation (streaming)", "文本生成（流式）"),
    "文本生成+思考-流 ": _t("Text generation with reasoning (streaming)", "文本生成+思考（流式）"),
    "文生图片 控制宽高比 +清晰度 ": _t("Text-to-image with aspect ratio", "文生图片（宽高比+清晰度）"),
    "Imagen 4 开发中": _t("Imagen 4 (preview)", "Imagen 4 开发中"),
    "URL context [原生格式]  ": _t("URL context (native format)", "URL context（原生格式）"),
    "图片生成 gemini-2.5-flash-image": _t("Image generation", "图片生成"),
    "多图融合片生成 gemini-3-pro-image-preview 控制宽高比 +清晰度": _t(
        "Multi-image fusion with aspect ratio", "多图融合（宽高比+清晰度）"
    ),
    "单图片 gemini-3-pro-image-preview 控制宽高比 +清晰度 ": _t(
        "Single-image generation with aspect ratio", "单图生成（宽高比+清晰度）"
    ),
    "图片生成 gemini-2.5-flash-image 控制宽高比": _t(
        "Image generation with aspect ratio", "图片生成（宽高比）"
    ),
}

PATH_DESCRIPTION: dict[tuple[str, str], dict[str, str]] = {
    ("POST", "/mj/submit/action"): _t(
        "Execute a Midjourney action (upscale, variation, etc.) on an existing task.",
        "对已有任务执行 Midjourney Action（放大、变体等）。",
    ),
    ("POST", "/mj/submit/imagine"): _t(
        "Submit a new Midjourney imagine (text-to-image) task.",
        "提交新的 Midjourney Imagine（文生图）任务。",
    ),
    ("POST", "/mj/submit/blend"): _t(
        "Blend multiple reference images into one Midjourney task.",
        "混合多张参考图并提交 Midjourney 任务。",
    ),
    ("POST", "/mj/submit/describe"): _t(
        "Describe an image and return prompt suggestions.",
        "描述图片并返回提示词建议。",
    ),
    ("POST", "/mj/submit/edit"): _t(
        "Submit an inpainting / edit region task.",
        "提交局部重绘 / 编辑任务。",
    ),
    ("POST", "/mj/submit/modal"): _t(
        "Submit a Midjourney modal interaction.",
        "提交 Midjourney Modal 交互。",
    ),
    ("POST", "/mj/submit/upload-discord-images"): _t(
        "Upload images to Discord for downstream MJ tasks.",
        "上传图片到 Discord 供后续 MJ 任务使用。",
    ),
    ("POST", "/mj/insight-face/swap"): _t(
        "Swap faces between two images.",
        "在两图之间换脸。",
    ),
    ("GET", "/mj/task/{task_id}/fetch"): _t(
        "Fetch Midjourney task status and result by task ID.",
        "根据任务 ID 查询 Midjourney 任务状态与结果。",
    ),
    ("POST", "/mj/task/list-by-condition"): _t(
        "Fetch multiple tasks by a list of task IDs.",
        "根据 ID 列表批量查询任务。",
    ),
    ("POST", "/mj/task/url/refresh"): _t(
        "Refresh expired CDN URLs for task images.",
        "刷新任务图片的过期 CDN 链接。",
    ),
    ("GET", "/mj/task/{task_id}/image-seed"): _t(
        "Get the seed value used for a completed image task.",
        "获取已完成图片任务的 seed 值。",
    ),
    ("POST", "/suno/submit/music"): _t(
        "Generate music from a text prompt (inspiration mode).",
        "根据文本提示生成音乐（灵感模式）。",
    ),
    ("POST", "/suno/submit/lyrics"): _t(
        "Generate song lyrics from a prompt.",
        "根据提示生成歌词。",
    ),
    ("POST", "/suno/submit/concat"): _t(
        "Concatenate multiple Suno song segments.",
        "拼接多段 Suno 歌曲。",
    ),
    ("POST", "/suno/fetch"): _t(
        "Batch-fetch Suno task results.",
        "批量查询 Suno 任务结果。",
    ),
    ("GET", "/suno/fetch/{task_id}"): _t(
        "Fetch a single Suno task by ID.",
        "根据 ID 查询单个 Suno 任务。",
    ),
    ("POST", "/volc/v1/contents/generations/tasks"): _t(
        "Create a Seedance / Doubao video generation task.",
        "创建 Seedance / 豆包视频生成任务。",
    ),
    ("GET", "/volc/v1/contents/generations/tasks"): _t(
        "List video generation tasks.",
        "查询视频生成任务列表。",
    ),
    ("GET", "/volc/v1/contents/generations/tasks/{task_id}"): _t(
        "Fetch a single video generation task by ID.",
        "根据 ID 查询单个视频生成任务。",
    ),
    ("POST", "/v1/ftjimeng/createTask"): _t(
        "Submit a Jimeng (Seedream) generation task.",
        "提交即梦（Seedream）生成任务。",
    ),
    ("POST", "/v1/ftjimeng/queryTask"): _t(
        "Query Jimeng task status and results.",
        "查询即梦任务状态与结果。",
    ),
}

DOC_LINK_LABEL: dict[str, str] = {
    "en": "Official documentation",
    "fr": "Documentation officielle",
    "ja": "公式ドキュメント",
    "ru": "Официальная документация",
    "vi": "Tài liệu chính thức",
}

PARAM_DESC_I18N: dict[str, dict[str, str]] = {
    "task_id": _t("Task ID", "任务 ID"),
    "id": _t("Task ID", "任务 ID"),
    "Authorization": _t(
        "Bearer token. Set header: Authorization: Bearer YOUR_API_KEY",
        "在 Header 添加 Authorization，值为 Bearer 后拼接 Token",
    ),
}


def normalize_route_path(path: str) -> str:
    """Normalize Apifox path quirks for stable grouping and i18n keys."""
    path = re.sub(r"\{\{([^}]+)\}\}", r"{\1}", path)
    path = re.sub(r"/mj/task/\d+/fetch", "/mj/task/{task_id}/fetch", path)
    if path.endswith("/") and path.count("/") > 2:
        path = path.rstrip("/")
    return path


def derive_english_name(name: str) -> str | None:
    """Extract a readable English label from mixed Chinese/English Apifox names."""
    clean = name.strip()
    paren = re.search(r"[（(]([^）)]+)[）)]", clean)
    if paren:
        inner = paren.group(1).strip()
        if inner and not has_cjk(inner):
            return inner.replace("_", " ").strip()
    latin = re.findall(r"[A-Za-z][A-Za-z0-9 +.\-_/]*", clean)
    if latin:
        return " ".join(part.strip() for part in latin if part.strip())
    return None


def localize_description(
    desc: str,
    method: str,
    path: str,
    locale: str,
    *,
    summary: str | None = None,
) -> str:
    loc = _loc(locale)
    text = (desc or "").strip()
    if loc in ("zh-CN", "zh-TW"):
        return text

    key = (method.upper(), path)
    if key in PATH_DESCRIPTION:
        return pick(PATH_DESCRIPTION[key], loc)

    url_match = re.search(r"(https?://[^\s\]\)\"']+)", text)
    if url_match and has_cjk(text):
        url = url_match.group(1).rstrip(".,)")
        label = DOC_LINK_LABEL.get(loc, DOC_LINK_LABEL["en"])
        return f"{label}: {url}"

    if has_cjk(text):
        if summary and not has_cjk(summary):
            return summary + "."
        base = pick(EXTRA_PATH_BASE.get(key, {}), loc) if key in EXTRA_PATH_BASE else ""
        if base:
            return base + "."
        return ""

    return text


def localize_param(param: dict, locale: str) -> dict:
    loc = _loc(locale)
    if loc in ("zh-CN", "zh-TW"):
        return param
    out = dict(param)
    desc = out.get("description") or ""
    if has_cjk(desc):
        name = out.get("name") or ""
        if name in PARAM_DESC_I18N:
            out["description"] = pick(PARAM_DESC_I18N[name], loc)
        elif name.lower() in ("task_id", "id"):
            out["description"] = pick(PARAM_DESC_I18N["task_id"], loc)
        else:
            out["description"] = ""
    return out


# Exact Chinese demo strings from Apifox → English (and other locales fall back to en)
EXACT_STRING_I18N: dict[str, dict[str, str]] = {
    "你好": _t("Hello", "你好"),
    "你好啊": _t("Hello", "你好啊"),
    "你好,": _t("Hello,", "你好,"),
    "你是谁?": _t("Who are you?", "你是谁?"),
    "讲个故事": _t("Tell me a story", "讲个故事"),
    "画只猫": _t("Draw a cat", "画只猫"),
    "生成一只猫": _t("Generate a cat", "生成一只猫"),
    "看完这个视频我没有笑": _t("I did not laugh after watching this video", "看完这个视频我没有笑"),
    "北京今天天气怎么样": _t("What is the weather in Beijing today?", "北京今天天气怎么样"),
    "今天北京的天气怎么样?": _t("What is the weather in Beijing today?", "今天北京的天气怎么样?"),
    "今天重庆天气如何?": _t("What is the weather in Chongqing today?", "今天重庆天气如何?"),
    "这张图片里有什么?": _t("What is in this image?", "这张图片里有什么?"),
    "这张图片里有什么?请详细描述。": _t(
        "What is in this image? Please describe in detail.",
        "这张图片里有什么?请详细描述。",
    ),
    "解析下图片中是什么": _t("Describe what appears in this image", "解析下图片中是什么"),
    "视频中是什么": _t("What is shown in this video?", "视频中是什么"),
    "只替换背景为月球基地，主体不变": _t(
        "Replace only the background with a lunar base; keep the subject unchanged",
        "只替换背景为月球基地，主体不变",
    ),
    "把图片里小狗的毛色改成金黄色": _t(
        "Change the puppy's fur color to golden yellow",
        "把图片里小狗的毛色改成金黄色",
    ),
    "改成爱心形状的泡泡": _t("Change the bubbles into heart shapes", "改成爱心形状的泡泡"),
    "让主体自然动起来，增加轻微运镜和环境动态": _t(
        "Animate the subject naturally with subtle camera movement and ambient motion",
        "让主体自然动起来，增加轻微运镜和环境动态",
    ),
    "生成狗狗趴在草地上的近景画面": _t(
        "Generate a close-up of a dog lying on the grass",
        "生成狗狗趴在草地上的近景画面",
    ),
    "你是一直小猪.你会在回复开始的时候 加一个'哼哼'": _t(
        "You are a little pig. Start every reply with 'oink oink'.",
        "你是一直小猪.你会在回复开始的时候 加一个'哼哼'",
    ),
    "extend 后的 歌曲ID": _t("Song ID after extend", "extend 后的 歌曲ID"),
    "城市名称,如:北京": _t("City name, e.g. Beijing", "城市名称,如:北京"),
    "获取当前系统时间": _t("Get the current system time", "获取当前系统时间"),
    "第一个数字": _t("First number", "第一个数字"),
    "第二个数字": _t("Second number", "第二个数字"),
    "最小值（默认1）": _t("Minimum value (default 1)", "最小值（默认1）"),
    "最大值（默认100）": _t("Maximum value (default 100)", "最大值（默认100）"),
    "生成数量（默认1，最大10）": _t("Count to generate (default 1, max 10)", "生成数量（默认1，最大10）"),
    "运算类型: add, subtract, multiply, divide, power": _t(
        "Operation type: add, subtract, multiply, divide, power",
        "运算类型: add, subtract, multiply, divide, power",
    ),
    "生成指定范围内的随机数，支持批量生成": _t(
        "Generate random numbers within a range; supports batch generation",
        "生成指定范围内的随机数，支持批量生成",
    ),
    "获取当前系统的基本信息，包括操作系统、Java版本、内存使用情况等": _t(
        "Get basic system information including OS, Java version, and memory usage",
        "获取当前系统的基本信息，包括操作系统、Java版本、内存使用情况等",
    ),
    "执行基本数学运算，支持加减乘除和幂运算": _t(
        "Perform basic math: add, subtract, multiply, divide, and power",
        "执行基本数学运算，支持加减乘除和幂运算",
    ),
    "获取指定位置的当前天气": _t("Get current weather for a location", "获取指定位置的当前天气"),
    "调用12306 mcp工具查一下明天从上海到南昌最快的火车": _t(
        "Use the 12306 MCP tool to find the fastest train from Shanghai to Nanchang tomorrow",
        "调用12306 mcp工具查一下明天从上海到南昌最快的火车",
    ),
    "总结文章的内容，不超过50个字: {text}": _t(
        "Summarize the article in no more than 50 words: {text}",
        "总结文章的内容，不超过50个字: {text}",
    ),
    "请同时帮我做以下几件事：\n1. 获取当前系统时间\n2. 查看系统信息（操作系统、内存等）\n3. 帮我计算 123.5 + 456.7 的结果\n4. 生成3个1-100之间的随机数\n\n这是一个并行工具调用测试，请同时执行这些任务。": _t(
        "Please do the following in parallel:\n1. Get the current system time\n2. Check system info (OS, memory, etc.)\n3. Calculate 123.5 + 456.7\n4. Generate 3 random numbers between 1 and 100\n\nThis is a parallel tool-calling test — run all tasks at once.",
        "请同时帮我做以下几件事：\n1. 获取当前系统时间\n2. 查看系统信息（操作系统、内存等）\n3. 帮我计算 123.5 + 456.7 的结果\n4. 生成3个1-100之间的随机数\n\n这是一个并行工具调用测试，请同时执行这些任务。",
    ),
    "美化一下这种图片,加上 我爱中国 四个字 尺寸[4:3] ": _t(
        "Enhance this image and add the text 'I love China' in 4:3 aspect ratio",
        "美化一下这种图片,加上 我爱中国 四个字 尺寸[4:3] ",
    ),
    "生成3张女孩和奶牛玩偶在游乐园开心地坐过山车的图片，涵盖早晨、中午、晚上": _t(
        "Generate 3 images of a girl and a cow plush riding a roller coaster at an amusement park — morning, noon, and evening",
        "生成3张女孩和奶牛玩偶在游乐园开心地坐过山车的图片，涵盖早晨、中午、晚上",
    ),
    "根据主体房屋的形态生成风格一致的爆炸图，依然使用白色标出重点部件并在图外标注。主体框架位于图画中央，拆解构建按照空间关系围绕主体框架排布，既分离又体现组装关系，局部标注结构尺寸": _t(
        "Generate an exploded-view diagram matching the house style; highlight key parts in white with external labels. Center the main frame with parts arranged spatially around it.",
        "根据主体房屋的形态生成风格一致的爆炸图，依然使用白色标出重点部件并在图外标注。主体框架位于图画中央，拆解构建按照空间关系围绕主体框架排布，既分离又体现组装关系，局部标注结构尺寸",
    ),
    "星际穿越，黑洞，黑洞里冲出一辆快支离破碎的复古列车，抢视觉冲击力，电影大片，末日既视感，动感，对比色，oc渲染，光线追踪，动态模糊，景深，超现实主义，深蓝，画面通过细腻的丰富的色彩层次塑造主体与场景，": _t(
        "Interstellar scene: a black hole, a battered vintage train bursting out — cinematic, high contrast, ray tracing, motion blur, depth of field, surreal deep-blue palette",
        "星际穿越，黑洞，黑洞里冲出一辆快支离破碎的复古列车，抢视觉冲击力，电影大片，末日既视感，动感，对比色，oc渲染，光线追踪，动态模糊，景深，超现实主义，深蓝，画面通过细腻的丰富的色彩层次塑造主体与场景，",
    ),
}

FIELD_STRING_DEFAULTS: dict[str, dict[str, str]] = {
    "prompt": _t("A scenic landscape at golden hour", "黄金时刻的风景"),
    "content": _t("Hello, how can you help me today?", "你好，有什么可以帮忙？"),
    "text": _t("Hello, how can you help me today?", "你好，有什么可以帮忙？"),
    "input": _t("Hello, how can you help me today?", "你好，有什么可以帮忙？"),
    "system": _t("You are a helpful assistant.", "你是一个有帮助的助手。"),
    "description": _t("See API documentation for details.", "详见 API 文档。"),
    "title": _t("Parameter", "参数"),
    "name": _t("parameter", "参数"),
}


def _localize_string(value: str, field_key: str | None, locale: str) -> str:
    if not has_cjk(value):
        return value
    stripped = value.strip()
    if stripped in EXACT_STRING_I18N:
        return pick(EXACT_STRING_I18N[stripped], locale)
    if field_key and field_key in FIELD_STRING_DEFAULTS:
        default = pick(FIELD_STRING_DEFAULTS[field_key], locale)
        if field_key in ("prompt", "content", "text", "input") and len(value) > 80:
            if field_key == "prompt":
                return pick(
                    _t(
                        "A cinematic sci-fi scene with dramatic lighting and rich detail",
                        "电影级科幻场景，戏剧性光影与丰富细节",
                    ),
                    locale,
                )
        return default
    if field_key == "description":
        return pick(FIELD_STRING_DEFAULTS["description"], locale)
    return pick(FIELD_STRING_DEFAULTS["content"], locale)


def _localize_json_node(node, field_key: str | None, locale: str):
    if isinstance(node, dict):
        return {k: _localize_json_node(v, k, locale) for k, v in node.items()}
    if isinstance(node, list):
        return [_localize_json_node(item, field_key, locale) for item in node]
    if isinstance(node, str):
        return _localize_string(node, field_key, locale)
    return node


def _localize_code_example(code: str, locale: str) -> str:
    """Replace Chinese text inside quoted strings in Python/cURL snippets."""
    loc = _loc(locale)
    if loc in ("zh-CN", "zh-TW") or not has_cjk(code):
        return code

    def repl(match: re.Match[str]) -> str:
        quote = match.group(1)
        body = match.group(2)
        if not has_cjk(body):
            return match.group(0)
        localized = _localize_string(body, "text", loc)
        escaped = localized.replace("\\", "\\\\")
        if quote == '"':
            escaped = escaped.replace('"', '\\"')
        elif quote == "'":
            escaped = escaped.replace("'", "\\'")
        return f"{quote}{escaped}{quote}"

    return re.sub(r'(["\'])((?:\\.|(?!\1).)*)\1', repl, code, flags=re.DOTALL)


def _localize_comment_line(line: str, locale: str) -> str:
    if "//" not in line or not has_cjk(line):
        return line
    prefix, _comment = line.split("//", 1)
    flags = " ".join(re.findall(r"--\w+\s[\S]+", _comment))
    label = pick(_t("Example prompt", "示例提示"), locale)
    return f"{prefix}// {label}{(' ' + flags) if flags else ''}"


def _localize_non_json_body(text: str, locale: str) -> str:
    text = _localize_code_example(text, locale)
    if not has_cjk(text):
        return text
    lines = []
    for line in text.splitlines():
        if "//" in line and has_cjk(line):
            lines.append(_localize_comment_line(line, locale))
        elif has_cjk(line):
            lines.append(re.sub(r"[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff]+", "", line))
        else:
            lines.append(line)
    return "\n".join(lines)


def localize_request_example(example: str | None, locale: str) -> str | None:
    """Return locale-appropriate request body / code sample for catalog and curl."""
    if not example:
        return example
    loc = _loc(locale)
    if loc in ("zh-CN", "zh-TW"):
        return example

    text = example.strip()
    try:
        parsed = json.loads(text)
    except json.JSONDecodeError:
        return _localize_non_json_body(text, loc)

    localized = _localize_json_node(parsed, None, loc)
    return json.dumps(localized, ensure_ascii=False, indent=2)


def localize_response(resp: dict, locale: str, meta: dict[str, str]) -> dict:
    """Normalize Apifox response labels for non-Chinese catalogs."""
    loc = _loc(locale)
    code = str(resp.get("code", "200"))
    out = dict(resp)
    if loc in ("zh-CN", "zh-TW"):
        return out
    name = (out.get("name") or "").strip()
    desc = (out.get("description") or "").strip()
    if has_cjk(name):
        out["name"] = ""
    if code == "401":
        out["description"] = meta["resp_401"]
    elif code == "429":
        out["description"] = meta["resp_429"]
    elif has_cjk(desc) or not desc:
        out["description"] = meta["resp_200"]
    return out
