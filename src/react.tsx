import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
  FormEvent, ReactElement,
} from 'react';
import { clearNode, combine } from 'effector';
import { useStore } from 'effector-react';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';

import { domain } from './utils';
import { formConfigDefault, createUpdateForm, getForm } from './form';
import { fieldConfigDefault } from './field';
import {
  IForm,
  IField,
  IFieldConfig,
  IFormValues,
  IRFieldProps,
  IRFormProps,
  TFieldValue,
  TFormStoreKey,
  TFieldStoreKey,
  IRIfFormValuesProps,
  IRIfFieldsValueProps,
  IRFormDataProviderProps,
  IRFieldDataProviderProps,
  IRFieldsValueProviderProps,
} from './model';

const $tempNull = domain.store<any>(null, { name: 'tempStore' });
const $tempArray = domain.store<any>([], { name: 'tempStore' });

export const FormNameContext = createContext(formConfigDefault.name);

/**
 * Rerender until done
 */
export const useRetry = ({
  done,
  error = '',
  warn = '',
  times = 3,
  interval = 50
}) => {
  const [tries, setTries] = useState(0);

  useEffect(() => {
    if (tries >= times) {
      error && console.error(error);
      warn && console.warn(warn);
    }
    !done && tries < times && setTimeout(() => {
      setTries((num) => num + 1);
    }, interval);
  }, [done, tries]);
};

/**
 * Combine provided stores
 */
export const useCombine = (stores: string[], source: IForm | IField) => {
  const $store = useMemo(() => {
    const map = stores.map((store) => source?.[store] || $tempNull);
    return source ? combine(map) : $tempArray;
  }, [stores.join(','), source]);

  useEffect(() => {
    return () => {
      clearNode($store);
    }
  }, []);

  return $store;
}

/**
 * Combine provided fields $value stores
 */
export const useCombineFieldsValue = (fields: string[], form: IForm) => {
  const key = fields.map((it) => !!form.fields[it] ? it : null).filter(Boolean).join(',');
  const { stores, missing } = useMemo(() => {
    const stores = fields.map((field) => form.fields[field]?.['$value'] || $tempNull);
    const missing = stores.map((it, idx) => it.shortName === 'tempStore'
      ? fields[idx]
      : false
    ).filter(Boolean);
    return { stores: combine(stores), missing };
  }, [key, form]);

  useEffect(() => {
    return () => {
      clearNode(stores);
    }
  }, []);

  return { $stores: stores, missing };
}

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
export const useFormStore = (store: TFormStoreKey, formName?: string): any => {
  const form = useForm(formName);
  return useStore(form[store as string]);
}

/**
 * Return form stores values array
 */
export const useFormStores = (stores: TFormStoreKey[], formName?: string) => {
  const form = useForm(formName);
  const $stores = useCombine(stores, form);
  return useStore($stores);
}

/**
 * Return field instance belongs to the current or provided form
 */
export const useField = (name: string, formName?: string): IField => {
  const form = useForm(formName);
  return useMemo(() => form.fields[name], [name, formName, form.fields[name]?.name]);
}

/**
 * Return field value of the current or provided form
 */
export const useFieldValue = (name: string, formName?: string): TFieldValue => {
  const { $value = $tempNull } = useField(name, formName) || {};

  useRetry({
    done: $value.shortName !== 'tempStore',
    warn: `Field "${name}" doesnt exist in the given form`,
  });

  return useStore($value);
}

/**
 * Return field store value of the current or provided form
 */
export const useFieldStore = (name: string, store: TFieldStoreKey, formName?: string): any => {
  const field = useField(name, formName);
  const $store = field?.[store as string] || $tempNull;

  useRetry({
    done: $store.shortName !== 'tempStore',
    warn: `Field "${name}" doesnt exist in the given form`,
  });

  return useStore($store);
}

/**
 * Return field stores values array
 */
export const useFieldStores = (name: string, stores: TFieldStoreKey[], formName?: string) => {
  const field = useField(name, formName);
  const $stores = useCombine(stores, field);

  useRetry({
    done: $stores.shortName !== 'tempStore',
    warn: `Field "${name}" doesnt exist in the given form`,
  });

  return useStore($stores);
}

/**
 * Return fields $value stores array
 */
export const useFieldsValue = (fields: string[], formName?: string) => {
  const form = useForm(formName);
  const { $stores, missing } = useCombineFieldsValue(fields, form);

  useRetry({
    done: !missing.length,
    warn: `
      Not all provided fields exist in the form.
      missing: ${missing.join(', ')}
    `,
  });

  return useStore($stores);
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
export const IfFormValues = ({
  children,
  check,
  form,
  setTo,
  resetTo,
  render,
  updateDebounce = 0
}: IRIfFormValuesProps) => {
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

  const output = () => render ? render(values) : children;

  return (show ? output() : null) as ReactElement;
}

IfFormValues.displayName = 'IfFormValues';

/**
 * Conditional rendering based on fields values
 */
export const IfFieldsValue = ({
  children,
  check,
  fields = [],
  formName,
  render,
}: IRIfFieldsValueProps) => {
  const values = useFieldsValue(fields, formName);
  const show = check(values);
  const output = () => render ? render(values) : children;

  return (show ? output() : null) as ReactElement;
}

IfFieldsValue.displayName = 'IfFieldsValue';

/**
 * Form data stores provider
 */
export const FormDataProvider = ({ children, name, stores }: IRFormDataProviderProps) => {
  const data = useFormStores(stores, name);
  return children(data) as ReactElement;
}

FormDataProvider.displayName = 'FormDataProvider';

/**
 * Field data stores provider
 */
export const FieldDataProvider = ({ children, name, formName, stores }: IRFieldDataProviderProps) => {
  const values = useFieldStores(name, stores, formName);
  return children(values) as ReactElement;
}

FieldDataProvider.displayName = 'FieldDataProvider';

/**
 * Fields value provider
 */
export const FieldsValueProvider = ({ children, fields, formName }: IRFieldsValueProviderProps) => {
  const values = useFieldsValue(fields, formName);
  return children(values) as ReactElement;
}

FieldsValueProvider.displayName = 'FieldsValueProvider';
