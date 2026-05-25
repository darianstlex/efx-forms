import { useUnit } from 'effector-react';
import { useCallback } from 'react';

import { useFormInstance } from './useFormInstance';
import { useStoreProp } from './useStoreProp';
import type { IValue } from './types';

/**
 * Return field data/controls belongs to the current or provided form
 */
export const useField = (name: string, formName?: string) => {
  const form = useFormInstance(formName);
  const [resetField, validate, setActive, setValue, onChange] = useUnit([
    form.resetField,
    form.validate,
    form.setActive,
    form.setValues,
    form.onChange,
  ]);
  return {
    value: useStoreProp(form.$values, name),
    active: useStoreProp(form.$active, name, true),
    dirty: useStoreProp(form.$dirties, name, false),
    error: useStoreProp(form.$error, name, null),
    errors: useStoreProp(form.$errors, name, null),
    reset: useCallback(() => resetField(name), [name, resetField]),
    validate: useCallback(() => validate({ name }), [name, validate]),
    setActive: useCallback((value: boolean) => setActive({ name, value }), [name, setActive]),
    setValue: useCallback((value: IValue) => setValue({ name, value }), [name, setValue]),
    change: useCallback((value: IValue) => onChange({ name, value }), [name, onChange]),
    setConfig: form.setFieldConfig,
  };
};
