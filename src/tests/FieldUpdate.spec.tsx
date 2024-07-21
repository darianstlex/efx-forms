import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';

import { FieldUpdate } from './FieldUpdate';
import { sel } from './selectors';

test('Field Update', async ({ mount }) => {
  const data = {
    config: {},
    configs: {},
  };
  const component = await mount(
    <FieldUpdate
      fieldConfig={{
        initialValue: 'Initial User',
      }}
      setConfig={({ config, configs }) => {
        data.config = config;
        data.configs = configs;
      }}
    />
  );

  const userName = component.locator(sel.userName);
  const config = component.locator(sel.config);

  const values = component.locator(sel.values);
  const touches = component.locator(sel.touches);

  // initial values should be ok
  await expect(userName).toHaveValue('Initial User');
  await expect(values).toContainText(`
    "user.name": "Initial User"
  `);
  await expect(touches).toContainText('{}');
  await config.click();
  expect(data.configs['user.name']).toEqual({
    initialValue: 'Initial User',
    name: 'user.name',
  });

  await component.update(
    <FieldUpdate
      fieldConfig={{
        initialValue: 'First User',
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

  // values should change after update
  await expect(userName).toHaveValue('First User');
  await expect(values).toContainText(`
    "user.name": "First User"
  `);
  await expect(touches).toContainText('{}');
  await config.click();
  expect(data.configs['user.name']).toEqual({
    name: 'user.name',
    initialValue: 'First User',
    validateOnBlur: false,
    validateOnChange: true,
    validators: [],
  });

  await userName.fill('Edit User');
  await component.update(
    <FieldUpdate
      fieldConfig={{
        initialValue: 'Second User',
      }}
      setConfig={({ config, configs }) => {
        data.config = config;
        data.configs = configs;
      }}
    />
  );

  // values should not change if field is touched
  await expect(touches).toContainText(`
    "user.name": true
  `);
  await config.click();
  expect(data.configs['user.name']).toEqual({
    name: 'user.name',
    initialValue: 'Second User',
  });
  await expect(userName).toHaveValue('Edit User');
  await expect(values).toContainText(`
    "user.name": "Edit User"
  `);
});
