import {translate} from '@docusaurus/Translate';
import type {ApiEndpoint, ApiParameter, FlatEndpoint} from '@site/src/types/apiCatalog';
import {getActiveRequestExample} from '@site/src/utils/requestBodyFields';

export const GPT_IMAGE_2_ALL_MODEL = 'gpt-image-2';
export const IMAGES_GENERATIONS_PATH = '/v1/images/generations';

const B64_RESPONSE_EXAMPLE = `{
  "data": [
    {
      "b64_json": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
    }
  ],
  "created": 1778037127,
  "usage": {
    "input_tokens": 98,
    "output_tokens": 1185,
    "total_tokens": 1283
  }
}`;

const URL_RESPONSE_EXAMPLE = `{
  "data": [
    {
      "url": "https://r2cdn.example.com/generated-image.png"
    }
  ],
  "created": 1778037331,
  "usage": {
    "input_tokens": 30,
    "output_tokens": 2074,
    "total_tokens": 2104
  }
}`;

function gptImageFieldDescriptions(): Record<string, string> {
  return {
    model: translate({
      id: 'api.gptImage.field.model',
      message: 'Model ID. Use gpt-image-2 for this endpoint.',
      description: 'gpt-image-2 request field: model',
    }),
    prompt: translate({
      id: 'api.gptImage.field.prompt',
      message:
        'Text prompt. Put aspect ratio, dimensions, and style here — this is the only way to control image size (e.g. "Landscape 16:9…", "Portrait 9:16…", "1024×1024 square logo").',
      description: 'gpt-image-2 request field: prompt',
    }),
    response_format: translate({
      id: 'api.gptImage.field.response_format',
      message:
        'Response format: b64_json (default, base64 data URL with data:image/png;base64, prefix) or url (CDN link).',
      description: 'gpt-image-2 request field: response_format',
    }),
  };
}

export function isGptImage2AllTextToImage(
  endpoint: FlatEndpoint | ApiEndpoint,
): boolean {
  if ('categorySlug' in endpoint && endpoint.categorySlug !== 'openai') {
    return false;
  }
  return (
    endpoint.method.toUpperCase() === 'POST' &&
    endpoint.path === IMAGES_GENERATIONS_PATH
  );
}

function inferJsonType(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object') return 'object';
  return typeof value;
}

function formatExampleValue(value: unknown): string {
  if (typeof value === 'string') {
    const text = value.length > 80 ? `${value.slice(0, 80)}…` : value;
    return JSON.stringify(text);
  }
  const text = JSON.stringify(value, null, 2);
  return text.length > 320 ? `${text.slice(0, 320)}…` : text;
}

export function gptImageBodyFieldsFromExample(jsonStr: string | null): ApiParameter[] {
  if (!jsonStr) return [];
  const descriptions = gptImageFieldDescriptions();
  try {
    const parsed = JSON.parse(jsonStr) as Record<string, unknown>;
    return Object.keys(parsed).map(name => ({
      in: 'body' as const,
      name,
      required: name === 'model' || name === 'prompt',
      description: descriptions[name] ?? '',
      type: inferJsonType(parsed[name]),
      example: formatExampleValue(parsed[name]),
    }));
  } catch {
    return [];
  }
}

function usesUrlFormat(jsonStr: string | null): boolean {
  if (!jsonStr) return false;
  try {
    const parsed = JSON.parse(jsonStr) as {response_format?: string};
    return parsed.response_format === 'url';
  } catch {
    return false;
  }
}

export function getGptImageResponseExample(
  endpoint: ApiEndpoint,
  variantIdx: number,
): string {
  const requestExample = getActiveRequestExample(endpoint, variantIdx);
  return usesUrlFormat(requestExample) ? URL_RESPONSE_EXAMPLE : B64_RESPONSE_EXAMPLE;
}
