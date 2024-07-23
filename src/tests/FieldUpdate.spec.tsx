import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';

import { FieldUpdate } from './FieldUpdate';
import { sel } from './selectors';
import type { OnSendParams } from './components/Hooks';

test('Field Update', async ({ mount }) => {
  const data = {
    config: {},
    configs: {},
    form: {},
  } as OnSendParams;

  /**
   * STEP_1: Render form
   */
  const component = await mount(
    <FieldUpdate
      fieldConfig={{
        initialValue: 'Initial User',
      }}
      setFormData={(formData) => Object.assign(data, formData)}
    />,
  );

  const userName = component.locator(sel.userName);
  const sendData = component.locator(sel.sendData);

  /**
   * Check if form data is correct
   */
  await sendData.click();

  // initial values should be ok
  await expect(userName).toHaveValue('Initial User');
  expect(data.form.values).toEqual({
    'user.name': 'Initial User',
  });
  expect(data.form.touches).toEqual({});
  expect(data.configs['user.name']).toEqual({
    initialValue: 'Initial User',
    name: 'user.name',
  });

  /**
   * STEP_2: Update form config
   */
  await component.update(
    <FieldUpdate
      fieldConfig={{
        initialValue: 'First User',
        validateOnBlur: false,
        validateOnChange: true,
        validators: [],
      }}
      setFormData={(formData) => Object.assign(data, formData)}
    />,
  );
  await sendData.click();

  /**
   * Check if form config has been updated
   */
  // values should change after update
  await expect(userName).toHaveValue('First User');
  expect(data.form.values).toEqual({
    'user.name': 'First User',
  });
  expect(data.form.touches).toEqual({});
  expect(data.configs['user.name']).toEqual({
    name: 'user.name',
    initialValue: 'First User',
    validateOnBlur: false,
    validateOnChange: true,
    validators: [],
  });

  /**
   * STEP_2: Update field value and config
   */
  await userName.fill('Edit User');
  await component.update(
    <FieldUpdate
      fieldConfig={{
        initialValue: 'Second User',
      }}
      setFormData={(formData) => Object.assign(data, formData)}
    />,
  );
  await sendData.click();

  /**
   * Check if field config/value are updated correctly
   */
  // values should not change if field is touched
  expect(data.form.touches).toEqual({
    'user.name': true,
  });
  expect(data.configs['user.name']).toEqual({
    name: 'user.name',
    initialValue: 'Second User',
  });
  await expect(userName).toHaveValue('Edit User');
  expect(data.form.values).toEqual({
    'user.name': 'Edit User',
  });
});
