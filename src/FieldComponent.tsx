import React, { useEffect } from 'react';
import type { ComponentType } from 'react';
import { useStoreMap, useUnit } from 'effector-react';
import pickBy from 'lodash/pickBy';

import { ARR_0, FIELD_CONFIG } from './constants';
import { useFormInstance } from './useFormInstance';
import { IRFieldProps } from './types';

export const InternalField = ({
  Field,
  name,
  formName,
  ...rest
}: { name: string; formName?: string; Field: ComponentType<any>; }) => {
  const form = useFormInstance(formName);
  const [onBlur, onChange] = useUnit([form.onBlur, form.onChange]);

  const value = useStoreMap(form.$values, (it) => it[name]);
  const error = useStoreMap(form.$error, (it) => it[name] || null);
  const errors = useStoreMap(form.$errors, (it) => it[name] || ARR_0 as unknown as string[]);

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

  const [setActive, setUntouchedValues] = useUnit([form.setActive, form.setUntouchedValues]);

  useEffect(() => {
    const config = pickBy({
      parse, format, validators, initialValue, validateOnBlur, validateOnChange, disableFieldReinit,
    }, (val) => val !== undefined);
    form.setFieldConfig({ name, ...config });
  }, [
    form,
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

  const fieldInitialValue = initialValue !== undefined ? initialValue : form.config.initialValues?.[name];
  const reinitDisabled = disableFieldReinit !== undefined ? disableFieldReinit : form.config.disableFieldsReinit;

  useEffect(() => {
    !reinitDisabled && fieldInitialValue !== undefined && setUntouchedValues({ [name]: fieldInitialValue });
  }, [reinitDisabled, name, fieldInitialValue, setUntouchedValues]);

  return (<InternalField {...{ name, formName, Field, ...rest }} />);
};

Field.displayName = 'Field';
