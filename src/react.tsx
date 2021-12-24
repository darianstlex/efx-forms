import React, { createContext, useContext, useEffect, useMemo, FormEvent } from 'react';
import { useStore } from 'effector-react';

import { createForm, formConfigDefault, getForm } from './form';
import { fieldConfigDefault } from './field';
import {
  IField,
  IFieldConfig,
  IForm,
  IFormValues,
  REfxFieldProps,
  REfxFormProps, REfxWhenProps,
  TFieldValue,
} from './model';

export const FormNameContext = createContext(formConfigDefault.name);

/**
 * Return parent or requested form instance
 */
export const useForm = (name?: string): IForm => {
  const formName = useContext(FormNameContext);
  return useMemo(() => getForm(name || formName), [name, formName]);
}

/**
 * Return form values - flat
 */
export const useFormValues = (name?: string): IFormValues => {
  const { $values } = useForm(name);
  return useStore($values);
}

/**
 * Return field instance belongs to the current or provided form
 */
export const useField = (name: string, formName?: string): IField => {
  const form = useForm(formName);
  return useMemo(() => form.fields[name], [name, formName]);
}

/**
 * Return field value of the current or provided form
 */
export const useFieldValue = (name: string, formName?: string): TFieldValue => {
  const { $value } = useField(name, formName);
  return useStore($value);
}

export const REfxForm = ({
  children = null,
  onSubmit = formConfigDefault.onSubmit,
  name = formConfigDefault.name,
  remoteValidation = formConfigDefault.remoteValidation,
  skipClientValidation = formConfigDefault.skipClientValidation,
  initialValues = formConfigDefault.initialValues,
  validateOnBlur = formConfigDefault.validateOnBlur,
  validateOnChange = formConfigDefault.validateOnChange,
  validations = formConfigDefault.validations,
}: REfxFormProps) => {
  const form: IForm = useMemo(() => createForm({
    name,
    initialValues,
    validateOnBlur,
    validateOnChange,
    formValidations: validations,
  }), [name, initialValues, validateOnBlur, validateOnChange, validations]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (remoteValidation) {
      form.submitRemote({ cb: onSubmit, skipClientValidation });
    } else {
      form.submit({ cb: onSubmit, skipClientValidation });
    }
  };

  return (
    <FormNameContext.Provider value={name}>
      <form onSubmit={submit}>{children}</form>
    </FormNameContext.Provider>
  );
};

REfxForm.displayName = 'REfxForm';

export const REfxField = ({ Field, name, formName, ...rest }: REfxFieldProps) => {
  const { config, fields, registerField } = useForm(formName);
  const { name: N, initialValues = {}, formValidations = {}, ...formConfig } = config;

  const {
    initialValue = initialValues[name],
    parse = fieldConfigDefault.parse,
    format = fieldConfigDefault.format,
    validators = formValidations[name] || fieldConfigDefault.validators,
    validateOnBlur = formConfig.validateOnBlur,
    validateOnChange = formConfig.validateOnChange,
    ...props
  } = rest;

  const { $value, $errors, onChange, onBlur, setActive }: Partial<IField> = useMemo(() => {
    const field = fields[name];

    const fieldConfig = {
      name,
      initialValue,
      parse,
      validators,
      validateOnBlur,
      validateOnChange,
    } as Omit<IFieldConfig, 'format'>;
    field && (field.config = fieldConfig);

    return field || registerField(fieldConfig);
  }, [name, initialValue, parse, validators, validateOnBlur, validateOnChange, formConfig]);

  useEffect(() => {
    setActive(true);
    return () => {
      setActive(false);
    };
  }, []);

  const value = useStore($value) || '';
  const [error, ...errors] = useStore($errors);

  return (
    <Field {...{
      error,
      errors,
      name,
      value: format(value),
      onChange,
      onBlur: () => onBlur(),
      ...props,
    }} />
  );
};

REfxField.displayName = 'REfxField';

/**
 * Conditional rendering component based on form values
 */
export const REfxWhen = ({ children, check, form }: REfxWhenProps) => {
  const values = useFormValues(form);
  return check(values) ? children : null;
}

REfxWhen.displayName = 'REfxWhen';
