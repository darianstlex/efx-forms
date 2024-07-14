import { useUnit } from 'effector-react';

import { useFormInstance } from './useFormInstance';

/**
 * Return parent or requested form data
 */
export const useForm = (name?: string) => {
  const form = useFormInstance(name);

  const data = useUnit({
    active: form.$active,
    activeValues: form.$activeValues,
    dirties: form.$dirties,
    dirty: form.$dirty,
    error: form.$error,
    erase: form.erase,
    reset: form.reset,
    setActive: form.setActive,
    setValues: form.setValues,
    submitting: form.$submitting,
    submit: form.submit,
    touched: form.$touched,
    touches: form.$touches,
    values: form.$values,
    valid: form.$valid,
    validate: form.validate,
  });

  return { config: form.config, configs: form.configs, ...data };
};
