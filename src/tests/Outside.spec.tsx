import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';

import { Outside } from './Outside';
import { sel } from './selectors';

test('Field Outside Form', async ({ mount }) => {
  const data = {
    submit: {},
  };
  const component = await mount(
    <Outside onSubmit={(values: any) => { data.submit = values; }} />
  );
  const userName = component.locator(sel.userName);
  const userPassword = component.locator(sel.userPassword);
  const submit = component.locator(sel.submit);
  const reset = component.locator(sel.reset);

  const values = component.locator(sel.values);
  const active = component.locator(sel.active);

  // Check initial values
  await expect(values).toContainText('{}');
  await expect(active).toContainText(`
    "user.name": true,
    "user.password": true
  `);

  // edit fields
  await userName.fill('Test User');
  await userPassword.fill('pass');

  await expect(active).toContainText(`
    "user.name": true,
    "user.password": true
  `);

  await expect(values).toContainText(`
    "user.name": "Test User",
    "user.password": "pass"
  `);


  // submit
  await submit.click();
  expect(data.submit).toEqual({
    'user.name': 'Test User',
    'user.password': 'pass',
  });

  // reset
  await reset.click();
  await expect(active).toContainText(`
    "user.name": true,
    "user.password": true
  `);

  await expect(values).toContainText(`
    "user.name": "undefined",
    "user.password": "undefined"
  `);
});
