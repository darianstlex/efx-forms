import { test, expect } from '@playwright/experimental-ct-react';

import { FieldUpdate } from './FieldUpdate';
import { sel } from './selectors';

test('Field update should behave correctly', async ({ mount }) => {
  const data = {
    config: {},
    configs: {},
  };
  const component = await mount(
    <FieldUpdate
      formConfig={{
        name: 'formFieldUpdate',
        initialValues: {
          'user.name': 'Initial User',
        },
      }}
      fieldConfig={{}}
      setConfig={({ config, configs }) => {
        data.config = config;
        data.configs = configs;
      }}
    />
  );

  const userName = component.locator(sel.userName);
  const reset = component.locator(sel.reset);
  const config = component.locator(sel.config);

  const values = component.locator(sel.values);
  const touches = component.locator(sel.touches);

  await expect(userName).toHaveValue('Initial User');
  await expect(values).toContainText(`
    "user.name": "Initial User"
  `);
  await expect(touches).toContainText('{}');
  await config.click();
  expect(data.configs['user.name']).toEqual({
    name: 'user.name',
  });

  await component.update(
    <FieldUpdate
      formConfig={{
        name: 'formFieldUpdate',
        initialValues: {
          'user.name': 'Initial User',
        },
      }}
      fieldConfig={{
        initialValue: 'Field User',
        validateOnBlur: false,
        validateOnChange: true,
        validators: [],
      }}
      setConfig={({ config, configs }) => {
        data.config = config;
        data.configs = configs;
      }}
    />
  );

  await expect(userName).toHaveValue('Field User');
  await expect(values).toContainText(`
    "user.name": "Field User"
  `);
  await expect(touches).toContainText('{}');
  await config.click();
  expect(data.configs['user.name']).toEqual({
    name: 'user.name',
    initialValue: 'Field User',
    validateOnBlur: false,
    validateOnChange: true,
    validators: [],
  });
});
