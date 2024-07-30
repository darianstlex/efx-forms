import { useUnit } from 'effector-react';
import { useCallback } from 'react';

import { useFormInstance } from './useFormInstance';

/**
 * Return field controls belongs to the current or provided form
 */
export const useFieldMethods = (name: string, formName?: string) => {
  const form = useFormInstance(formName);
  const [resetField, validate, setActive, setValue, onChange] = useUnit([
    form.resetField,
    form.validate,
    form.setActive,
    form.setValues,
    form.onChange,
  ]);
  return {
    reset: useCallback(() => resetField(name), [name, resetField]),
    validate: useCallback(() => validate({ name }), [name, validate]),
    setActive: useCallback((value: boolean) => setActive({ name, value }), [name, setActive]),
    setValue: useCallback((value: any) => setValue({ name, value }), [name, setValue]),
    change: useCallback((value: any) => onChange({ name, value }), [name, onChange]),
    setConfig: form.setFieldConfig,
  };
};
