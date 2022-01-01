import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  FormEvent,
} from 'react';
import { useStore } from 'effector-react';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';

import { formConfigDefault, createUpdateForm, getForm } from './form';
import { fieldConfigDefault } from './field';
import {
  IField,
  IFieldConfig,
  IForm,
  IFormValues,
  IRFieldProps,
  IRFormProps,
  IRDisplayWhenProps,
  TFieldValue,
  IRFormDataProviderProps,
  IRFieldDataProviderProps,
} from './model';
import { combine } from 'effector';

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
 * Return form stores values array
 */
export const useFormStores = (stores: string[], formName?: string): any => {
  const form = useForm(formName);
  const storesMap = stores.map((store) => form[store]).filter(Boolean);
  return useStore(combine(storesMap));
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

/**
 * Return field stores values array
 */
export const useFieldStores = (name: string, stores: string[], formName?: string): any => {
  const field = useField(name, formName);
  const storesMap = stores.map((store) => field[store]).filter(Boolean);
  return useStore(combine(storesMap));
}

/**
 * Efx Form component
 */
export const Form = ({
  children = null,
  onSubmit = formConfigDefault.onSubmit,
  name = formConfigDefault.name,
  keepOnUnmount = formConfigDefault.keepOnUnmount,
  skipClientValidation = formConfigDefault.skipClientValidation,
  initialValues = formConfigDefault.initialValues,
  validateOnBlur = formConfigDefault.validateOnBlur,
  validateOnChange = formConfigDefault.validateOnChange,
  validators = formConfigDefault.validators,
  ...props
}: IRFormProps) => {
  const form: IForm = useMemo(() => createUpdateForm({
    name,
    initialValues,
    validateOnBlur,
    validateOnChange,
    formValidators: validators,
  }), [name, initialValues, validateOnBlur, validateOnChange, validators]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    form.submit({ cb: onSubmit, skipClientValidation });
  };

  useEffect(() => {
    return () => {
      !keepOnUnmount && form.reset();
    }
  }, []);

  return (
    <FormNameContext.Provider value={name}>
      <form onSubmit={submit} {...props}>{children}</form>
    </FormNameContext.Provider>
  );
};

Form.displayName = 'Form';

/**
 * Efx Field component
 */
export const Field = ({ Field, name, formName, ...rest }: IRFieldProps) => {
  const { config, fields, registerField } = useForm(formName);
  const { name: N, initialValues = {}, formValidators = {}, ...formConfig } = config;

  const {
    initialValue = initialValues[name] || fieldConfigDefault.initialValue,
    parse = fieldConfigDefault.parse,
    format = fieldConfigDefault.format,
    validators = formValidators[name] || fieldConfigDefault.validators,
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

Field.displayName = 'Field';

/**
 * Conditional rendering based on form values
 */
export const DisplayWhen = ({
  children,
  check,
  form,
  setTo,
  resetTo,
  updateDebounce = 0
}: IRDisplayWhenProps) => {
  const formInst = useForm(form);
  const values = useStore(formInst.$values);
  const show = check(values);
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

DisplayWhen.displayName = 'DisplayWhen';

/**
 * Form data stores provider
 */
export const FormDataProvider = ({ children, name, stores }: IRFormDataProviderProps) => {
  const data = useFormStores(stores, name);
  return children(data);
}

FormDataProvider.displayName = 'FormDataProvider';

/**
 * Field data stores provider
 */
export const FieldDataProvider = ({ children, name, formName, stores }: IRFieldDataProviderProps) => {
  const data = useFieldStores(name, stores, formName);
  return children(data);
}

FieldDataProvider.displayName = 'FieldDataProvider';
