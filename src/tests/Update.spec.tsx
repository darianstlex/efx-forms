import { test, expect } from '@playwright/experimental-ct-react';

import { Update } from './Update';
import { sel } from './selectors';

test('Form update should update data correctly', async ({ mount }) => {
  const data = {
    config: {},
    configs: {},
  };
  const component = await mount(
    <Update
      initialValues={{
        'user.name': 'Initial User',
        'user.password': 'pass1',
      }}
      setConfig={({ config, configs }) => {
        data.config = config;
        data.configs = configs;
      }}
    />
  );

  const userName = component.locator(sel.userName);
  const userNameError = component.locator(sel.userNameError);
  const userPassword = component.locator(sel.userPassword);
  const submit = component.locator(sel.submit);
  const reset = component.locator(sel.reset);
  const config = component.locator(sel.config);

  const values = component.locator(sel.values);

  // Check initial values
  await expect(values).toContainText(`
    "user.name": "Initial User",
    "user.password": "pass1"
  `);

  await config.click();
  expect(data.config).toEqual({
    initialValues: {
      'user.name': 'Initial User',
      'user.password': 'pass1',
    },
    keepOnUnmount: false,
    name: 'formUpdate',
    onSubmit: undefined,
    skipClientValidation: false,
    validateOnBlur: true,
    validateOnChange: false,
    validators: {},
  });
  expect(data.configs['user.name']).toEqual({
    format: undefined,
    initialValue: undefined,
    name: 'user.name',
    parse: undefined,
    validateOnBlur: true,
    validateOnChange: true,
    validators: [null],
  });

  await component.update(
    <Update
      keepOnUnmount
      skipClientValidation
      initialValues={{
        'user.name': 'Second User',
        'user.password': 'pass2',
      }}
      setConfig={({ config, configs }) => {
        data.config = config;
        data.configs = configs;
      }}
      validateOnBlur={false}
      validateOnChange={true}
    />
  );

  // Check updated values
  await expect(values).toContainText(`
    "user.name": "Second User",
    "user.password": "pass2"
  `);

  await config.click();
  expect(data.config).toEqual({
    initialValues: {
      'user.name': 'Second User',
      'user.password': 'pass2',
    },
    keepOnUnmount: true,
    name: 'formUpdate',
    onSubmit: undefined,
    skipClientValidation: true,
    validateOnBlur: false,
    validateOnChange: true,
    validators: {},
  });
  expect(data.configs['user.name']).toEqual({
    format: undefined,
    initialValue: undefined,
    name: 'user.name',
    parse: undefined,
    validateOnBlur: true,
    validateOnChange: false,
    validators: [null],
  });

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
      setConfig={({ config, configs }) => {
        data.config = config;
        data.configs = configs;
      }}
    />
  );

  await config.click();
  expect(data.config).toEqual({
    initialValues: {
      'user.name': 'Second User',
      'user.password': 'pass2',
    },
    keepOnUnmount: false,
    name: 'formUpdate',
    onSubmit: undefined,
    skipClientValidation: false,
    validateOnBlur: true,
    validateOnChange: false,
    validators: {},
  });

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
