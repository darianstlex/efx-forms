import type { IFieldConfig, IFormConfig, IValue } from './types';
import { domain } from './utils';

export const FORM_CONFIG: IFormConfig = {
  name: 'default',
  initialValues: {},
  onSubmit: () => {},
  keepOnUnmount: false,
  skipClientValidation: false,
  validateOnBlur: true,
  validateOnChange: false,
  disableFieldsReinit: false,
  validators: {},
  serialize: false,
};

export const FIELD_CONFIG: IFieldConfig = {
  name: 'default',
  parse: (value: IValue): IValue => value,
  format: (value: IValue): IValue => value,
  validators: undefined,
  initialValue: undefined,
  validateOnBlur: true,
  validateOnChange: false,
};

export const $null = domain.store<any>(null, { name: '$null', sid: '$efx-forms-null' });
