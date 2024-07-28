import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';

import { DirtyTouchErrors } from './DirtyTouchErrors';
import { sel } from './selectors';
import type { OnSendParams } from './components/Hooks';

test('Dirty/Touch/Errors', async ({ mount }) => {
  const data = {
    config: {},
    configs: {},
    form: {},
    submit: {},
  } as OnSendParams & { submit: Record<string, any> };
  const component = await mount(
    <DirtyTouchErrors
      onSubmit={(values) => {
        data.submit = values;
      }}
      setFormData={(formData) => Object.assign(data, formData)}
      initialValues={{ 'user.email': 'initial@email' }}
    />,
  );
  const userName = component.locator(sel.userName);
  const userNameError = component.locator(sel.userNameError);
  const userEmail = component.locator(sel.userEmail);
  const userEmailError = component.locator(sel.userEmailError);
  const userPassword = component.locator(sel.userPassword);
  const userPasswordError = component.locator(sel.userPasswordError);
  const submit = component.locator(sel.submit);
  const reset = component.locator(sel.reset);
  const sendData = component.locator(sel.sendData);

  await sendData.click();

  // Check initial values
  await expect(userName).toHaveValue('Initial User');
  await expect(userEmail).toHaveValue('initial@email');
  expect(data.form.touched).toBe(false);
  expect(data.form.dirty).toBe(false);
  expect(data.form.touches).toEqual({});
  expect(data.form.dirties).toEqual({});
  expect(data.form.error).toEqual({});
  expect(data.form.errors).toEqual({});

  // clear user.name
  await userName.fill('test');
  await sendData.click();

  await expect(userName).toHaveValue('test');
  expect(data.form.touched).toBe(true);
  expect(data.form.dirty).toBe(true);
  // user.name field should appear in touches store
  expect(data.form.touches).toEqual({
    'user.name': true,
  });
  // user.name field should appear in touches store
  expect(data.form.dirties).toEqual({
    'user.name': true,
  });
  await expect(userNameError).not.toBeAttached();
  // clear and trigger blur on user.name to trigger validation
  await userName.clear();
  await userName.blur();
  await sendData.click();
  // user.name field error should appear
  await expect(userNameError).toContainText('Must have');
  // user.name error should appear in the error store
  expect(data.form.error).toEqual({
    'user.name': 'Must have',
  });
  expect(data.form.errors).toEqual({
    'user.name': [
      'Must have',
    ],
  });
  await expect(userEmailError).not.toBeAttached();

  // change user.name value
  await userName.fill('Initial User');
  await userName.blur(); // trigger validation
  await sendData.click();

  await expect(userNameError).not.toBeAttached();
  expect(data.form.error).toEqual({
    'user.name': null,
  });
  expect(data.form.dirties).toEqual({});
  expect(data.form.touches).toEqual({
    'user.name': true,
  });

  // user.email
  await userEmail.clear();
  await sendData.click();

  expect(data.form.touched).toBe(true);
  expect(data.form.dirty).toBe(true);

  expect(data.form.touches).toEqual({
    'user.name': true,
    'user.email': true,
  });
  expect(data.form.dirties).toEqual({
    'user.email': true,
  });

  await expect(userEmailError).toContainText('This field is required');

  expect(data.form.error).toEqual({
    'user.email': 'This field is required',
    'user.name': null,
  });
  expect(data.form.errors).toEqual({
    'user.email': [
      'This field is required',
      'Must be a valid email',
    ],
    'user.name': null,
  });

  await userEmail.fill('test@email');
  await sendData.click();

  expect(data.form.error).toEqual({
    'user.email': 'Must be a valid email',
    'user.name': null,
  });

  await userEmail.fill('test@email.com');
  await sendData.click();

  await expect(userEmailError).not.toBeAttached();
  expect(data.form.error).toEqual({
    'user.email': null,
    'user.name': null,
  });

  // password
  await submit.click();
  await sendData.click();

  await expect(userNameError).not.toBeAttached();
  await expect(userEmailError).not.toBeAttached();
  await expect(userPasswordError).toContainText('Required!');

  expect(data.form.error).toEqual({
    'user.email': null,
    'user.name': null,
    'user.password': 'Required!',
  });
  expect(data.form.errors).toEqual({
    'user.email': null,
    'user.name': null,
    'user.password': [
      'Required!',
    ],
  });

  await userPassword.fill('pass');
  expect(data.submit).toEqual({});

  // submit
  await submit.click();
  await sendData.click();
  expect(data.submit).toEqual({
    'user.email': 'test@email.com',
    'user.name': 'Initial User',
    'user.password': 'pass',
  });

  expect(data.form.touched).toBe(false);

  // form reset
  await reset.click();
  await sendData.click();

  await expect(userName).toHaveValue('Initial User');
  await expect(userNameError).not.toBeAttached();
  await expect(userEmailError).not.toBeAttached();
  await expect(userPasswordError).not.toBeAttached();
  expect(data.form.touched).toBe(false);
  expect(data.form.dirty).toBe(false);
  expect(data.form.touches).toEqual({});
  expect(data.form.dirties).toEqual({});
  expect(data.form.error).toEqual({});
  expect(data.form.errors).toEqual({});
  expect(data.form.activeValues).toEqual({
    'user.name': 'Initial User',
    'user.email': 'initial@email',
    'user.password': null,
  });
});
