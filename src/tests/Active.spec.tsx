import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';

import { Active } from './Active';
import { sel } from './selectors';
import type { OnSendParams } from './components/Hooks';

test('Active Fields', async ({ mount }) => {
  const data = {
    config: {},
    configs: {},
    form: {},
  } as OnSendParams;

  const component = await mount(
    <Active validateOnChange setFormData={(formData) => Object.assign(data, formData)} />
  );
  const userEmail = component.locator(sel.userEmail);
  const userHasEmail = component.locator(sel.userHasEmail);

  const submit = component.locator(sel.submit);
  const sendData = component.locator(sel.sendData);

  await sendData.click();

  // all fields should be active
  expect(data.form.active).toEqual({
    'user.name': true,
    'user.hasEmail': true,
    'user.password': true,
    'user.email': true,
  });
  // only fields with value should be in the values store
  expect(data.form.values).toEqual({
    'user.name': 'Initial User',
    'user.hasEmail': true,
  });
  // only active fields with value should be in the values store
  expect(data.form.activeValues).toEqual({
    'user.name': 'Initial User',
    'user.hasEmail': true,
  });

  // change email
  await userEmail.fill('test@email');
  await sendData.click();
  // email should appear in the values store
  expect(data.form.values).toEqual({
    'user.name': 'Initial User',
    'user.hasEmail': true,
    'user.email': 'test@email',
  });
  // email should appear in the activeValues store
  expect(data.form.activeValues).toEqual({
    'user.name': 'Initial User',
    'user.hasEmail': true,
    'user.password': undefined,
    'user.email': 'test@email',
  });
  expect(data.form.error).toEqual({
    'user.email': 'Must be a valid email',
  });

  // hide email
  await userHasEmail.click();
  await sendData.click();
  await expect(userEmail).not.toBeAttached();
  // email should be not active
  expect(data.form.active).toEqual({
    'user.name': true,
    'user.hasEmail': true,
    'user.password': true,
    'user.email': false,
  });
  // email value should be in the values store
  expect(data.form.values).toEqual({
    'user.name': 'Initial User',
    'user.hasEmail': false,
    'user.email': 'test@email',
  });
  // email value should not be in the activeValues store
  expect(data.form.activeValues).toEqual({
    'user.name': 'Initial User',
    'user.hasEmail': false,
  });
  expect(data.form.touches).toEqual({
    'user.email': false,
    'user.hasEmail': true,
  });
  // email error should be reset on field deactivation
  expect(data.form.error).toEqual({});

  // submit to check validation errors
  await submit.click();
  await sendData.click();
  // email should not be in the list as its inactive
  expect(data.form.error).toEqual({
    'user.password': 'This field is required',
  });
});
