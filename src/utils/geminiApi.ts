import type {ApiEndpoint, ApiParameter, FlatEndpoint} from '@site/src/types/apiCatalog';
import type {CodeLang} from '@site/src/utils/codeSamples';
import {
  bodyFieldsFromExample,
  getActiveRequestExample,
} from '@site/src/utils/requestBodyFields';

export {getActiveRequestExample, getActiveVariant} from '@site/src/utils/requestBodyFields';

const GEMINI_PATH_RE = /^\/v1beta\/models\//;

/** Single canonical link for Gemini request/response format (official Google docs). */
export const GEMINI_OFFICIAL_DOC_URL = 'https://ai.google.dev/api?hl=zh-cn';

/** Host used in samples — same paths as the gateway; only the origin differs. */
export const GEMINI_OFFICIAL_ORIGIN = 'https://generativelanguage.googleapis.com';

const GEMINI_KEY_PLACEHOLDER = '$GEMINI_API_KEY';

const BODY_FIELD_DESC: Record<string, string> = {
  contents:
    'Required. The content of the current conversation with the model. For single-turn queries, this is a single instance. For multi-turn queries, this is a repeated field containing conversation history and the latest request.',
  systemInstruction:
    'Optional. Developer-set system instruction(s) for the model to steer its behavior.',
  generationConfig:
    'Optional. Configuration options for model generation and outputs.',
  safetySettings:
    'Optional. Safety settings to block unsafe content.',
  tools: 'Optional. A list of Tools the model may use to generate the next response.',
  toolConfig: 'Optional. Tool configuration for function calling.',
  cachedContent: 'Optional. The name of cached content to use as context.',
  instances: 'Required for Imagen predict. Input instances for the prediction.',
  parameters: 'Optional for Imagen predict. Parameters that govern the prediction.',
};

export function isGeminiApiPath(path: string): boolean {
  return GEMINI_PATH_RE.test(path);
}

export function extractModelFromGeminiPath(path: string): string | null {
  const match = path.match(/\/v1beta\/models\/([^/:]+):/);
  if (!match) return null;
  const segment = match[1];
  if (segment.startsWith('{') && segment.endsWith('}')) return null;
  return segment;
}

export function resolveGeminiPath(path: string, modelName?: string | null): string {
  if (!modelName) return path;
  return path.replace('{model-name}', modelName).replace('{module_name}', modelName);
}

/** Official REST URL for samples (path + model resolved; auth via header). */
export function resolveGeminiRequestUrl(
  _baseUrl: string,
  path: string,
  modelName?: string | null,
): string {
  return `${GEMINI_OFFICIAL_ORIGIN}${resolveGeminiPath(path, modelName)}`;
}

/** Gateway URL hint shown once in the docs UI (optional). */
export function resolveGeminiGatewayUrl(
  baseUrl: string,
  path: string,
  modelName?: string | null,
): string {
  return `${baseUrl.replace(/\/$/, '')}${resolveGeminiPath(path, modelName)}`;
}

export function getActiveGeminiModel(endpoint: ApiEndpoint, variantIdx: number): string {
  const variant = endpoint.variants?.[variantIdx] ?? endpoint.variants?.[0];
  if (variant?.modelName) return variant.modelName;

  const fromPath = extractModelFromGeminiPath(endpoint.path);
  if (fromPath) return fromPath;

  const pathParam = endpoint.parameters.find(p => p.in === 'path' && p.name === 'model-name');
  if (pathParam?.example != null && String(pathParam.example) !== '') {
    return String(pathParam.example);
  }

  return 'gemini-2.5-flash';
}

export function geminiBodyFieldsFromExample(jsonStr: string | null): ApiParameter[] {
  return bodyFieldsFromExample(jsonStr, 'gemini').map(field => ({
    ...field,
    required: field.name === 'contents' || field.name === 'instances' ? true : field.required,
    description: BODY_FIELD_DESC[field.name] ?? field.description,
  }));
}

