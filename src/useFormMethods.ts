import { useUnit } from 'effector-react';

import { useFormInstance } from './useFormInstance';

/**
 * Return parent or requested form methods
 */
export const useFormMethods = (name?: string) => {
  const form = useFormInstance(name);
  return Object.assign(
    useUnit({
      change: form.onChange,
      erase: form.erase,
      reset: form.reset,
      setActive: form.setActive,
      setValues: form.setValues,
      submit: form.submit,
      validate: form.validate,
    }),
    {
      setConfig: form.setConfig,
      setFieldConfig: form.setFieldConfig,
    },
  );
};
