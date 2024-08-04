import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';

import { FormValidation, FieldOverrideValidation, FormValidationUpdate } from './Validation';
import { sel } from './selectors';
import type { OnSendParams } from './components/Hooks';

test.describe('Validation', () => {
  test('Form Validation', async ({ mount }) => {
    const data = {
      config: {},
      configs: {},
      form: {},
      submit: {},
    } as OnSendParams & { submit: Record<string, any> };

    const component = await mount(
      <FormValidation
        onSubmit={(values: any) => {
          data.submit = values;
        }}
        setFormData={(formData) => Object.assign(data, formData)}
      />,
    );

    const userNameError = component.locator(sel.userNameError);
    const userPasswordError = component.locator(sel.userPasswordError);

    const submit = component.locator(sel.submit);
    const reset = component.locator(sel.reset);
    const sendData = component.locator(sel.sendData);

    await submit.click();
    await sendData.click();

    await expect(userNameError).toContainText('This field is required');
    await expect(userPasswordError.nth(0)).toContainText('This field is required');
    await expect(userPasswordError.nth(1)).toContainText('This field is required');

    // Check submitted values
    expect(data.submit).toEqual({});
    expect(data.config.validators).toEqual({
      'user.name': [null],
      'user.password': [null],
    });

    await reset.click();

    await expect(userNameError).not.toBeAttached();
    await expect(userPasswordError.nth(0)).not.toBeAttached();
    await expect(userPasswordError.nth(1)).not.toBeAttached();
  });

  test('Field Override Validation', async ({ mount }) => {
    const data = {
      config: {},
      configs: {},
      form: {},
      submit: {},
    } as OnSendParams & { submit: Record<string, any> };

    const component = await mount(
      <FieldOverrideValidation
        onSubmit={(values: any) => {
          data.submit = values;
        }}
        setFormData={(formData) => Object.assign(data, formData)}
      />,
    );
    const userName = component.locator(sel.userName);
    const userNameError = component.locator(sel.userNameError);
    const userPassword = component.locator(sel.userPassword);
    const userPasswordOutside = component.locator(sel.userPasswordOutside);
    const userPasswordError = component.locator(sel.userPasswordError);

    const submit = component.locator(sel.submit);
    const reset = component.locator(sel.reset);
    const sendData = component.locator(sel.sendData);

    await submit.click();
    await sendData.click();

    await expect(userNameError).toContainText('Must have');
    await expect(userPasswordError.nth(0)).toContainText('No way');
    await expect(userPasswordError.nth(1)).toContainText('No way');

    // Check submitted values
    expect(data.submit).toEqual({});
    expect(data.config.validators).toEqual({
      'user.name': [null],
      'user.password': [null],
    });

    await userName.fill('Super User');
    await userPassword.fill('pass2');

    await expect(userNameError).not.toBeAttached();
    await expect(userPasswordError.nth(0)).not.toBeAttached();
    await expect(userPasswordError.nth(1)).not.toBeAttached();

    await submit.click();

    expect(data.submit).toEqual({
      'user.name': 'Super User',
      'user.password': 'pass2',
    });
  });

  test('Form Update Validation', async ({ mount }) => {
    const data = {
      config: {},
      configs: {},
      form: {},
      submit: {},
    } as OnSendParams & { submit: Record<string, any> };

    const component = await mount(
      <FormValidationUpdate
        onSubmit={(values: any) => {
          data.submit = values;
        }}
      />,
    );
    const userName = component.locator(sel.userName);
    const userNameError = component.locator(sel.userNameError);

    const submit = component.locator(sel.submit);
    const action = component.locator(sel.action);

    await submit.click();

    await expect(userNameError).toContainText('Required');

    await action.click({ clickCount: 3 });
    await submit.click();

    await expect(userNameError).toContainText('Required111');
  });
});
