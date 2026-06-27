import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Guide',
      items: [
        'guide/features',
        'guide/models',
        'guide/authentication',
        'guide/billing',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      collapsed: false,
      items: [
        'api/overview',
        'api/models',
        'api/openai',
        'api/anthropic',
        'api/gemini',
      ],
    },
    {
      type: 'category',
      label: 'Support',
      items: [
        'support/faq',
        'support/community',
      ],
    },
  ],
};

export default sidebars;