function escapeSingleQuotes(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function prettyJson(raw: string | null): string | null {
  if (!raw) return null;
  try {
    return JSON.stringify(JSON.parse(raw), null, 2);
  } catch {
    return raw;
  }
}

function compactJson(raw: string | null): string | null {
  if (!raw) return null;
  try {
    return JSON.stringify(JSON.parse(raw));
  } catch {
    return raw.replace(/\s+/g, ' ');
  }
}

export function generateGeminiCodeSample(
  lang: CodeLang,
  endpoint: ApiEndpoint,
  baseUrl: string,
  variantIdx: number,
): string {
  const modelName = getActiveGeminiModel(endpoint, variantIdx);
  const url = resolveGeminiRequestUrl(baseUrl, endpoint.path, modelName);
  const method = endpoint.method.toUpperCase();
  const rawBody = getActiveRequestExample(endpoint, variantIdx);
  const body = prettyJson(rawBody);
  const bodyCompact = compactJson(rawBody);
  const hasBody = Boolean(bodyCompact);

  switch (lang) {
    case 'curl': {
      const lines = [
        `curl "${url}" \\`,
        `  -H "x-goog-api-key: ${GEMINI_KEY_PLACEHOLDER}" \\`,
        '  -H "Content-Type: application/json"',
      ];
      if (hasBody) {
        lines[lines.length - 1] += ' \\';
        lines.push(`  -X ${method} \\`);
        lines.push(`  -d '${escapeSingleQuotes(bodyCompact!)}'`);
      }
      return lines.join('\n');
    }
    case 'python': {
      const lines = [
        'import requests',
        '',
        `url = "${url}"`,
        'headers = {',
        '    "Content-Type": "application/json",',
        `    "x-goog-api-key": "${GEMINI_KEY_PLACEHOLDER}",`,
        '}',
      ];
      if (hasBody) {
        lines.push('');
        lines.push(`payload = ${body}`);
        lines.push('');
        lines.push(`response = requests.request("${method}", url, headers=headers, json=payload)`);
      } else {
        lines.push('');
        lines.push(`response = requests.request("${method}", url, headers=headers)`);
      }
      lines.push('print(response.json())');
      return lines.join('\n');
    }
    case 'javascript': {
      const lines = [`const url = '${url}';`, 'const options = {'];
      lines.push(`  method: '${method}',`);
      lines.push('  headers: {');
      lines.push("    'Content-Type': 'application/json',");
      lines.push(`    'x-goog-api-key': '${GEMINI_KEY_PLACEHOLDER}',`);
      lines.push('  },');
      if (hasBody) {
        lines.push(`  body: JSON.stringify(${bodyCompact}),`);
      }
      lines.push('};');
      lines.push('');
      lines.push('const response = await fetch(url, options);');
      lines.push('const data = await response.json();');
      lines.push('console.log(data);');
      return lines.join('\n');
    }
    case 'go': {
      const lines = [
        'package main',
        '',
        'import (',
        '  "fmt"',
        '  "net/http"',
        '  "io"',
        '  "strings"',
        ')',
        '',
        'func main() {',
        `  url := "${url}"`,
      ];
      if (hasBody) {
        lines.push(`  payload := strings.NewReader(\`${body}\`)`);
        lines.push(`  req, _ := http.NewRequest("${method}", url, payload)`);
      } else {
        lines.push(`  req, _ := http.NewRequest("${method}", url, nil)`);
      }
      lines.push('  req.Header.Set("Content-Type", "application/json")');
      lines.push(`  req.Header.Set("x-goog-api-key", "${GEMINI_KEY_PLACEHOLDER}")`);
      lines.push('  res, _ := http.DefaultClient.Do(req)');
      lines.push('  defer res.Body.Close()');
      lines.push('  body, _ := io.ReadAll(res.Body)');
      lines.push('  fmt.Println(string(body))');
      lines.push('}');
      return lines.join('\n');
    }
    case 'php': {
      const lines = ['<?php', '$client = new \\GuzzleHttp\\Client();', ''];
      if (hasBody) {
        lines.push(`$response = $client->request('${method}', '${url}', [`);
        lines.push("  'headers' => [");
        lines.push("    'Content-Type' => 'application/json',");
        lines.push(`    'x-goog-api-key' => '${GEMINI_KEY_PLACEHOLDER}',`);
        lines.push('  ],');
        lines.push(`  'body' => '${escapeSingleQuotes(bodyCompact!)}',`);
        lines.push(']);');
      } else {
        lines.push(`$response = $client->request('${method}', '${url}', [`);
        lines.push("  'headers' => [");
        lines.push("    'Content-Type' => 'application/json',");
        lines.push(`    'x-goog-api-key' => '${GEMINI_KEY_PLACEHOLDER}',`);
        lines.push('  ],');
        lines.push(']);');
      }
      lines.push('echo $response->getBody();');
      return lines.join('\n');
    }
    default:
      return '';
  }
}

export function isGeminiEndpoint(endpoint: FlatEndpoint | ApiEndpoint): boolean {
  return 'categorySlug' in endpoint && endpoint.categorySlug === 'gemini'
    ? isGeminiApiPath(endpoint.path)
    : isGeminiApiPath(endpoint.path);
}
