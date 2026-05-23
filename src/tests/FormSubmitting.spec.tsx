import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';

import { FormSubmitting, FormSubmittingFailure } from './FormSubmitting';
import { sel } from './selectors';
import type { OnSendParams } from './components/Hooks';

/**
 * TEST SUITE: Form Submitting State ($submitting)
 * 
 * WHAT: Tests $submitting store which tracks async submit state
 * 
 * WHY: Submit state is critical for UX during async operations:
 * - Disable submit button while submitting (prevent double-submit)
 * - Show loading spinner/skeleton
 * - Block form interactions during submit
 * - Provide feedback that action is in progress
 * 
 * $submitting is derived from onSubmit.pending (effector effect pending state)
 * 
 * SCENARIOS:
 * 1. Initial state → $submitting = false (no submit in progress)
 * 2. Submit button → enabled by default (can submit)
 * 3. $submitting accessible via SendFormData helper (state capture)
 * 
 * NOTE: Full async submit testing (pending → resolved) requires effector effect
 * mocking which is complex in Playwright CT. These tests verify $submitting
 * is available and has correct initial state.
 */
test.describe('Form Submitting State', () => {
  test('$submitting starts as false', async ({ mount }) => {
    const data = {
      form: {},
    } as OnSendParams;

    const component = await mount(
      <FormSubmitting
        setFormData={(formData) => Object.assign(data, formData)}
      />,
    );

    const sendData = component.locator(sel.sendData);

    await sendData.click();
    expect(data.form.submitting).toBe(false);
  });

  test('submit button is enabled by default', async ({ mount }) => {
    const component = await mount(
      <FormSubmitting setFormData={() => {}} />,
    );

    const submit = component.locator(sel.submit);
    await expect(submit).toBeEnabled();
  });

  test('$submitting state available via SendFormData', async ({ mount }) => {
    const data = {
      form: {},
    } as OnSendParams;

    const component = await mount(
      <FormSubmittingFailure
        setFormData={(formData) => Object.assign(data, formData)}
      />,
    );

    const sendData = component.locator(sel.sendData);

    await sendData.click();
    expect(data.form).toHaveProperty('submitting');
    expect(typeof data.form.submitting).toBe('boolean');
  });
});
