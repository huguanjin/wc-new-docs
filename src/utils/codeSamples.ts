import type {ApiEndpoint} from '@site/src/types/apiCatalog';
import {generateAnthropicCodeSample, isAnthropicApiPath} from '@site/src/utils/anthropicApi';
import {generateGeminiCodeSample, isGeminiApiPath} from '@site/src/utils/geminiApi';

export type CodeLang = 'curl' | 'python' | 'javascript' | 'go' | 'php';

export const CODE_LANGS: {id: CodeLang; label: string}[] = [
  {id: 'curl', label: 'cURL'},
  {id: 'python', label: 'Python'},
  {id: 'javascript', label: 'JavaScript'},
  {id: 'go', label: 'Go'},
  {id: 'php', label: 'PHP'},
];

const METHODS_WITH_BODY = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

function fullUrl(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/$/, '')}${path}`;
}

function escapeSingleQuotes(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

export function generateCodeSample(
  lang: CodeLang,
  endpoint: ApiEndpoint,
  baseUrl: string,
  variantIdx = 0,
): string {
  if (isGeminiApiPath(endpoint.path)) {
    return generateGeminiCodeSample(lang, endpoint, baseUrl, variantIdx);
  }
  if (isAnthropicApiPath(endpoint.path)) {
    return generateAnthropicCodeSample(lang, endpoint, baseUrl, variantIdx);
  }

  const url = fullUrl(baseUrl, endpoint.path);
  const method = endpoint.method.toUpperCase();
  const hasBody = METHODS_WITH_BODY.has(method) && Boolean(endpoint.requestExample);

  switch (lang) {
    case 'curl': {
      const lines = [`curl -X ${method} "${url}" \\`, '  -H "Authorization: Bearer YOUR_API_KEY"'];
      if (hasBody) {
        lines.push('  -H "Content-Type: application/json" \\');
        lines.push(`  -d '${escapeSingleQuotes(endpoint.requestExample!)}'`);
      }
      return lines.join('\n');
    }
    case 'python': {
      const lines = [
        'import requests',
        '',
        `url = "${url}"`,
        'headers = {"Authorization": "Bearer YOUR_API_KEY"}',
      ];
      if (hasBody) {
        lines.push('');
        lines.push('payload = ' + endpoint.requestExample!);
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
      lines.push("  headers: {Authorization: 'Bearer YOUR_API_KEY'}");
      if (hasBody) {
        lines.push("    , 'Content-Type': 'application/json'");
        lines.push('  },');
        lines.push(`  body: ${JSON.stringify(endpoint.requestExample)}`);
      } else {
        lines.push('  }');
      }
      lines.push('};');
      lines.push('');
      lines.push('try {');
      lines.push('  const response = await fetch(url, options);');
      lines.push('  const data = await response.json();');
      lines.push('  console.log(data);');
      lines.push('} catch (error) {');
      lines.push('  console.error(error);');
      lines.push('}');
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
        lines.push(`  payload := strings.NewReader(\`${endpoint.requestExample}\`)`);
        lines.push('  req, _ := http.NewRequest("' + method + '", url, payload)');
      } else {
        lines.push('  req, _ := http.NewRequest("' + method + '", url, nil)');
      }
      lines.push('  req.Header.Add("Authorization", "Bearer YOUR_API_KEY")');
      if (hasBody) {
        lines.push('  req.Header.Add("Content-Type", "application/json")');
      }
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
        lines.push("  'headers' => ['Authorization' => 'Bearer YOUR_API_KEY'],");
        lines.push(`  'body' => '${escapeSingleQuotes(endpoint.requestExample!)}',`);
        lines.push(']);');
      } else {
        lines.push(`$response = $client->request('${method}', '${url}', [`);
        lines.push("  'headers' => ['Authorization' => 'Bearer YOUR_API_KEY'],");
        lines.push(']);');
      }
      lines.push('echo $response->getBody();');
      return lines.join('\n');
    }
    default:
      return '';
  }
}
