import { useUnit } from 'effector-react';

import { useFormInstance } from './useFormInstance';
import { useFieldStore } from './useFieldStore';

/**
 * Return field data/controls belongs to the current or provided form
 */
export const useField = (name: string, formName?: string) => {
  const form = useFormInstance(formName);
  const [reset, validate, setActive, setValue, onChange] = useUnit([
    form.reset,
    form.validate,
    form.setActive,
    form.setValues,
    form.onChange,
  ]);
  return {
    value: useFieldStore({ store: '$values', formName, name }),
    active: useFieldStore({ store: '$active', formName, name }),
    dirty: useFieldStore({ store: '$dirties', formName, name }),
    error: useFieldStore({ store: '$error', formName, name }),
    errors: useFieldStore({ store: '$errors', formName, name }),
    reset: () => reset(name),
    validate: () => validate({ name }),
    setActive: (value: boolean) => setActive({ name, value }),
    setValue: (value: any) => setValue({ name, value }),
    change: (value: any) => onChange({ name, value }),
    setConfig: form.setFieldConfig,
    config: form.configs[name],
  };
};
