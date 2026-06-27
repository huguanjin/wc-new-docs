import type {ApiEndpoint, ApiParameter, ApiVariant} from '@site/src/types/apiCatalog';

const FIELD_DESCRIPTIONS: Record<string, string> = {
  model: 'Model ID for this request.',
  messages: 'Conversation turns. Each item has role (user/assistant/system) and content.',
  stream: 'When true, the response is streamed (SSE/chunked).',
  max_tokens: 'Maximum number of tokens to generate.',
  max_completion_tokens: 'Maximum completion tokens (OpenAI newer models).',
  temperature: 'Sampling temperature. Higher values yield more random output.',
  top_p: 'Nucleus sampling parameter.',
  n: 'How many chat completion choices to generate.',
  stop: 'Sequences where the API stops generating.',
  presence_penalty: 'Penalize new tokens based on presence in text so far.',
  frequency_penalty: 'Penalize new tokens based on frequency in text so far.',
  response_format: 'Structured output format (e.g. JSON schema).',
  tools: 'Tools / functions the model may invoke.',
  tool_choice: 'Controls which tool is called, if any.',
  parallel_tool_calls: 'Whether the model may call multiple tools in parallel.',
  modalities: 'Output modalities (e.g. text, audio).',
  audio: 'Audio output configuration.',
  prompt: 'Text prompt (Completions API).',
  input: 'Input for Responses API.',
  instructions: 'System-level instructions (Responses API).',
  reasoning: 'Reasoning effort configuration.',
  thinking: 'Extended thinking configuration (Anthropic).',
  system: 'System prompt (Anthropic top-level field).',
  metadata: 'Optional metadata attached to the request.',
  contents: 'Gemini conversation content (contents[].parts).',
  systemInstruction: 'Developer system instruction for Gemini.',
  generationConfig: 'Gemini generation options (temperature, modalities, etc.).',
  safetySettings: 'Gemini safety filter settings.',
  toolConfig: 'Gemini tool configuration.',
  cachedContent: 'Cached content resource name.',
  instances: 'Imagen input instances.',
  parameters: 'Imagen generation parameters.',
  size: 'Image dimensions (OpenAI Images).',
  quality: 'Image quality setting.',
  n_images: 'Number of images to generate.',
  image: 'Input image for edits.',
  mask: 'Mask image for edits.',
};

const REQUIRED_FIELDS = new Set([
  'model',
  'messages',
  'max_tokens',
  'contents',
  'instances',
  'prompt',
  'input',
]);

export function getActiveVariant(
  endpoint: ApiEndpoint,
  variantIdx: number,
): ApiVariant | null {
  if (!endpoint.variants?.length) return null;
  return endpoint.variants[variantIdx] ?? endpoint.variants[0];
}

export function getActiveRequestExample(
  endpoint: ApiEndpoint,
  variantIdx: number,
): string | null {
  const variant = getActiveVariant(endpoint, variantIdx);
  return variant?.requestExample ?? endpoint.requestExample ?? null;
}

function inferJsonType(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object') return 'object';
  return typeof value;
}

function formatExampleValue(value: unknown, maxLen = 320): string {
  let text: string;
  if (typeof value === 'string') {
    text = value.length > 80 ? `${value.slice(0, 80)}…` : value;
    return JSON.stringify(text);
  }
  text = JSON.stringify(value, null, 2);
  if (text.length > maxLen) {
    return `${text.slice(0, maxLen)}…`;
  }
  return text;
}

export function bodyFieldsFromExample(
  jsonStr: string | null,
  _categorySlug?: string,
): ApiParameter[] {
  if (!jsonStr) return [];
  try {
    const parsed = JSON.parse(jsonStr) as Record<string, unknown>;
    return Object.keys(parsed).map(name => ({
      in: 'body' as const,
      name,
      required: REQUIRED_FIELDS.has(name),
      description: FIELD_DESCRIPTIONS[name] ?? '',
      type: inferJsonType(parsed[name]),
      example: formatExampleValue(parsed[name]),
    }));
  } catch {
    return [];
  }
}

export function prettyJson(raw: string | null): string | null {
  if (!raw) return null;
  try {
    return JSON.stringify(JSON.parse(raw), null, 2);
  } catch {
    return raw;
  }
}
