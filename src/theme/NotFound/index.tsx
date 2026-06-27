import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import NotFound from '@theme-original/NotFound';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {translate} from '@docusaurus/Translate';

const LOCALE_DEV_COMMAND: Record<string, string> = {
  'zh-CN': 'npm run start:zh',
  'zh-TW': 'npm run start:zh-tw',
  fr: 'npm run start:fr',
  ja: 'npm run start:ja',
  ru: 'npm run start:ru',
  vi: 'npm run start:vi',
};

function getRequestedLocale(pathname: string, locales: string[], defaultLocale: string): string | null {
  for (const locale of locales) {
    if (locale === defaultLocale) continue;
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return locale;
    }
  }
  return null;
}

export default function NotFoundWrapper(): ReactNode {
  const {i18n, siteConfig} = useDocusaurusContext();

  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    const requested = getRequestedLocale(
      window.location.pathname,
      siteConfig.i18n.locales,
      siteConfig.i18n.defaultLocale,
    );

    if (requested && requested !== i18n.currentLocale) {
      const devCommand = LOCALE_DEV_COMMAND[requested] ?? `npm run docusaurus -- start --locale ${requested}`;
      const title = translate({
        id: 'dev.localeUnavailable.title',
        message: 'Locale unavailable in dev mode',
        description: 'Dev-only 404 title shown when requesting a locale the dev server did not load',
      });

      return (
        <Layout title={title}>
          <main className="container margin-vert--xl">
            <h1>{title}</h1>
            <p>
              {translate(
                {
                  id: 'dev.localeUnavailable.body',
                  message:
                    'The dev server loads only one locale at a time. Currently running {current}, but you requested {requested}.',
                  description: 'Dev-only 404 explanation of the single-locale dev server',
                },
                {current: i18n.currentLocale, requested},
              )}
            </p>
            <h2>
              {translate({
                id: 'dev.localeUnavailable.howToFix',
                message: 'How to fix',
                description: 'Dev-only 404 section heading',
              })}
            </h2>
            <p>
              <strong>
                {translate(
                  {
                    id: 'dev.localeUnavailable.option1',
                    message: 'Option 1 — develop {requested}:',
                    description: 'Dev-only 404 first fix option',
                  },
                  {requested},
                )}
              </strong>
            </p>
            <pre>{devCommand}</pre>
            <p>
              <strong>
                {translate({
                  id: 'dev.localeUnavailable.option2',
                  message: 'Option 2 — preview all locales (recommended):',
                  description: 'Dev-only 404 second fix option',
                })}
              </strong>
            </p>
            <pre>npm run preview</pre>
            <p>
              {translate(
                {
                  id: 'dev.localeUnavailable.thenOpen',
                  message: 'Then open {url}',
                  description: 'Dev-only 404 instruction to open the localized URL',
                },
                {url: `http://localhost:3000/${requested}/`},
              )}
            </p>
          </main>
        </Layout>
      );
    }
  }

  return <NotFound />;
}
