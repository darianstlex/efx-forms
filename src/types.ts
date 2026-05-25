import type { Domain, Effect, EventCallable, Store } from 'effector';
import type { ComponentType, ReactElement, ReactNode } from 'react';

export type IValue = any;
export type IRErrors = Record<string, string[] | null>;
export type IRError = Record<string, string | null>;
export type IRValues = Record<string, IValue>;
export type IRBoolean = Record<string, boolean>;
export type IRTrue = Record<string, true>;
export type IValuePayload = { name: string; value: IValue };
export type IBooleanPayload = { name: string; value: boolean };
export type IErrorsPayload = { name: string; errors: string[] | null };

export type TFieldValidator = (data?: {
  value?: IValue;
  regexp?: RegExp;
  label?: string;
  msg?: string;
}) => (value: IValue, values?: IRValues) => string | false;

export type TFiltered<T, TK> = Pick<
  T,
  { [K in keyof T]: T[K] extends TK ? K : never }[keyof T]
>;
export type TFilteredKeyOf<T, TK> = keyof TFiltered<T, TK>;
export type TFilteredType<T, TK> = Required<T>[TFilteredKeyOf<T, TK>];
export type TExtractStoreTypes<P> = P extends Store<infer T> ? T : never;

export type TFormStores = TFiltered<IForm, Store<any>>;
export type TFormStoreKey = TFilteredKeyOf<IForm, Store<any>>;
export type TFormStore = TFilteredType<IForm, Store<any>>;
export type TFormStoreValue = TExtractStoreTypes<TFormStore>;

export interface ISubmitArgs {
  cb?: (
    values: IRValues,
  ) => Promise<IRErrors | void> | void;
  skipClientValidation?: boolean;
}

export interface IFormOnSubmitArgs extends ISubmitArgs {
  values: IRValues;
  errors: IRErrors;
  valid: boolean;
}

export interface ISubmitResponseSuccess {
  values?: IRValues;
}

export interface ISubmitResponseError {
  errors?: IRErrors;
  remoteErrors?: IRErrors;
}

export type IValidationParams =
  | {
      name?: string;
      ignoreSkipClientValidation?: boolean;
    }
  | undefined;

export interface IFieldConfig {
  /** PROPERTY - name */
  name: string;
  /** PROPERTY - initial value */
  initialValue?: IValue;
  /** METHOD - parse value before store */
  parse?: (value: IValue) => IValue;
  /** METHOD - format value before display */
  format?: (value: IValue) => IValue;
  /** PROPERTY - skip field register / config update */
  passive?: boolean;
  /** PROPERTY - field validators object */
  validators?: ReturnType<TFieldValidator>[];
  /** PROPERTY - validateOnBlur - will trigger validation on blur */
  validateOnBlur?: boolean;
  /** PROPERTY - validateOnChange - will trigger validation on change */
  validateOnChange?: boolean;
  /**
   * PROPERTY - disableFieldReinit - if true will skip field update
   * on initialValue changes if field is not touched
   */
  disableFieldReinit?: boolean;
}

export interface IFormConfig {
  /** PROPERTY - name */
  name: string;
  /** PROPERTY - initial values - flat */
  initialValues?: IRValues;
  /** PROPERTY - validateOnBlur - will trigger validation on blur */
  validateOnBlur?: boolean;
  /** PROPERTY - validateOnChange - will trigger validation on change */
  validateOnChange?: boolean;
  /** PROPERTY - keepOnUnmount - keep form data on form unmount */
  keepOnUnmount?: boolean;
  /** PROPERTY - serialize forms stores, default false */
  serialize?: boolean;
  /** PROPERTY - skipClientValidation - if true will skip validation on submit */
  skipClientValidation?: boolean;
  /**
   * PROPERTY - disableFieldsReinit - if true will skip fields update
   * on initialValue changes if field is not touched
   */
  disableFieldsReinit?: boolean;
  /** PROPERTY - onSubmit - submit callback */
  onSubmit?: ISubmitArgs['cb'];
  /** PROPERTY - field validators object */
  validators?: Record<string, ReturnType<TFieldValidator>[]>;
}

export type TCommonConfigKeys = 'validateOnBlur' | 'validateOnChange'

