import React, { useEffect, useMemo } from 'react';
import type { FormEvent } from 'react';
import { useUnit } from 'effector-react';
import isEmpty from 'lodash/isEmpty';
import pickBy from 'lodash/pickBy';

import { FORM_CONFIG } from './constants';
import { getForm } from './forms';
import type { IForm, IRFormProps } from './types';
import { FormProvider } from './context';

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
  disableFieldsReinit,
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
      disableFieldsReinit,
    }, (val) => val !== undefined);
    return getForm({ name, ...config });
  }, [name]);

  const [formSubmit, formReset, setUntouchedValues] = useUnit([form.submit, form.reset, form.setUntouchedValues]);

  /**
   * Set config on config props changes
   */
  useEffect(() => {
    const config = pickBy({
      validators,
      initialValues,
      keepOnUnmount,
      validateOnBlur,
      validateOnChange,
      disableFieldsReinit,
      skipClientValidation,
    }, (val) => val !== undefined);
    form.setConfig({ name, ...config });
  }, [
    skipClientValidation,
    disableFieldsReinit,
    validateOnChange,
    validateOnBlur,
    initialValues,
    keepOnUnmount,
    validators,
    name,
    form,
  ]);

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
    !disableFieldsReinit && !isEmpty(initialValues) && setUntouchedValues(initialValues);
  }, [initialValues, setUntouchedValues, disableFieldsReinit]);

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
