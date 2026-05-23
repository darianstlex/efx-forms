import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';

import {
  ValidationPasswordConfirm,
  ValidationDateRange,
  ValidationBudgetCheck,
} from './ValidationCrossField';
import { sel } from './selectors';
import type { OnSendParams } from './components/Hooks';

/**
 * TEST SUITE: Cross-Field Validation
 * 
 * WHAT: Tests validators that depend on multiple field values (value, values) signature
 * 
 * WHY: Real-world forms often have interdependent field validation:
 * - Password confirmation (password === confirmPassword)
 * - Date ranges (endDate > startDate)
 * - Budget limits (requested <= budget)
 * - Conditional requirements (if shipping, then address required)
 * 
 * Validator signature: (fieldValue, allFormValues) => error | false
 * 
 * SCENARIOS TESTED:
 * 1. Password confirmation: Compare two field values
 * 2. Date range: Validate against another field's value
 * 3. Budget check: Numeric comparison with another field
 * 
 * KEY BEHAVIOR: Second parameter (values) provides access to entire form state,
 * enabling validation logic that spans multiple fields.
 */
test.describe('Cross-Field Validation', () => {
  test('password confirmation', async ({ mount }) => {
    const data = {
      form: {},
    } as OnSendParams;

    const component = await mount(
      <ValidationPasswordConfirm
        setFormData={(formData) => Object.assign(data, formData)}
      />,
    );

    const password = component.locator(sel.userPassword);
    const confirmPassword = component.locator(sel.userPasswordOutside);
    const confirmError = component.locator('[data-test="confirmPassword-error"]');
    const sendData = component.locator(sel.sendData);

    await password.fill('secret123');

    await confirmPassword.fill('secret456');
    await confirmPassword.blur();

    await expect(confirmError).toContainText('Passwords do not match');

    await confirmPassword.fill('secret123');
    await confirmPassword.blur();

    await sendData.click();
    expect(data.form.valid).toBe(true);
  });

  test('date range validation', async ({ mount }) => {
    const data = {
      form: {},
    } as OnSendParams;

    const component = await mount(
      <ValidationDateRange
        setFormData={(formData) => Object.assign(data, formData)}
      />,
    );

    const startDate = component.locator('[data-test="startDate"]');
    const endDate = component.locator('[data-test="endDate"]');
    const endDateError = component.locator('[data-test="endDate-error"]');
    const sendData = component.locator(sel.sendData);

    await startDate.fill('2024-01-15');

    await endDate.fill('2024-01-10');
    await endDate.blur();

    await expect(endDateError).toContainText('End date must be after start date');

    await endDate.fill('2024-01-20');
    await endDate.blur();

    await sendData.click();
    expect(data.form.valid).toBe(true);
  });

  test('budget validation', async ({ mount }) => {
    const data = {
      form: {},
    } as OnSendParams;

    const component = await mount(
      <ValidationBudgetCheck
        setFormData={(formData) => Object.assign(data, formData)}
      />,
    );

    const budget = component.locator('[data-test="budget"]');
    const requested = component.locator('[data-test="requested"]');
    const requestedError = component.locator('[data-test="requested-error"]');
    const sendData = component.locator(sel.sendData);

    await budget.fill('1000');

    await requested.fill('1500');
    await requested.blur();

    await expect(requestedError).toContainText('Cannot exceed budget of 1000');

    await requested.fill('800');
    await requested.blur();

    await sendData.click();
    expect(data.form.valid).toBe(true);
  });
});
