import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  FormEvent,
} from 'react';
import { useStore } from 'effector-react';
import debounce from 'lodash-es/debounce';
import isEmpty from 'lodash-es/isEmpty';

import { formConfigDefault, createUpdateForm, getForm } from './form';
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
export const useFormValues = (formName?: string): IFormValues => {
  const { $values } = useForm(formName);
  return useStore($values);
}

/**
 * Return form store values
 */
export const useFormStore = (store: string, formName?: string): any => {
  const form = useForm(formName);
  return useStore(form[store]);
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

/**
 * Return field store value of the current or provided form
 */
export const useFieldStore = (name: string, store: string, formName?: string): any => {
  const field = useField(name, formName);
  return useStore(field[store]);
}

export const REfxForm = ({
  children = null,
  onSubmit = formConfigDefault.onSubmit,
  name = formConfigDefault.name,
  keepFormOnUnmount = formConfigDefault.keepFormOnUnmount,
  remoteValidation = formConfigDefault.remoteValidation,
  skipClientValidation = formConfigDefault.skipClientValidation,
  initialValues = formConfigDefault.initialValues,
  validateOnBlur = formConfigDefault.validateOnBlur,
  validateOnChange = formConfigDefault.validateOnChange,
  validations = formConfigDefault.validations,
  ...props
}: REfxFormProps) => {
  const form: IForm = useMemo(() => createUpdateForm({
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

  useEffect(() => {
    return () => {
      !keepFormOnUnmount && form.reset();
    }
  }, []);

  return (
    <FormNameContext.Provider value={name}>
      <form onSubmit={submit} {...props}>{children}</form>
    </FormNameContext.Provider>
  );
};

REfxForm.displayName = 'REfxForm';

export const REfxField = ({ Field, name, formName, ...rest }: REfxFieldProps) => {
  const { config, fields, registerField } = useForm(formName);
  const { name: N, initialValues = {}, formValidations = {}, ...formConfig } = config;

  const {
    initialValue = initialValues[name] || fieldConfigDefault.initialValue,
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
 * Conditional rendering based on form values
 */
export const REfxWhen = ({
  children,
  check,
  form,
  setTo,
  resetTo,
  updateDebounce = 0
}: REfxWhenProps) => {
  const formInst = useForm(form);
  const values = useStore(formInst.$values);
  const show = useMemo(() => check(values), [values]);
  const updateDeb = useCallback(
    debounce(formInst.update, updateDebounce),
    [formInst, updateDebounce],
  );

  useEffect(() => {
    show && !isEmpty(setTo) && updateDeb(setTo as IFormValues);
    !show && !isEmpty(resetTo) && updateDeb(resetTo as IFormValues);
    return updateDeb.cancel;
  }, [show]);

  return show ? children : null;
}

REfxWhen.displayName = 'REfxWhen';
