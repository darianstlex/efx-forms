import { test, expect } from '@playwright/experimental-ct-react';

import { Update } from './Update';
import { sel } from './selectors';

test('Form update should update data correctly', async ({ mount }) => {
  const component = await mount(
    <Update
      initialValues={{
        'user.name': 'Initial User',
        'user.password': 'pass1',
      }}
    />
  );

  const userName = component.locator(sel.userName);
  const userNameError = component.locator(sel.userNameError);
  const userPassword = component.locator(sel.userPassword);
  const submit = component.locator(sel.submit);
  const reset = component.locator(sel.reset);

  const values = component.locator(sel.values);

  // Check initial values
  await expect(values).toContainText(`
    "user.name": "Initial User",
    "user.password": "pass1"
  `);

  await component.update(
    <Update
      initialValues={{
        'user.name': 'Second User',
        'user.password': 'pass2',
      }}
    />
  );

  // Check updated values
  await expect(values).toContainText(`
    "user.name": "Second User",
    "user.password": "pass2"
  `);

  // edit fields
  await userName.fill('Edit User');
  await userPassword.fill('editPass');

  // update form props
  await component.update(
    <Update
      initialValues={{
        'user.name': 'Second User',
        'user.password': 'pass2',
      }}
    />
  );

  // values should not change as fields are touched
  await expect(values).toContainText(`
    "user.name": "Edit User",
    "user.password": "editPass"
  `);

  await reset.click();
  // values should reset to tha latest updated initial values
  await expect(values).toContainText(`
    "user.name": "Second User",
    "user.password": "pass2"
  `);

  await submit.click();
  await expect(userNameError).toContainText('This user is taken');
});
