import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const SITE_URL = process.env.SITE_URL || 'https://docs.newapi.pro';

const config: Config = {
  title: 'Webchannel',
  tagline: 'Next-Generation LLM Gateway and AI Asset Management System',
  favicon: 'img/logo.png',

  future: {
    v4: true,
  },

  url: SITE_URL,
  baseUrl: '/',

  organizationName: 'QuantumNous',
  projectName: 'new-api',

  onBrokenLinks: 'warn',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-CN', 'zh-TW', 'fr', 'ja', 'ru', 'vi'],
    localeConfigs: {
      en: {label: 'English', direction: 'ltr', htmlLang: 'en-US'},
      'zh-CN': {label: '简体中文', direction: 'ltr', htmlLang: 'zh-CN'},
      'zh-TW': {label: '繁體中文', direction: 'ltr', htmlLang: 'zh-TW'},
      fr: {label: 'Français', direction: 'ltr', htmlLang: 'fr-FR'},
      ja: {label: '日本語', direction: 'ltr', htmlLang: 'ja-JP'},
      ru: {label: 'Русский', direction: 'ltr', htmlLang: 'ru-RU'},
      vi: {label: 'Tiếng Việt', direction: 'ltr', htmlLang: 'vi-VN'},
    },
  },

  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'keywords',
        content:
          'Webchannel, LLM gateway, AI API proxy, OpenAI, Claude, Gemini, API management, multi-model',
      },
    },
    {
      tagName: 'meta',
      attributes: {name: 'robots', content: 'index, follow'},
    },
    {
      tagName: 'link',
      attributes: {rel: 'alternate', hrefLang: 'x-default', href: `${SITE_URL}/`},
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
          showLastUpdateTime: false,
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'ignore',
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.7,
          ignorePatterns: ['/admin/**'],
          filename: 'sitemap.xml',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/logo.png',
    metadata: [
      {name: 'description', content: 'Official documentation for Webchannel — unified LLM gateway supporting OpenAI, Claude, Gemini and 40+ providers.'},
      {property: 'og:type', content: 'website'},
      {property: 'og:site_name', content: 'Webchannel Docs'},
      {name: 'twitter:card', content: 'summary_large_image'},
    ],
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    navbar: {
      title: 'Webchannel',
      logo: {
        alt: 'Webchannel Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          to: '/api-reference',
          label: 'API',
          position: 'left',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/QuantumNous/new-api',
          label: 'GitHub',
          position: 'right',
        },
        {
          to: '/admin',
          label: 'Admin',
          position: 'right',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {label: 'Getting Started', to: '/docs/getting-started/installation'},
            {label: 'Features', to: '/docs/guide/features'},
            {label: 'API Reference', to: '/api-reference'},
          ],
        },
        {
          title: 'Community',
          items: [
            {label: 'GitHub', href: 'https://github.com/QuantumNous/new-api'},
            {label: 'Apifox Docs', href: 'https://ppf3lcwzqr.apifox.cn/'},
          ],
        },
        {
          title: 'More',
          items: [
            {label: 'Blog', to: '/blog'},
            {label: 'Docker Hub', href: 'https://hub.docker.com/r/calciumion/new-api'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} QuantumNous / Webchannel. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'yaml', 'go'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
