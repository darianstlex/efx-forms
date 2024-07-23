import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';

import { SampleUpdate } from './SampleUpdate';
import { sel } from './selectors';
import type { OnSendParams } from './components/Hooks';

test('Sample Update', async ({ mount }) => {
  const data = {
    config: {},
    configs: {},
    form: {},
  } as OnSendParams;

  /**
   * STEP_1: Render form
   */
  const component = await mount(
    <SampleUpdate setFormData={(formData) => Object.assign(data, formData)} />
  );
  const one = component.locator(sel.one);
  const two = component.locator(sel.two);
  const three = component.locator(sel.three);
  const sendData = component.locator(sel.sendData);

  /**
   * Check if values are correct after initial render
   */
  await expect(one).toHaveValue('0');
  await expect(two).toHaveValue('0');
  await expect(three).toHaveValue('0');

  /**
   * STEP_2: Change field One and
   * expect other fields to be calculated based on the sample
   */
  await one.fill('10');
  await expect(one).toHaveValue('10');
  await expect(two).toHaveValue('20');
  await expect(three).toHaveValue('0');

  /**
   * STEP_3: Change field Two and
   * expect other fields to be calculated based on the sample
   */
  await two.fill('5');
  await expect(one).toHaveValue('10');
  await expect(two).toHaveValue('5');
  await expect(three).toHaveValue('15');

  /**
   * STEP_4: Change field Three and
   * expect other fields to be calculated based on the sample
   */
  await three.fill('60');
  await expect(one).toHaveValue('20');
  await expect(two).toHaveValue('5');
  await expect(three).toHaveValue('60');

  await sendData.click();

  /**
   * Check final values
   */
  expect(data.form.values).toEqual({
    'two': 5,
    'three': 60,
    'one': 20,
  });
});
