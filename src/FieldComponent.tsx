import React, { useCallback, useEffect, useMemo, memo } from 'react';
import type { ComponentType } from 'react';
import { useUnit } from 'effector-react';
import pickBy from 'lodash/pickBy';

import { FIELD_CONFIG } from './constants';
import { useFormInstance } from './useFormInstance';
import type { IRFieldProps } from './types';
import { useFieldStore } from './useFieldStore';

const InternalFieldInst = ({
  Field,
  name,
  formName,
  ...rest
}: {
  name: string;
  formName?: string;
  Field: ComponentType<any>;
}) => {
  const form = useFormInstance(formName);
  const [onFieldBlur, onFieldChange] = useUnit([form.onBlur, form.onChange]);

  const fieldValue = useFieldStore({ store: '$values', formName, name });
  const error = useFieldStore({ store: '$error', formName, name, defaultValue: null });
  const errors = useFieldStore({ store: '$errors', formName, name, defaultValue: null });

  const onChange = useCallback((value: any) => {
    onFieldChange({ name, value });
  }, [name, onFieldChange]);

  const onBlur = useCallback((value: any) => {
    onFieldBlur({ name, value });
  }, [name, onFieldBlur]);

  const value = useMemo(() => {
    const format = form.configs?.[name]?.format || FIELD_CONFIG.format!;
    return format(fieldValue);
  }, [fieldValue, form.configs, name]);

  return (<Field {...{ error, errors, name, value, onChange, onBlur, ...rest }} />);
};

export const InternalField = memo(InternalFieldInst);

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

  const [setActive, resetUntouched] = useUnit([form.setActive, form.resetUntouched]);

  useEffect(() => {
    const config = pickBy(
      {
        parse,
        format,
        validators,
        initialValue,
        validateOnBlur,
        validateOnChange,
        disableFieldReinit,
      },
      (val) => val !== undefined,
    );
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

  const reinitDisabled =
    disableFieldReinit !== undefined
      ? disableFieldReinit
      : form.config.disableFieldsReinit;

  useEffect(() => {
    !reinitDisabled
    && initialValue !== undefined
    && resetUntouched([name]);
  }, [reinitDisabled, name, initialValue, resetUntouched]);

  return <InternalField {...{ name, formName, Field, ...rest }} />;
};

Field.displayName = 'Field';
