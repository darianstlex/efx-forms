import { useUnit } from 'effector-react';

import { useFormInstance } from './useFormInstance';

/**
 * Return parent or requested form data
 */
export const useFormData = (name?: string) => {
  const form = useFormInstance(name);
  return useUnit({
    active: form.$active,
    activeValues: form.$activeValues,
    activeOnly: form.$activeOnly,
    dirties: form.$dirties,
    dirty: form.$dirty,
    error: form.$error,
    errors: form.$errors,
    submitting: form.$submitting,
    touched: form.$touched,
    touches: form.$touches,
    values: form.$values,
    valid: form.$valid,
  });
};
