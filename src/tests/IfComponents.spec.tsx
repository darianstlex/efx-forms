import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';

import {
  IfFormValuesBasic,
  IfFormValuesSetTo,
  IfFormValuesResetTo,
  IfFieldValueBasic,
  IfFieldValueRender,
  IfNestedConditionals,
} from './IfComponents';
import { sel } from './selectors';
import type { OnSendParams } from './components/Hooks';

/**
 * TEST SUITE: Conditional Rendering Components
 * 
 * WHAT: Tests IfFormValues and IfFieldValue components for conditional rendering
 * 
 * WHY: Forms often need to show/hide content based on form state:
 * - Show advanced options when user opts in
 * - Display warnings when values exceed thresholds
 * - Reveal additional fields based on selections
 * - Auto-fill related fields when condition met
 * 
 * COMPONENTS:
 * 
 * IfFormValues:
 * - Condition: check(values, activeValues) → boolean
 * - Props: setTo (set values on show), resetTo (reset values on hide)
 * - Use case: Complex conditions involving multiple fields
 * 
 * IfFieldValue:
 * - Condition: check(fieldValue) → boolean
 * - Props: render (custom render with value)
 * - Use case: Simple single-field conditions
 * 
 * SCENARIOS TESTED:
 * 1. IfFormValues: Show adult content when age >= 18
 * 2. IfFormValues setTo: Auto-fill email when newsletter checked
 * 3. IfFormValues resetTo: Clear extra field when hidden
 * 4. IfFieldValue: Show message when status === 'active'
 * 5. IfFieldValue render: Display field value in custom format
 * 6. Nested: IfFieldValue wrapping IfFormValues (complex conditions)
 * 
 * EDGE CASES:
 * - Debounced updates (updateDebounce prop)
 * - Nested conditionals (multiple layers)
 * - Value manipulation on show/hide (setTo/resetTo)
 */
test.describe('IfFormValues Component', () => {
  test('conditional rendering based on form values', async ({ mount }) => {
    const component = await mount(
      <IfFormValuesBasic setFormData={() => {}} />,
    );

    const age = component.locator('[data-test="age"]');
    const adultContent = component.locator('[data-test="adult-content"]');

    await expect(adultContent).not.toBeAttached();

    await age.fill('17');
    await expect(adultContent).not.toBeAttached();

    await age.fill('18');
    await expect(adultContent).toBeAttached();
    await expect(adultContent).toHaveText('Adult content visible');
  });

  test('setTo prop sets values on show', async ({ mount }) => {
    const data = {
      form: {},
    } as OnSendParams;

    const component = await mount(
      <IfFormValuesSetTo
        setFormData={(formData) => Object.assign(data, formData)}
      />,
    );

    const newsletter = component.locator('[data-test="newsletter"]');
    const newsletterActive = component.locator('[data-test="newsletter-active"]');
    const sendData = component.locator(sel.sendData);

    await newsletter.check();

    await expect(newsletterActive).toBeAttached();

    await sendData.click();
    expect(data.form.values['email']).toBe('subscribe@example.com');
  });

  test('resetTo prop resets values on hide', async ({ mount }) => {
    const data = {
      form: {},
    } as OnSendParams;

    const component = await mount(
      <IfFormValuesResetTo
        setFormData={(formData) => Object.assign(data, formData)}
      />,
    );

    const showExtra = component.locator('[data-test="showExtra"]');
    const extra = component.locator('[data-test="extra"]');
    const extraVisible = component.locator('[data-test="extra-visible"]');
    const sendData = component.locator(sel.sendData);

    await showExtra.check();
    await expect(extraVisible).toBeAttached();

    await extra.fill('some value');

    await showExtra.uncheck();
    await expect(extraVisible).not.toBeAttached();

    await sendData.click();
    expect(data.form.values['extra']).toBe('');
  });
});

test.describe('IfFieldValue Component', () => {
  test('conditional rendering based on field value', async ({ mount }) => {
    const component = await mount(
      <IfFieldValueBasic setFormData={() => {}} />,
    );

    const status = component.locator('[data-test="status"]');
    const activeStatus = component.locator('[data-test="active-status"]');

    await expect(activeStatus).not.toBeAttached();

    await status.fill('inactive');
    await expect(activeStatus).not.toBeAttached();

    await status.fill('active');
    await expect(activeStatus).toBeAttached();
    await expect(activeStatus).toHaveText('Status is active');
  });

  test('render prop provides field value', async ({ mount }) => {
    const data = {
      form: {},
    } as OnSendParams;

    const component = await mount(
      <IfFieldValueRender
        setFormData={(formData) => Object.assign(data, formData)}
      />,
    );

    const status = component.locator('[data-test="status"]');
    const statusRender = component.locator('[data-test="status-render"]');
    const sendData = component.locator(sel.sendData);

    await expect(statusRender).not.toBeAttached();

    await status.fill('active');
    await expect(statusRender).toBeAttached();
    await expect(statusRender).toHaveText('Status: active');

    await sendData.click();
    expect(data.form.values['status']).toBe('active');
  });
});

test.describe('Nested Conditional Rendering', () => {
  test('IfFormValues inside IfFieldValue', async ({ mount }) => {
    const component = await mount(
      <IfNestedConditionals setFormData={() => {}} />,
    );

    const enabled = component.locator('[data-test="enabled"]');
    const level = component.locator('[data-test="level"]');
    const highLevel = component.locator('[data-test="high-level"]');

    await enabled.check();
    await level.fill('5');
    await expect(highLevel).not.toBeAttached();

    await level.fill('15');
    await expect(highLevel).toBeAttached();

    await enabled.uncheck();
    await expect(highLevel).not.toBeAttached();
  });
});
