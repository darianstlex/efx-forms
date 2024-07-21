import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';

import { DirtyTouchErrors } from './DirtyTouchErrors';
import { sel } from './selectors';

test('Dirty/Touch/Errors', async ({ mount }) => {
  const data = {
    submit: {},
  };
  const component = await mount(
    <DirtyTouchErrors
      onSubmit={(values) => { data.submit = values; }}
      initialValues={{ 'user.email': 'initial@email' }}
    />
  );
  const userName = component.locator(sel.userName);
  const userNameError = component.locator(sel.userNameError);
  const userEmail = component.locator(sel.userEmail);
  const userEmailError = component.locator(sel.userEmailError);
  const userPassword = component.locator(sel.userPassword);
  const userPasswordError = component.locator(sel.userPasswordError);
  const submit = component.locator(sel.submit);
  const reset = component.locator(sel.reset);

  const isTouched = component.locator(sel.isTouched);
  const touches = component.locator(sel.touches);
  const isDirty = component.locator(sel.isDirty);
  const dirties = component.locator(sel.dirties);
  const error = component.locator(sel.error);
  const errors = component.locator(sel.errors);
  const activeValues = component.locator(sel.activeValues);

  // Check initial values
  await expect(userName).toHaveValue('Initial User');
  await expect(userEmail).toHaveValue('initial@email');
  await expect(isTouched).toContainText('false');
  await expect(isDirty).toContainText('false');
  await expect(touches).toContainText('{}');
  await expect(dirties).toContainText('{}');
  await expect(error).toContainText('{}');
  await expect(errors).toContainText('{}');

  // clear user.name
  await userName.clear();
  await expect(isTouched).toContainText('true');
  await expect(isDirty).toContainText('true');
  // user.name field should appear in touches store
  await expect(touches).toContainText('"user.name": true');
  // user.email should not appear, as it wasn't changed
  await expect(touches).not.toContainText('"user.email"');
  // user.name field should appear in touches store
  await expect(dirties).toContainText('"user.name": true');
  // user.email should not appear, as it wasn't changed
  await expect(dirties).not.toContainText('"user.email"');
  await expect(userNameError).not.toBeAttached();
  // trigger blur on user.name to trigger validation
  await userName.blur();
  // user.name field error should appear
  await expect(userNameError).toContainText('Must have');
  // user.name error should appear in the error store
  await expect(error).toContainText('"user.name": "Must have"');
  // user.name error should appear in the errors store
  await expect(errors).toContainText(`
    "user.name": [
      "Must have"
    ]
  `);
  await expect(userEmailError).not.toBeAttached();
  // change user.name value
  await userName.fill('Initial User');
  await userName.blur(); // trigger validation
  await expect(userNameError).not.toBeAttached();
  await expect(error).not.toContainText('"user.name"');
  await expect(error).not.toContainText('"user.password"');
  await expect(dirties).not.toContainText('"user.name"');
  await expect(touches).toContainText('"user.name": true');

  // user.email
  await userEmail.clear();
  await expect(isTouched).toContainText('true');
  await expect(isDirty).toContainText('true');
  await expect(touches).toContainText('"user.name": true');
  await expect(touches).toContainText('"user.email": true');
  await expect(dirties).not.toContainText('"user.name": true');
  await expect(dirties).toContainText('"user.email": true');
  await expect(userEmailError).toContainText('This field is required');
  await expect(error).toContainText('"user.email": "This field is required"');
  await expect(errors).toContainText(`
    "user.email": [
      "This field is required",
      "Must be a valid email"
    ]
  `);
  await userEmail.fill('test@email');
  await expect(error).not.toContainText('"user.name"');
  await expect(error).not.toContainText('"user.password"');
  await expect(userEmailError).toContainText('Must be a valid email');
  await expect(error).toContainText('"user.email": "Must be a valid email"');
  await userEmail.fill('test@email.com');
  await expect(userEmailError).not.toBeAttached();

  // password
  await submit.click();
  await expect(userNameError).not.toBeAttached();
  await expect(userEmailError).not.toBeAttached();
  await expect(userPasswordError).toContainText('Required!');
  await expect(error).toContainText('"user.password": "Required!"');
  await expect(errors).toContainText(`
    "user.password": [
      "Required!"
    ]
  `);
  await userPassword.fill('pass');
  expect(data.submit).toEqual({});

  // submit
  await submit.click();
  expect(data.submit).toEqual({
    'user.email': 'test@email.com',
    'user.name': 'Initial User',
    'user.password': 'pass',
  });

  // form reset
  await reset.click();
  await expect(userName).toHaveValue('Initial User');
  await expect(userNameError).not.toBeAttached();
  await expect(userEmailError).not.toBeAttached();
  await expect(userPasswordError).not.toBeAttached();
  await expect(isTouched).toContainText('false');
  await expect(isDirty).toContainText('false');
  await expect(touches).toContainText('{}');
  await expect(dirties).toContainText('{}');
  await expect(error).toContainText('{}');
  await expect(errors).toContainText('{}');
  await expect(activeValues).toContainText(`
    "user.name": "Initial User",
    "user.email": "initial@email",
    "user.password": "null"
  `);
});
