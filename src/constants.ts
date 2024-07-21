import type { IFieldConfig, IFormConfig } from './types';
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
};

export const FIELD_CONFIG: IFieldConfig = {
  name: 'default',
  parse: (value) => value,
  format: (value) => value,
  validators: undefined,
  initialValue: undefined,
  validateOnBlur: true,
  validateOnChange: false,
};

export const ARR_0 = Object.freeze([]);
export const OBJ_0 = Object.freeze({});

export const $null = domain.store<any>(null, { name: '$null' });
