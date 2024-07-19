import { test, expect } from '@playwright/experimental-ct-react';

import { SampleUpdate } from './SampleUpdate';
import { sel } from './selectors';

test('Sample logic should work', async ({ mount }) => {
  const data = {
    submit: {},
  };
  const component = await mount(<SampleUpdate />);
  const one = component.locator(sel.one);
  const two = component.locator(sel.two);
  const three = component.locator(sel.three);
  const values = component.locator(sel.values);


  await one.fill('10');
  await expect(one).toHaveValue('10');
  await expect(two).toHaveValue('20');
  await expect(three).toHaveValue('');

  await two.fill('5');
  await expect(one).toHaveValue('10');
  await expect(two).toHaveValue('5');
  await expect(three).toHaveValue('15');

  await three.fill('60');
  await expect(one).toHaveValue('20');
  await expect(two).toHaveValue('5');
  await expect(three).toHaveValue('60');

  await expect(values).toContainText(`
    "one": 20,
    "two": 5,
    "three": 60
  `);
});
