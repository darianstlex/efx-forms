import React, { FormEvent, ReactElement, ReactNode, useMemo } from 'react';
import { useStore } from 'effector-react';
import omit from 'lodash-es/omit';

import { createForm, formConfigDefault } from './form';
import { fieldConfigDefault } from './field';
import { IField, IFieldConfig, IForm, IFormConfig, REfxFieldProps, REfxFormProps } from './model';

export const REfxForm = ({
  children = null,
  onSubmit = formConfigDefault.onSubmit,
  remoteValidation = formConfigDefault.remoteValidation,
  skipClientValidation = formConfigDefault.skipClientValidation,
  name = formConfigDefault.name,
  initialValues = formConfigDefault.initialValues,
  validateOnBlur = formConfigDefault.validateOnBlur,
  validateOnChange = formConfigDefault.validateOnChange,
  validations,
}: REfxFormProps) => {
  const form: IForm = useMemo(() => {
    return createForm({ name });
  }, [name]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (remoteValidation) {
      return form.submitRemote({ cb: onSubmit, skipClientValidation });
    }
    form.submit({ cb: onSubmit });
  };

  const elements: ReactNode[] = React.Children.toArray(children);
  return (
    <form onSubmit={submit}>
      {elements.map((field) => {
        const isExField = (field as any)?.type?.displayName === 'REfxField';
        return isExField ? React.cloneElement(field as ReactElement, {
          form,
          formConfig: {
            initialValues,
            validateOnBlur,
            validateOnChange,
            formValidations: validations,
          } as Partial<IFormConfig>,
        }) : field;
      })}
    </form>
  );
};

REfxForm.displayName = 'REfxForm';

export const REfxField = ({
  Field,
  form = createForm({ name: formConfigDefault.name }),
  name,
  formConfig: {
    initialValues = formConfigDefault.initialValues,
    formValidations = formConfigDefault.validations,
    ...formConfig
  } = omit(formConfigDefault, ['name']),
  initialValue = initialValues[name],
  parse = fieldConfigDefault.parse,
  format = fieldConfigDefault.format,
  validators = formValidations[name] || fieldConfigDefault.validators,
  validateOnBlur,
  validateOnChange,
  ...props
}: REfxFieldProps) => {
  const { $value, $errors, onChange, onBlur }: Partial<IField> = useMemo(() => {
    const field = form.fields[name];
    const fieldConfig = {
      name,
      form,
      initialValue,
      parse,
      validators,
      validateOnBlur,
      validateOnChange,
      ...formConfig,
    } as Omit<IFieldConfig, 'format'>;
    field && (field.config = fieldConfig);
    return field || form.registerField(fieldConfig);
  }, [form, name, initialValue, parse, validators, validateOnBlur, validateOnChange, formConfig]);

  const value = useStore($value) || '';
  const [error] = useStore($errors);

  return (
    <Field {...{
      error,
      name,
      value: format(value),
      onChange,
      onBlur: () => onBlur(),
      ...props,
    }} />
  );
};

REfxField.displayName = 'REfxField';
