import type { FormEvent } from 'react';
import React, { useMemo, useEffect } from 'react';
import { useUnit } from 'effector-react';
import pickBy from 'lodash/pickBy';
import isEmpty from 'lodash/isEmpty';

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
  serialize,
  ...props
}: IRFormProps) => {
  const form: IForm = useMemo(() => {
    const config = pickBy(
      {
        keepOnUnmount,
        skipClientValidation,
        initialValues,
        validateOnBlur,
        validateOnChange,
        validators,
        disableFieldsReinit,
        serialize,
      },
      (val) => val !== undefined,
    );
    return getForm({ name, ...config });
  }, [name]);

  const [formSubmit, formReset, resetUntouched] = useUnit([
    form.submit,
    form.reset,
    form.resetUntouched,
  ]);

  /**
   * Set config on config props changes
   */
  useEffect(() => {
    const config = pickBy(
      {
        serialize,
        validators,
        initialValues,
        keepOnUnmount,
        validateOnBlur,
        validateOnChange,
        disableFieldsReinit,
        skipClientValidation,
      },
      (val) => val !== undefined,
    );
    form.setConfig({ name, ...config });
  }, [
    skipClientValidation,
    disableFieldsReinit,
    validateOnChange,
    validateOnBlur,
    initialValues,
    keepOnUnmount,
    validators,
    serialize,
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

  useEffect(() => {
    if (!disableFieldsReinit && !isEmpty(initialValues)) {
      resetUntouched(Object.keys(initialValues));
    }
  }, [initialValues, disableFieldsReinit, resetUntouched]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    return formSubmit({ cb: onSubmit, skipClientValidation });
  };

  return (
    <FormProvider name={name}>
      <form onSubmit={submit} {...props}>
        {children}
      </form>
    </FormProvider>
  );
};

Form.displayName = 'Form';
