import { useStoreMap, useUnit } from 'effector-react';

import { useFormInstance } from './useFormInstance';

/**
 * Return field data/controls belongs to the current or provided form
 */
export const useField = (name: string, formName?: string) => {
  const form = useFormInstance(formName);
  const [reset, validate, setActive, setValue, onChange] = useUnit([
    form.reset, form.validate, form.setActive, form.setValues, form.onChange,
  ]);
  return {
    value: useStoreMap(form.$values, (it) => it[name]),
    active: useStoreMap(form.$active, (it) => it[name]),
    dirty: useStoreMap(form.$dirties, (it) => it[name]),
    error: useStoreMap(form.$error, (it) => it[name]),
    errors: useStoreMap(form.$errors, (it) => it[name]),
    reset: () => reset(name),
    validate: () => validate({ name }),
    setActive: (value: boolean) => setActive({ name, value }),
    setValue: (value: any) => setValue({ name, value }),
    change: (value: any) => onChange({ name, value }),
    setConfig: form.setFieldConfig,
    config: form.configs[name],
  };
};
