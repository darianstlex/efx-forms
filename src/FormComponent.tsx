import React, { useEffect, useMemo } from 'react';
import type { FormEvent } from 'react';
import { useUnit } from 'effector-react';
import pickBy from 'lodash/pickBy';

import { FORM_CONFIG } from './constants';
import { getForm } from './forms';
import type { IForm, IRFormProps } from './types';
import { FormProvider } from './context';
import isEmpty from 'lodash/isEmpty';

/**
 * Efx Form component
 */
export const Form = ({
  children = null,
  onSubmit = FORM_CONFIG.onSubmit,
  name = FORM_CONFIG.name,
  keepOnUnmount,
  skipClientValidation,
  initialValues,
  validateOnBlur,
  validateOnChange,
  validators,
  ...props
}: IRFormProps) => {
  const form: IForm = useMemo(() => {
    const config = pickBy({
      keepOnUnmount,
      skipClientValidation,
      initialValues,
      validateOnBlur,
      validateOnChange,
      validators,
    }, (val) => val !== undefined);
    return getForm({ name, ...config });
  }, [name]);

  const [formSubmit, formReset, setUntouchedValues] = useUnit([form.submit, form.reset, form.setUntouchedValues]);

  /**
   * Set config on config props changes
   */
  useEffect(() => {
    const config = pickBy({
      keepOnUnmount,
      skipClientValidation,
      initialValues,
      validateOnBlur,
      validateOnChange,
      validators,
    }, (val) => val !== undefined);
    form.setConfig({ name, ...config });
  }, [keepOnUnmount, skipClientValidation, initialValues, validateOnBlur, validateOnChange, validators, name, form.setConfig]);

  /**
   * Reset form on unmount if enabled
   */
  useEffect(() => {
    return () => {
      !keepOnUnmount && formReset();
    };
  }, [formReset, keepOnUnmount]);

  /**
   * Set initial values if fields are untouched
   */
  useEffect(() => {
    !isEmpty(initialValues) && setUntouchedValues(initialValues);
  }, [initialValues, setUntouchedValues]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    return formSubmit({ cb: onSubmit, skipClientValidation });
  };

  return (
    <FormProvider name={name}>
      <form onSubmit={submit} {...props}>{children}</form>
    </FormProvider>
  );
};

Form.displayName = 'Form';
