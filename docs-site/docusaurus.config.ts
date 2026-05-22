import type { Config } from '@docusaurus/types';

const config: Config = {
  title: 'efx-forms',
  tagline: 'Effector-based React form library',
  favicon: 'img/favicon.svg',

  url: 'https://darianstlex.github.io',
  baseUrl: '/efx-forms/',
  trailingSlash: false,

  organizationName: 'darianstlex',
  projectName: 'efx-forms',
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          path: 'docs',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/darianstlex/efx-forms/tree/main/docs-site',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
    },
    prism: {
      theme: require('prism-react-renderer').themes.github,
      darkTheme: require('prism-react-renderer').themes.dracula,
    },
    navbar: {
      title: 'efx-forms',
      logo: {
        alt: 'efx-forms Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/darianstlex/efx-forms',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Tutorial',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/darianstlex/efx-forms',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} efx-forms. Built with Docusaurus.`,
    },
  },
};

export default config;
