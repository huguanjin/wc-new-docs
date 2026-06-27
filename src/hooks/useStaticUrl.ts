import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

/**
 * Resolve URLs for files in /static.
 * They are always served from the site root and must NOT include a locale prefix
 * (e.g. /api/catalog.json, not /zh-CN/api/catalog.json).
 */
export function useStaticUrl(path: string): string {
  const {siteConfig, i18n} = useDocusaurusContext();
  const normalized = path.startsWith('/') ? path : `/${path}`;

  if (typeof window !== 'undefined') {
    return `${window.location.origin}${normalized}`;
  }

  const defaultLocale = i18n.defaultLocale ?? 'en';
  const base =
    i18n.currentLocale === defaultLocale
      ? siteConfig.baseUrl
      : '/';
  const root = base.replace(/\/$/, '') || '';
  return `${root}${normalized}`;
}
