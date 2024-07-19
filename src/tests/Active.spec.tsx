import { test, expect } from '@playwright/experimental-ct-react';

import { Active } from './Active';
import { sel } from './selectors';

test('Active fields logic should work', async ({ mount }) => {
  const component = await mount(<Active validateOnChange />);
  const userEmail = component.locator(sel.userEmail);
  const userHasEmail = component.locator(sel.userHasEmail);

  const values = component.locator(sel.values);
  const active = component.locator(sel.active);
  const activeValues = component.locator(sel.activeValues);

  // all fields should be active
  await expect(active).toContainText(`
    "user.name": true,
    "user.hasEmail": true,
    "user.password": true,
    "user.email": true
  `);
  // only fields with value should be in the values store
  await expect(values).toContainText(`
    "user.name": "Initial User",
    "user.hasEmail": true
  `);
  // only active fields with value should be in the values store
  await expect(activeValues).toContainText(`
    "user.name": "Initial User",
    "user.hasEmail": true
  `);
  // change email
  await userEmail.fill('test@email');
  // email should appear in the values store
  await expect(values).toContainText(`
    "user.name": "Initial User",
    "user.hasEmail": true,
    "user.email": "test@email"
  `);
  // email should appear in the activeValues store
  await expect(activeValues).toContainText(`
    "user.name": "Initial User",
    "user.hasEmail": true,
    "user.email": "test@email"
  `);

  // hide email
  await userHasEmail.click();
  await expect(userEmail).not.toBeAttached();
  // email should be not active
  await expect(active).toContainText(`
    "user.name": true,
    "user.hasEmail": true,
    "user.password": true,
    "user.email": false
  `);
  // email value should be in the values store
  await expect(values).toContainText(`
    "user.name": "Initial User",
    "user.hasEmail": false,
    "user.email": "test@email"
  `);
  // email value should not be in the activeValues store
  await expect(activeValues).toContainText(`
    "user.name": "Initial User",
    "user.hasEmail": false
  `);
});