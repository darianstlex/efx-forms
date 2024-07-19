import React, { useEffect } from 'react';
import { useStoreMap, useUnit } from 'effector-react';
import pickBy from 'lodash/pickBy';

import { ARR_0, FIELD_CONFIG } from './constants';
import { useFormInstance } from './useFormInstance';
import type { IRFieldProps } from './types';

/**
 * Efx Field component
 */
export const Field = ({
  Field,
  name,
  formName,
  initialValue,
  validateOnChange,
  validators,
  validateOnBlur,
  parse,
  format,
  ...rest
}: IRFieldProps) => {
  const form = useFormInstance(formName);

  const value = useStoreMap(form.$values, (it) => it[name]);
  const error = useStoreMap(form.$error, (it) => it[name] || null);
  const errors = useStoreMap(form.$errors, (it) => it[name] || ARR_0 as unknown as string[]);
  const touched = useStoreMap(form.$touches, (it) => it[name]);

  const [setActive, onBlur, onChange, setValues] = useUnit([
    form.setActive, form.onBlur, form.onChange, form.setValues,
  ]);

  useEffect(() => {
    const config = pickBy({
      parse, format, validators, initialValue, validateOnBlur, validateOnChange,
    }, (val) => val !== undefined);
    form.setFieldConfig({ name, ...config });
  }, [form.setFieldConfig, format, initialValue, name, parse, validateOnBlur, validateOnChange, validators]);

  useEffect(() => {
    setActive({ name, value: true });
    return () => {
      setActive({ name, value: false });
    };
  }, [name, setActive]);

  useEffect(() => {
    const fieldInitialValue = initialValue !== undefined ? initialValue : form.config.initialValues?.[name];
    fieldInitialValue && !touched && setValues({ [name]: fieldInitialValue });
  }, [initialValue, name, setValues]);

  const formatValue = form.configs?.[name]?.format || FIELD_CONFIG.format!;

  return (
    <Field {...{
      error,
      errors,
      name,
      value: formatValue(value),
      onChange: (value: any) => onChange({ name, value }),
      onBlur: (value: any) => onBlur({ name, value }),
      ...rest,
    }} />
  );
};

Field.displayName = 'Field';
