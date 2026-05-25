import React, { useCallback, useLayoutEffect, useMemo, memo } from 'react';
import type { ComponentType } from 'react';
import { useUnit } from 'effector-react';
import pickBy from 'lodash/pickBy';

import { FIELD_CONFIG } from './constants';
import type { IFieldProps, IForm, IRFieldProps, IValue } from './types';
import { useFormInstance } from './useFormInstance';
import { useStoreProp } from './useStoreProp';

const useValue = (form: IForm, name: string) => {
  const fieldValue = useStoreProp(form.$values, name);
  const format = useStoreProp(form.$fieldsConfig, `${name}.format`, FIELD_CONFIG.format) as IFieldProps['format'];

  return useMemo(() => format(fieldValue), [fieldValue, name]);
};

const InternalFieldInst = ({ Field, name, formName, ...rest }: {
  name: string;
  formName?: string;
  Field: ComponentType<any>;
}) => {
  const form = useFormInstance(formName);
  const [onFieldBlur, onFieldChange] = useUnit([form.onBlur, form.onChange]);

  const error = useStoreProp(form.$error, name, null);
  const errors = useStoreProp(form.$errors, name, null);

  const onChange = useCallback((value: IValue) => {
    onFieldChange({ name, value });
  }, [name, onFieldChange]);

  const onBlur = useCallback((value: IValue) => {
    onFieldBlur({ name, value });
  }, [name, onFieldBlur]);

  const value = useValue(form, name);

  return (<Field {...{ error, errors, name, value, onChange, onBlur, ...rest }} />);
};

export const InternalField = memo(InternalFieldInst);

/**
 * Efx Field component
 */
export const Field = ({
  Field,
  name,
  parse,
  format,
  passive,
  formName,
  validators,
  initialValue,
  validateOnBlur,
  validateOnChange,
  disableFieldReinit,
  ...rest
}: IRFieldProps) => {
  const form = useFormInstance(formName);

  const formDisableFieldsReinit = useStoreProp(form.$formConfig, 'disableFieldsReinit');

  const [setActive, resetUntouched, setFieldConfig] = useUnit([
    form.setActive,
    form.resetUntouched,
    form.setFieldConfig,
  ]);

  useLayoutEffect(() => {
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
    !passive && setFieldConfig({ name, ...config });
  }, [
    disableFieldReinit,
    validateOnChange,
    validateOnBlur,
    initialValue,
    validators,
    passive,
    format,
    parse,
    name,
    form,
  ]);

  useLayoutEffect(() => {
    !passive && setActive({ name, value: true });
    return () => {
      !passive && setActive({ name, value: false });
    };
  }, [name, passive, setActive]);

  const reinitDisabled =
    !passive && disableFieldReinit !== undefined
      ? disableFieldReinit
      : formDisableFieldsReinit;

  useLayoutEffect(() => {
    if (!reinitDisabled && initialValue !== undefined) {
      Promise.resolve().then(() => resetUntouched([name]));
    }
  }, [reinitDisabled, name, initialValue, resetUntouched]);

  return <InternalField {...{ name, formName, Field, ...rest }} />;
};

Field.displayName = 'Field';