export interface IForm {
  /** PROPERTY - Form name */
  domain: Domain;
  /** PROPERTY - Form name */
  name: string;
  /** $$STORE - Form active fields - all fields statuses - flat */
  $active: Store<IRBoolean>;
  /** $$STORE - Form active only fields - all fields statuses - flat */
  $activeOnly: Store<IRTrue>;
  /** $$STORE - Form active values - all active / visible fields values - flat */
  $activeValues: Store<IRValues>;
  /** $$STORE - Form values - all fields values - flat */
  $values: Store<IRValues>;
  /** $$STORE - Form errors - all field errors */
  $errors: Store<IRErrors>;
  /** $$STORE - Form errors - fields last error - flat */
  $error: Store<IRError>;
  /** $$STORE - Form valid - true if form is valid */
  $valid: Store<boolean>;
  /** $$STORE - Form submitting - true if busy */
  $submitting: Store<boolean>;
  /** $$STORE - Form touched - true if touched */
  $touched: Store<boolean>;
  /** $$STORE - Form touches - all fields touches - flat */
  $touches: Store<IRBoolean>;
  /** $$STORE - Form dirty - true if diff from initial value */
  $dirty: Store<boolean>;
  /** $$STORE - Form dirties - all fields dirty state - flat */
  $dirties: Store<IRBoolean>;
  /** $$STORE - Form config - reactive form config */
  $formConfig: Store<IFormConfig>;
  /** $$STORE - Fields config - reactive fields config */
  $fieldsConfig: Store<Record<string, IFieldConfig>>;
  /** EVENT - Form reset - resets form to initial values */
  reset: EventCallable<void>;
  /** EVENT - Field reset - resets field to initial value */
  resetField: EventCallable<string>;
  /** EVENT - Reset untouched fields to initial values */
  resetUntouched: EventCallable<string[]>;
  /** EVENT - Form erase - reset form and delete all assigned form data */
  erase: EventCallable<void>;
  /**
   * EFFECT - Form submit - callback will be called with form values if form is valid
   * or if callback returns promise reject with errors, will highlight them in the form
   */
  submit: Effect<ISubmitArgs, ISubmitResponseSuccess, ISubmitResponseError>;
  /** EVENT - Set form config */
  setActive: EventCallable<IValuePayload>;
  /** EVENT - Form update fields values */
  setValues: EventCallable<IRValues>;
  /** EVENT - Form merge errors */
  setErrors: EventCallable<IRErrors>
  /** EVENT - Form replace errors */
  replaceErrors: EventCallable<IRErrors>
  /** EVENT - Form onChange event */
  onChange: EventCallable<IValuePayload>;
  /** EVENT - Form onBlur event */
  onBlur: EventCallable<IValuePayload>;
  /** EVENT - Form validate trigger */
  validate: EventCallable<IValidationParams>;
  /** PROP - Form config */
  config: IFormConfig;
  /** METHOD - Set form config */
  setConfig: EventCallable<IFormConfig>;
  /** PROP - Form config */
  configs: Record<string, IFieldConfig>;
  /** METHOD - Set field config */
  setFieldConfig: EventCallable<IFieldConfig>;
}

export interface IFormData {
  config: IFormConfig;
  configs: Record<string, IFieldConfig>;
}

export interface IForms {
  [name: string]: IForm;
}

export interface IRFormProps extends IFormConfig {
  children?: ReactNode;
  /** METHOD - submit - will trigger submit based on remoteValidation property */
  onSubmit?: IFormConfig['onSubmit'];
  /** PROPERTY - skipClientValidation - if true will skip validation on submit */
  skipClientValidation?: IFormConfig['skipClientValidation'];
  /** PROPERTY - object of validators per field */
  validators?: IFormConfig['validators'];
  /** PROPERTY - keepOnUnmount - keep form data on form unmount */
  keepOnUnmount?: IFormConfig['keepOnUnmount'];
  [any: string]: any;
}

export interface IFieldProps {
  /** PROPERTY - field error */
  error: string | null;
  /** PROPERTY - field errors list */
  errors: string[];
  /** PROPERTY - field name */
  name: string;
  /** PROPERTY - field value */
  value: IValue;
  /** METHOD - send field value on change */
  onChange: (value: IValue) => void;
  /** METHOD - send field value on blur */
  onBlur: (value: IValue) => void;
  [any: string]: any;
}

export interface IRFieldProps {
  /** PROPERTY - name */
  name: IFieldConfig['name'];
  /** PROPERTY - initial value */
  initialValue?: IValue;
  /** METHOD - parse value before store */
  parse?: IFieldConfig['parse'];
  /** METHOD - format value before display */
  format?: IFieldConfig['format'];
  /** PROPERTY - skip field register / config update */
  passive?: IFieldConfig['passive'];
  /** PROPERTY - validators - array of functions / validators */
  validators?: IFieldConfig['validators'];
  /** PROPERTY - validateOnBlur - will trigger validation on blur */
  validateOnBlur?: IFieldConfig['validateOnBlur'];
  /** PROPERTY - validateOnChange - will trigger validation on change */
  validateOnChange?: IFieldConfig['validateOnChange'];
  /** PROPERTY - disableFieldReinit - disable reinit on initialValue change */
  disableFieldReinit?: IFieldConfig['disableFieldReinit'];
  /** PROPERTY - component - to be rendered */
  Field: ComponentType<any>;
  /** PROPERTY - to assign field to the specific form if outside of form context */
  formName?: string;
  [any: string]: any;
}

export interface IRIfFormValuesProps {
  children?: ReactNode;
  /** PROPERTY - form name to check against */
  form?: string;
  /** METHOD - check - accepts form values and return boolean, if true render children */
  check: (
    values: IRValues,
    activeValues: IRValues,
  ) => boolean;
  /** PROPERTY - setTo set fields on show */
  setTo?: IRValues;
  /** PROPERTY - setTo set fields on hide */
  resetTo?: IRValues;
  /** PROPERTY - form update debounce - 0 */
  updateDebounce?: number;
  /** METHOD - render - accepts form values and return react element */
  render?: (values: IRValues) => ReactElement;
}

export interface IRIfFieldValueProps {
  children?: ReactNode;
  /** PROPERTY - field name to check against */
  field: string;
  /** PROPERTY - form name to check against */
  formName?: string;
  /** METHOD - check - accepts form values and return boolean, if true render children */
  check: (value: IValue) => boolean;
  /** METHOD - render - accepts values array and return react element */
  render?: (value: IValue) => ReactElement;
}

export interface IRFormDataProviderProps {
  /** render function - args are subscribed stores in array */
  children: (values: any) => ReactElement;
  /** PROPERTY - form name to get data from */
  name?: string;
}

export interface IRFieldDataProviderProps {
  /** render function - args are the form data */
  children: (values: any) => ReactElement;
  /** PROPERTY - field name to get data from */
  name: string;
  /** PROPERTY - form name to get data from */
  formName?: string;
}
