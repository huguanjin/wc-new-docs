export type ApiCategory = {
  slug: string;
  icon: string;
  color: string;
  endpoints: number;
  translateId: string;
  defaultLabel: string;
  defaultDesc: string;
};

export const API_CATEGORIES: ApiCategory[] = [
  {
    slug: 'models',
    icon: '📋',
    color: '#6366f1',
    endpoints: 1,
    translateId: 'api.cat.models',
    defaultLabel: 'Models',
    defaultDesc: 'List available models',
  },
  {
    slug: 'openai',
    icon: '🤖',
    color: '#10b981',
    endpoints: 10,
    translateId: 'api.cat.openai',
    defaultLabel: 'OpenAI',
    defaultDesc: 'Chat, Responses, Images',
  },
  {
    slug: 'anthropic',
    icon: '🧠',
    color: '#d97706',
    endpoints: 1,
    translateId: 'api.cat.anthropic',
    defaultLabel: 'Anthropic',
    defaultDesc: 'Claude Messages API',
  },
  {
    slug: 'gemini',
    icon: '✨',
    color: '#4285f4',
    endpoints: 5,
    translateId: 'api.cat.gemini',
    defaultLabel: 'Google Gemini',
    defaultDesc: 'generateContent & streaming',
  },
];

export const API_STATS = {
  endpoints: 16,
  categories: 4,
  providers: 40,
};

export const LOCALE_OPENAPI: Record<string, string> = {
  en: 'enterprise.json',
  'zh-CN': 'enterprise.zh-CN.json',
  'zh-TW': 'enterprise.zh-TW.json',
  fr: 'enterprise.fr.json',
  ja: 'enterprise.ja.json',
  ru: 'enterprise.ru.json',
  vi: 'enterprise.vi.json',
};

export function getOpenApiFile(locale: string): string {
  return LOCALE_OPENAPI[locale] ?? 'enterprise.json';
}
