import React, { useEffect, useMemo } from 'react';
import type { FormEvent } from 'react';
import { useUnit } from 'effector-react';

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
  const form: IForm = useMemo(() => getForm({
    name,
    ...(keepOnUnmount ? { keepOnUnmount } : {}),
    ...(skipClientValidation ? { skipClientValidation } : {}),
    ...(initialValues ? { initialValues } : {}),
    ...(validateOnBlur ? { validateOnBlur } : {}),
    ...(validateOnChange ? { validateOnChange } : {}),
    ...(validators ? { validators } : {}),
  }), [name, keepOnUnmount, skipClientValidation, initialValues, validateOnBlur, validateOnChange, validators]);

  const [formSubmit, formReset] = useUnit([form.submit, form.reset]);

  useEffect(() => {
    form.setConfig({
      name,
      ...(keepOnUnmount ? { keepOnUnmount } : {}),
      ...(skipClientValidation ? { skipClientValidation } : {}),
      ...(initialValues ? { initialValues } : {}),
      ...(validateOnBlur ? { validateOnBlur } : {}),
      ...(validateOnChange ? { validateOnChange } : {}),
      ...(validators ? { validators } : {}),
    });
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
