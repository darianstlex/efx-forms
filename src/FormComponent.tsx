import React, { useLayoutEffect } from 'react';
import type { SubmitEvent } from 'react';
import { useUnit } from 'effector-react';
import pickBy from 'lodash/pickBy';
import isEmpty from 'lodash/isEmpty';

import { FORM_CONFIG } from './constants';
import { FormProvider } from './context';
import type { IRFormProps } from './types';
import { useFormInstance } from './useFormInstance';

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
  const form = useFormInstance(name);

  const [formSubmit, formReset, resetUntouched, setConfig] = useUnit([
    form.submit,
    form.reset,
    form.resetUntouched,
    form.setConfig,
  ]);

  /**
   * Set config on config props changes
   */
  useLayoutEffect(() => {
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
    setConfig({ name, ...config });
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
  useLayoutEffect(() => {
    return () => {
      !keepOnUnmount && formReset();
    };
  }, [formReset, keepOnUnmount]);

  useLayoutEffect(() => {
    if (!disableFieldsReinit && !isEmpty(initialValues)) {
      resetUntouched(Object.keys(initialValues));
    }
  }, [initialValues, disableFieldsReinit, resetUntouched]);

  const submit = (event: SubmitEvent) => {
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
