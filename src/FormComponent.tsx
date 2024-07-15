import React, { useEffect, useMemo } from 'react';
import type { FormEvent } from 'react';
import { useUnit } from 'effector-react';
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
  }, [name, keepOnUnmount, skipClientValidation, initialValues, validateOnBlur, validateOnChange, validators]);

  const [formSubmit, formReset] = useUnit([form.submit, form.reset]);

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
  }, [keepOnUnmount, skipClientValidation, initialValues, validateOnBlur, validateOnChange, validators, name, form]);

  useEffect(() => {
    return () => {
      !keepOnUnmount && formReset();
    };
  }, [formReset, keepOnUnmount]);

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
