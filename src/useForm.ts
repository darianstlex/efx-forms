import { useUnit } from 'effector-react';

import { useFormInstance } from './useFormInstance';

/**
 * Return parent or requested form data
 */
export const useForm = (name?: string) => {
  const form = useFormInstance(name);

  return Object.assign(
    {},
    useUnit({
      active: form.$active,
      activeValues: form.$activeValues,
      dirties: form.$dirties,
      dirty: form.$dirty,
      error: form.$error,
      errors: form.$errors,
      submitting: form.$submitting,
      touched: form.$touched,
      touches: form.$touches,
      valid: form.$valid,
      values: form.$values,
      change: form.onChange,
      erase: form.erase,
      reset: form.reset,
      setActive: form.setActive,
      setValues: form.setValues,
      setTouchedValues: form.setTouchedValues,
      setUntouchedValues: form.setUntouchedValues,
      submit: form.submit,
      validate: form.validate,
    }),
    {
      setConfig: form.setConfig,
      setFieldConfig: form.setFieldConfig,
    }
  );
};
