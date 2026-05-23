import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      link: { type: 'doc', id: 'intro' },
      items: ['installation', 'quickstart'],
    },
    {
      type: 'category',
      label: 'API Reference',
      link: { type: 'doc', id: 'api/components' },
      items: [
        {
          type: 'category',
          label: 'Components',
          link: { type: 'doc', id: 'api/components' },
          items: [
            'api/form-component',
            'api/field-component',
            'api/form-data-provider',
            'api/field-data-provider',
            'api/if-form-values',
            'api/if-field-value',
          ],
        },
        {
          type: 'category',
          label: 'Hooks',
          link: { type: 'doc', id: 'api/hooks' },
          items: [
            'api/useForm',
            'api/useField',
            'api/useFormData',
            'api/useFormInstance',
            'api/useFormValues',
            'api/useFormMethods',
            'api/useFormStore',
            'api/useFormStores',
            'api/useFieldData',
            'api/useFieldStore',
            'api/useFieldMethods',
            'api/useStoreProp',
            'api/useStorePropFn',
            'api/useStoreWatch',
          ],
        },
        'api/utilities',
      ],
    },
    {
      type: 'category',
      label: 'Examples',
      link: { type: 'doc', id: 'examples' },
      items: [
        'examples/basic-form',
        'examples/validation',
        'examples/advanced',
      ],
    },
    'contributing',
  ],
};

export default sidebars;
