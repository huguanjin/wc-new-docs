import {useEffect, useMemo, useState} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useStaticUrl} from '@site/src/hooks/useStaticUrl';
import type {ApiCatalog, FlatEndpoint} from '@site/src/types/apiCatalog';

const LOCALE_CATALOG: Record<string, string> = {
  en: 'catalog.json',
  'zh-CN': 'catalog.zh-CN.json',
  'zh-TW': 'catalog.zh-TW.json',
  fr: 'catalog.fr.json',
  ja: 'catalog.ja.json',
  ru: 'catalog.ru.json',
  vi: 'catalog.vi.json',
};

function catalogFile(locale: string): string {
  return LOCALE_CATALOG[locale] ?? 'catalog.json';
}

function isApiCatalog(data: unknown): data is ApiCatalog {
  return (
    typeof data === 'object' &&
    data !== null &&
    Array.isArray((data as ApiCatalog).categories)
  );
}

export function flattenCatalog(catalog: ApiCatalog): FlatEndpoint[] {
  const flat: FlatEndpoint[] = [];
  if (!catalog.categories?.length) return flat;
  for (const category of catalog.categories) {
    for (const section of category.sections) {
      for (const endpoint of section.endpoints) {
        flat.push({
          ...endpoint,
          categorySlug: category.slug,
          categoryLabel: category.label,
          sectionId: section.id,
          sectionLabel: section.label,
        });
      }
    }
  }
  return flat;
}

export function useApiCatalog() {
  const {i18n} = useDocusaurusContext();
  const file = catalogFile(i18n.currentLocale);
  const catalogUrl = useStaticUrl(`/api/${file}`);
  const [catalog, setCatalog] = useState<ApiCatalog | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setError('');
    setCatalog(null);

    fetch(catalogUrl)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<unknown>;
      })
      .then(data => {
        if (cancelled) return;
        if (!isApiCatalog(data)) {
          throw new Error('Invalid API catalog format');
        }
        setCatalog(data);
        setStatus('ready');
      })
      .catch(err => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load catalog');
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [catalogUrl]);

  const endpoints = useMemo(
    () => (catalog ? flattenCatalog(catalog) : []),
    [catalog],
  );

  return {catalog, endpoints, status, error};
}
