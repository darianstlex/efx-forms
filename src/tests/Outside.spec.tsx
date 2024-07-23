import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';

import { Outside } from './Outside';
import { sel } from './selectors';
import type { OnSendParams } from './components/Hooks';

test('Field Outside Form', async ({ mount }) => {
  const data = {
    config: {},
    configs: {},
    form: {},
    submit: {},
  } as OnSendParams & { submit: Record<string, any> };

  /**
   * STEP_1: Render component with fields inside and outside the form
   */
  const component = await mount(
    <Outside
      onSubmit={(values: any) => {
        data.submit = values;
      }}
      setFormData={(formData) => Object.assign(data, formData)}
    />,
  );
  const userName = component.locator(sel.userName);
  const userPassword = component.locator(sel.userPassword);
  const submit = component.locator(sel.submit);
  const reset = component.locator(sel.reset);
  const sendData = component.locator(sel.sendData);

  /**
   * Expect all the data to be correct
   */
  await sendData.click();

  // Check initial values
  expect(data.form.values).toEqual({});
  expect(data.form.active).toEqual({
    'user.name': true,
    'user.password': true,
  });

  /**
   * STEP_2: Edit fields inside and outside the form
   */
  // edit fields
  await userName.fill('Test User');
  await userPassword.fill('pass');

  /**
   * Expect form data to be correct
   */
  await sendData.click();

  expect(data.form.active).toEqual({
    'user.name': true,
    'user.password': true,
  });

  expect(data.form.values).toEqual({
    'user.name': 'Test User',
    'user.password': 'pass',
  });

  /**
   * STEP_3: Submit form and check submitted values
   */
  // submit
  await submit.click();
  expect(data.submit).toEqual({
    'user.name': 'Test User',
    'user.password': 'pass',
  });

  /**
   * STEP_4: Reset form and check form values
   */
  // reset
  await reset.click();
  await sendData.click();

  expect(data.form.active).toEqual({
    'user.name': true,
    'user.password': true,
  });

  expect(data.form.values).toEqual({
    'user.name': undefined,
    'user.password': undefined,
  });
});
