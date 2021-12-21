import { Effect, Event, Store } from 'effector';
import { ComponentType, ReactNode } from 'react';

export type TFieldValue = string | number | null | boolean;
export type TValidator = (value: any) => string | false
export type TErrors = { [name: string]: string };

export interface IFormSubmitResponseError {
  errors?: TErrors;
  remoteErrors?: TErrors;
}

export interface IFieldConfig {
  name: string;
  initialValue: TFieldValue;
  parse: (value: TFieldValue) => TFieldValue,
  format: (value: TFieldValue) => TFieldValue,
  validators: TValidator[],
  validateOnBlur: boolean;
  validateOnChange: boolean;
}

export interface IField {
  $value: Store<TFieldValue>;
  $touched: Store<boolean>;
  $errors: Store<string[]>;
  onChange: Event<any>;
  onBlur: Event<void>;
  update: Event<TFieldValue>;
  reset: Event<void>;
  validate: Event<void>;
  setError: Event<string>;
  resetError: Event<void>;
  syncData: () => void;
  config: Omit<IFieldConfig, 'format'>;
}

export interface IFormHooks {
  formChange: Event<IFormValueUpdate>;
  resetField: Event<void>;
  updateValidation: Event<IFormValidationUpdate>;
  updateTouch: Event<IFormToucheUpdate>;
  updateValue: Event<IFormValueUpdate>;
  setRemoteErrors: Event<IFormSubmitResponseError>;
}

export interface IFormInitialValues {
  [name: string]: TFieldValue;
}

export interface IFormConfigDefault {
  name: string;
  initialValues: IFormInitialValues,
  validateOnBlur: boolean;
  validateOnChange: boolean;
}

export interface IFormConfig {
  name: string;
  initialValues?: IFormInitialValues,
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
}

export interface IFormSubmitCallbackArgs {
  shapedTruthyValues: object;
  shapedValues: object;
  truthyValues: IFormValues;
  values: IFormValues;
}

export interface IFormSubmitArgs {
  cb: (values: IFormSubmitCallbackArgs) => void;
  skipClientValidation?: boolean;
}

export interface IFormValidations {
  [name: string]: boolean;
}

export interface IFormValidationUpdate {
  name: string;
  valid: boolean;
}

export interface IFormTouches {
  [name: string]: boolean;
}

export interface IFormToucheUpdate {
  name: string;
  touched: boolean;
}

export interface IFormValues {
  [name: string]: TFieldValue;
}

export interface IFormValueUpdate {
  name: string;
  value: TFieldValue;
}

export interface IFormOnFieldChange {
  name: string;
  value: TFieldValue;
}

export interface IFormFields {
  [name: string]: IField
}

export interface IForm {
  $changes: Store<IFormValues>;
  $shapedValues: Store<object>;
  $shapedTruthyValues: Store<object>;
  $submitting: Store<boolean>;
  $touched: Store<boolean>;
  $touches: Store<IFormTouches>;
  $truthyValues: Store<IFormValues>;
  $valid: Store<boolean>;
  $values: Store<IFormValues>;
  $validations: Store<IFormValidations>
  name: string;
  reset: Event<void>;
  submit: (args: IFormSubmitArgs) => void;
  submitRemote: Effect<IFormSubmitArgs, void, IFormSubmitResponseError>;
  config: IFormConfig;
  fields: IFormFields;
  getField: (name: string) => IField;
  registerField: (config: Omit<IFieldConfig, 'format'>) => IField;
  removeField: (name: string) => void;
}

export interface IForms {
  [name: string]: IForm;
}

export interface REfxFormProps extends IFormConfig {
  children?: ReactNode;
  onSubmit?: IFormSubmitArgs['cb'];
  remoteValidation?: boolean;
  skipClientValidation?: boolean;
}

export interface REfxFieldProps {
  name: IFieldConfig['name'];
  initialValue?: TFieldValue;
  parse?: IFieldConfig['parse'];
  format?: IFieldConfig['format'];
  validators?: IFieldConfig['validators'];
  validateOnBlur?: IFieldConfig['validateOnBlur'];
  validateOnChange?: IFieldConfig['validateOnChange'];
  Field: ComponentType<any>;
  form?: IForm;
  formConfig?: Omit<IFormConfig, 'name'>;
  [any: string]: any;
}
