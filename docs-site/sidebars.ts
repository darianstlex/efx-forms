import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      items: ['installation', 'quickstart'],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: ['api/components', 'api/hooks', 'api/utilities'],
    },
    'examples',
    'contributing',
  ],
};

export default sidebars;
