import { useUnit } from 'effector-react';
import { useCallback } from 'react';

import { useFormInstance } from './useFormInstance';
import { useFieldStore } from './useFieldStore';
import type { IFieldConfig } from './types';

interface Result {
  value: any;
  active: boolean;
  dirty: boolean;
  error: string | null;
  errors: string[] | null;
  config: IFieldConfig;
  reset: () => void;
  validate: () => void;
  setActive: (value: boolean) => void;
  setValue: (value: any) => void;
  change: (value: any) => void;
  setConfig: (cfg: IFieldConfig) => void;
}

/**
 * Return field data/controls belongs to the current or provided form
 */
export const useField = (name: string, formName?: string): Result => {
  const form = useFormInstance(formName);
  const [resetField, validate, setActive, setValue, onChange] = useUnit([
    form.resetField,
    form.validate,
    form.setActive,
    form.setValues,
    form.onChange,
  ]);
  return {
    value: useFieldStore({ store: '$values', formName, name }),
    active: useFieldStore({ store: '$active', formName, name, defaultValue: false }),
    dirty: useFieldStore({ store: '$dirties', formName, name, defaultValue: false }),
    error: useFieldStore({ store: '$error', formName, name, defaultValue: null }),
    errors: useFieldStore({ store: '$errors', formName, name, defaultValue: null }),
    reset: useCallback(() => resetField(name), [name, resetField]),
    validate: useCallback(() => validate({ name }), [name, validate]),
    setActive: useCallback((value: boolean) => setActive({ name, value }), [name, setActive]),
    setValue: useCallback((value: any) => setValue({ name, value }), [name, setValue]),
    change: useCallback((value: any) => onChange({ name, value }), [name, onChange]),
    setConfig: form.setFieldConfig,
    config: form.configs[name],
  };
};
