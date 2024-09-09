import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';

import { Update } from './Update';
import { sel } from './selectors';
import type { OnSendParams } from './components/Hooks';

test('Form Update', async ({ mount }) => {
  const data = {
    config: {},
    configs: {},
    form: {},
  } as OnSendParams;

  /**
   * STEP_1: Render form with initial values
   */
  const component = await mount(
    <Update
      initialValues={{
        'user.name': 'Initial User',
        'user.password': 'pass1',
      }}
      setFormData={(formData) => Object.assign(data, formData)}
    />,
  );

  const userName = component.locator(sel.userName);
  const userNameError = component.locator(sel.userNameError);
  const userPassword = component.locator(sel.userPassword);
  const submit = component.locator(sel.submit);
  const reset = component.locator(sel.reset);
  const sendData = component.locator(sel.sendData);

  /**
   * Check initial values / data
   */
  // send test data
  await sendData.click();
  // check form config
  expect(data.config).toEqual({
    disableFieldsReinit: false,
    initialValues: {
      'user.name': 'Initial User',
      'user.password': 'pass1',
    },
    keepOnUnmount: false,
    name: 'formUpdate',
    onSubmit: undefined,
    serialize: false,
    skipClientValidation: false,
    validateOnBlur: true,
    validateOnChange: false,
    validators: {},
  });
  // check field config
  expect(data.configs['user.name']).toEqual({
    name: 'user.name',
    validateOnChange: true,
    validators: [null],
  });

  expect(data.form.touches).toEqual({});

  // check initial values
  expect(data.form.values).toEqual({
    'user.name': 'Initial User',
    'user.password': 'pass1',
  });

  /**
   * STEP_2: Update form initial values
   */
  // update form props
  await component.update(
    <Update
      keepOnUnmount
      skipClientValidation
      initialValues={{
        'user.name': 'Second User',
        'user.password': 'pass2',
      }}
      setFormData={(formData) => Object.assign(data, formData)}
      validateOnBlur={false}
      validateOnChange={true}
    />,
  );

  /**
   * Check updated values
   */
  // send form data
  await sendData.click();
  // check form config
  expect(data.config).toEqual({
    disableFieldsReinit: false,
    initialValues: {
      'user.name': 'Second User',
      'user.password': 'pass2',
    },
    keepOnUnmount: true,
    name: 'formUpdate',
    onSubmit: undefined,
    serialize: false,
    skipClientValidation: true,
    validateOnBlur: false,
    validateOnChange: true,
    validators: {},
  });
  // check field config
  expect(data.configs['user.name']).toEqual({
    name: 'user.name',
    validateOnChange: false,
    validators: [null],
  });

  expect(data.form.touches).toEqual({});

  // check updated values
  expect(data.form.values).toEqual({
    'user.name': 'Second User',
    'user.password': 'pass2',
  });

  /**
   * STEP_3: Update fields data and form initial values
   */
  // edit fields
  await userName.fill('Edit User');
  await userPassword.fill('editPass');

  // update form props
  await component.update(
    <Update
      initialValues={{
        'user.name': 'Third User',
        'user.password': 'pass3',
      }}
      setFormData={(formData) => Object.assign(data, formData)}
    />,
  );

  await sendData.click();

  /**
   * Check if config has been updated and touched field values
   * should not be reset
   */
  expect(data.config).toEqual({
    disableFieldsReinit: false,
    initialValues: {
      'user.name': 'Third User',
      'user.password': 'pass3',
    },
    keepOnUnmount: false,
    name: 'formUpdate',
    onSubmit: undefined,
    serialize: false,
    skipClientValidation: false,
    validateOnBlur: true,
    validateOnChange: false,
    validators: {},
  });

  // check field config
  expect(data.configs['user.name']).toEqual({
    name: 'user.name',
    validateOnChange: true,
    validators: [null],
  });

  expect(data.form.touches).toEqual({
    'user.name': true,
    'user.password': true,
  });

  // values should not change as fields are touched
  expect(data.form.values).toEqual({
    'user.name': 'Edit User',
    'user.password': 'editPass',
  });

  /**
   * STEP_4: Reset form data
   */
  await reset.click();
  await sendData.click();

  /**
   * Check if values has been reset correctly
   */
  // values should reset to tha latest updated initial values
  expect(data.form.values).toEqual({
    'user.name': 'Third User',
    'user.password': 'pass3',
  });

  expect(data.form.touches).toEqual({});

  await submit.click();
  await sendData.click();
  await expect(userNameError).toContainText('This user is taken');

  expect(data.form.error).toEqual({
    'user.name': 'This user is taken',
    'user.password': null,
  });
});
