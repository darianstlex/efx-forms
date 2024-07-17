import { useUnit } from 'effector-react';

import { useFormInstance } from './useFormInstance';

/**
 * Return parent or requested form data
 */
export const useForm = (name?: string) => {
  const form = useFormInstance(name);

  return {
    setConfig: form.setConfig,
    setFieldConfig: form.setFieldConfig,
    ...useUnit({
      active: form.$active,
      activeValues: form.$activeValues,
      dirties: form.$dirties,
      dirty: form.$dirty,
      error: form.$error,
      errors: form.$errors,
      erase: form.erase,
      reset: form.reset,
      setActive: form.setActive,
      setValues: form.setValues,
      update: form.onChange,
      submitting: form.$submitting,
      submit: form.submit,
      touched: form.$touched,
      touches: form.$touches,
      values: form.$values,
      valid: form.$valid,
      validate: form.validate,
    }),
  };
};
