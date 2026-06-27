import type {ApiEndpoint, ApiVariant, FlatEndpoint} from '@site/src/types/apiCatalog';
import type {CodeLang} from '@site/src/utils/codeSamples';

/** Official Claude API overview (single canonical reference link). */
export const ANTHROPIC_OFFICIAL_DOC_URL = 'https://platform.claude.com/docs/en/api/overview';

export const ANTHROPIC_ORIGIN = 'https://api.anthropic.com';
export const ANTHROPIC_VERSION = '2023-06-01';
export const ANTHROPIC_KEY_PLACEHOLDER = '$ANTHROPIC_API_KEY';

const ANTHROPIC_MESSAGES_PATH = '/v1/messages';

/** Required headers per https://platform.claude.com/docs/en/api/overview */
export const ANTHROPIC_REQUIRED_HEADERS = [
  {name: 'x-api-key', value: ANTHROPIC_KEY_PLACEHOLDER, note: 'API key from Console'},
  {name: 'anthropic-version', value: ANTHROPIC_VERSION, note: 'API version'},
  {name: 'content-type', value: 'application/json', note: 'Request body format'},
] as const;

export function isAnthropicApiPath(path: string): boolean {
  return path === ANTHROPIC_MESSAGES_PATH;
}

export function isAnthropicEndpoint(endpoint: FlatEndpoint | ApiEndpoint): boolean {
  if ('categorySlug' in endpoint && endpoint.categorySlug === 'anthropic') {
    return isAnthropicApiPath(endpoint.path);
  }
  return isAnthropicApiPath(endpoint.path);
}

export function resolveAnthropicRequestUrl(path: string): string {
  return `${ANTHROPIC_ORIGIN}${path}`;
}

export function resolveAnthropicGatewayUrl(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/$/, '')}${path}`;
}

function getActiveVariant(endpoint: ApiEndpoint, variantIdx: number): ApiVariant | null {
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

export function generateAnthropicCodeSample(
  lang: CodeLang,
  endpoint: ApiEndpoint,
  _baseUrl: string,
  variantIdx: number,
): string {
  const url = resolveAnthropicRequestUrl(endpoint.path);
  const method = endpoint.method.toUpperCase();
  const rawBody = getActiveRequestExample(endpoint, variantIdx);
  const body = prettyJson(rawBody);
  const bodyCompact = compactJson(rawBody);
  const hasBody = Boolean(bodyCompact);

  switch (lang) {
    case 'curl': {
      const lines = [
        `curl ${url} \\`,
        `  --header "x-api-key: ${ANTHROPIC_KEY_PLACEHOLDER}" \\`,
        `  --header "anthropic-version: ${ANTHROPIC_VERSION}" \\`,
        '  --header "content-type: application/json"',
      ];
      if (hasBody) {
        lines[lines.length - 1] += ' \\';
        lines.push(`  --data '${escapeSingleQuotes(bodyCompact!)}'`);
      }
      return lines.join('\n');
    }
    case 'python': {
      const lines = [
        'import requests',
        '',
        `url = "${url}"`,
        'headers = {',
        '    "content-type": "application/json",',
        `    "x-api-key": "${ANTHROPIC_KEY_PLACEHOLDER}",`,
        `    "anthropic-version": "${ANTHROPIC_VERSION}",`,
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
      lines.push("    'content-type': 'application/json',");
      lines.push(`    'x-api-key': '${ANTHROPIC_KEY_PLACEHOLDER}',`);
      lines.push(`    'anthropic-version': '${ANTHROPIC_VERSION}',`);
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
      lines.push('  req.Header.Set("content-type", "application/json")');
      lines.push(`  req.Header.Set("x-api-key", "${ANTHROPIC_KEY_PLACEHOLDER}")`);
      lines.push(`  req.Header.Set("anthropic-version", "${ANTHROPIC_VERSION}")`);
      lines.push('  res, _ := http.DefaultClient.Do(req)');
      lines.push('  defer res.Body.Close()');
      lines.push('  body, _ := io.ReadAll(res.Body)');
      lines.push('  fmt.Println(string(body))');
      lines.push('}');
      return lines.join('\n');
    }
    case 'php': {
      const lines = ['<?php', '$client = new \\GuzzleHttp\\Client();', ''];
      lines.push(`$response = $client->request('${method}', '${url}', [`);
      lines.push("  'headers' => [");
      lines.push("    'content-type' => 'application/json',");
      lines.push(`    'x-api-key' => '${ANTHROPIC_KEY_PLACEHOLDER}',`);
      lines.push(`    'anthropic-version' => '${ANTHROPIC_VERSION}',`);
      lines.push('  ],');
      if (hasBody) {
        lines.push(`  'body' => '${escapeSingleQuotes(bodyCompact!)}',`);
      }
      lines.push(']);');
      lines.push('echo $response->getBody();');
      return lines.join('\n');
    }
    default:
      return '';
  }
}
