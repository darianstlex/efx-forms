import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';

import { FormErase, FormResetField, FormResetUntouched } from './FormErase';
import { sel } from './selectors';
import type { OnSendParams } from './components/Hooks';

/**
 * TEST SUITE: Form Erase and Reset Events
 * 
 * WHAT: Tests erase, resetField, and resetUntouched events
 * 
 * WHY: Different reset scenarios require different behaviors:
 * 
 * ERASE (form.erase):
 * - Complete form destruction (like unmounting)
 * - Clears ALL stores: values, touches, dirties, errors
 * - Used when form should completely forget all state
 * - Scenario: User navigates away, form unmounts
 * 
 * RESET (form.reset):
 * - Reset to initialValues
 * - Clears touches, dirties, errors
 * - Values return to initialValues
 * - Scenario: User clicks "Reset Form" button
 * 
 * RESET FIELD (form.resetField):
 * - Reset single field to its initialValue
 * - Other fields unchanged
 * - Scenario: "Clear this field" button
 * 
 * RESET UNTOUCHED (form.resetUntouched):
 * - Reset only untouched fields to initialValues
 * - Touched fields preserve user input
 * - Scenario: Form config changes, but preserve user edits
 * 
 * KEY DISTINCTION: erase vs reset
 * - erase: values = {} (empty, no initialValues)
 * - reset: values = initialValues (restored)
 */
test.describe('Form Erase', () => {
  test('erase removes all form data and resets stores', async ({ mount }) => {
    const data = {
      form: {},
    } as OnSendParams;

    const component = await mount(
      <FormErase
        setFormData={(formData) => Object.assign(data, formData)}
      />,
    );

    const field1 = component.locator('[data-test="field1"]');
    const field2 = component.locator('[data-test="field2"]');
    const eraseBtn = component.locator('[data-test="erase"]');
    const sendData = component.locator(sel.sendData);

    await field1.fill('modified1');
    await field2.fill('modified2');

    await field1.blur();
    await field2.blur();

    await sendData.click();

    expect(data.form.values).toEqual({
      'field1': 'modified1',
      'field2': 'modified2',
    });
    expect(data.form.touched).toBe(true);
    expect(data.form.dirty).toBe(true);

    await eraseBtn.click();
    await sendData.click();

    expect(data.form.values).toEqual({});
    expect(data.form.touched).toBe(false);
    expect(data.form.dirty).toBe(false);
    expect(data.form.touches).toEqual({});
    expect(data.form.dirties).toEqual({});
  });

  test('erase vs reset: erase removes everything, reset goes to initial', async ({ mount }) => {
    const data = {
      form: {},
    } as OnSendParams;

    const component = await mount(
      <FormErase
        setFormData={(formData) => Object.assign(data, formData)}
      />,
    );

    const field1 = component.locator('[data-test="field1"]');
    const eraseBtn = component.locator('[data-test="erase"]');
    const resetBtn = component.locator(sel.reset);
    const sendData = component.locator(sel.sendData);

    await field1.fill('modified');
    await field1.blur();
    await sendData.click();

    expect(data.form.values['field1']).toBe('modified');

    await resetBtn.click();
    await sendData.click();

    expect(data.form.values['field1']).toBe('initial1');

    await field1.fill('modified-again');
    await sendData.click();

    await eraseBtn.click();
    await sendData.click();

    expect(data.form.values).toEqual({});
  });
});

test.describe('resetField Event', () => {
  test('resetField resets single field to initial value', async ({ mount }) => {
    const data = {
      form: {},
    } as OnSendParams;

    const component = await mount(
      <FormResetField
        setFormData={(formData) => Object.assign(data, formData)}
      />,
    );

    const field1 = component.locator('[data-test="field1"]');
    const field2 = component.locator('[data-test="field2"]');
    const resetField1Btn = component.locator('[data-test="reset-field1"]');
    const sendData = component.locator(sel.sendData);

    await field1.fill('modified1');
    await field2.fill('modified2');
    await sendData.click();

    expect(data.form.values['field1']).toBe('modified1');
    expect(data.form.values['field2']).toBe('modified2');

    await resetField1Btn.click();
    await sendData.click();

    expect(data.form.values['field1']).toBe('initial1');
    expect(data.form.values['field2']).toBe('modified2');
  });
});

test.describe('resetUntouched Event', () => {
  test('resetUntouched is available', async ({ mount }) => {
    const data = {
      form: {},
    } as OnSendParams;

    const component = await mount(
      <FormResetUntouched
        setFormData={(formData) => Object.assign(data, formData)}
      />,
    );

    const sendData = component.locator(sel.sendData);

    await sendData.click();

    expect(data.form.values).toEqual({
      'field1': 'initial1',
      'field2': 'initial2',
      'field3': 'initial3',
    });
  });
});
