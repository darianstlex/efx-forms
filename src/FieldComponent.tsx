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
  disableFieldReinit,
  parse,
  format,
  ...rest
}: IRFieldProps) => {
  const form = useFormInstance(formName);

  const value = useStoreMap(form.$values, (it) => it[name]);
  const error = useStoreMap(form.$error, (it) => it[name] || null);
  const errors = useStoreMap(form.$errors, (it) => it[name] || ARR_0 as unknown as string[]);

  const [setActive, onBlur, onChange, setUntouchedValues] = useUnit([
    form.setActive, form.onBlur, form.onChange, form.setUntouchedValues,
  ]);

  useEffect(() => {
    const config = pickBy({
      parse, format, validators, initialValue, validateOnBlur, validateOnChange, disableFieldReinit,
    }, (val) => val !== undefined);
    form.setFieldConfig({ name, ...config });
  }, [
    form.setFieldConfig,
    disableFieldReinit,
    validateOnChange,
    validateOnBlur,
    initialValue,
    validators,
    format,
    parse,
    name,
  ]);

  useEffect(() => {
    setActive({ name, value: true });
    return () => {
      setActive({ name, value: false });
    };
  }, [name, setActive]);

  useEffect(() => {
    const reinitDisabled = disableFieldReinit !== undefined ? disableFieldReinit : form.config.disableFieldsReinit;
    const fieldInitialValue = initialValue !== undefined ? initialValue : form.config.initialValues?.[name];
    !reinitDisabled && fieldInitialValue && setUntouchedValues({ [name]: fieldInitialValue });
  }, [initialValue, name, disableFieldReinit, setUntouchedValues]);

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
