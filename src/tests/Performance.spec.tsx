import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';

import { Performance1000Fields } from './Performance1000Fields';
import { sel } from './selectors';

test.describe('Performance', () => {
  test('should render 1000 fields within performance budget', async ({ mount }) => {
    const startTime = Date.now();
    
    const component = await mount(<Performance1000Fields onSubmit={() => {}} setFormData={() => {}} />);
    
    const renderTime = Date.now() - startTime;
    
    const firstField = component.locator('[data-test="field_0"]');
    await expect(firstField).toBeAttached();
    
    const lastField = component.locator('[data-test="field_999"]');
    await expect(lastField).toBeAttached();
    
    console.log(`Render time for 1000 fields: ${renderTime}ms`);
    expect(renderTime).toBeLessThan(3000);
  });

  test('should validate 1000 fields on submit within performance budget', async ({ mount }) => {
    const component = await mount(<Performance1000Fields onSubmit={() => {}} setFormData={() => {}} />);

    const submitButton = component.locator(sel.submit);
    
    const submitStart = Date.now();
    await submitButton.click();
    const submitTime = Date.now() - submitStart;
    
    console.log(`Submit validation time: ${submitTime}ms`);
    expect(submitTime).toBeLessThan(1000);
    
    const field0Error = component.locator('[data-test="field_0-error"]');
    const field500Error = component.locator('[data-test="field_500-error"]');
    const field999Error = component.locator('[data-test="field_999-error"]');
    
    await expect(field0Error).toBeAttached();
    await expect(field500Error).toBeAttached();
    await expect(field999Error).toBeAttached();
    await expect(field0Error).toContainText('This field is required');
  });
});
