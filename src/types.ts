import type { Domain, Effect, EventCallable, Store } from 'effector';
import type { ComponentType, ReactElement, ReactNode } from 'react';

export type TFieldValidator = (data?: {
  value?: any;
  regexp?: RegExp;
  label?: string;
  msg?: string;
}) => (value: any, values?: Record<string, any>) => string | false;

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
    values: Record<string, any>,
  ) => Promise<Record<string, string | null> | void> | void;
  skipClientValidation?: boolean;
}

export interface IFormOnSubmitArgs extends ISubmitArgs {
  values: Record<string, any>;
  errors: Record<string, string | null>;
  valid: boolean;
}

export interface ISubmitResponseSuccess {
  values?: Record<string, any>;
}

export interface ISubmitResponseError {
  errors?: Record<string, string | null>;
  remoteErrors?: Record<string, string | null>;
}

export type IValidationParams =
  | {
      name?: string;
    }
  | undefined;

export interface IFieldConfig {
  /** PROPERTY - name */
  name: string;
  /** PROPERTY - initial value */
  initialValue?: any;
  /** METHOD - parse value before store */
  parse?: (value: any) => any;
  /** METHOD - format value before display */
  format?: (value: any) => any;
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
  initialValues?: Record<string, any>;
  /** PROPERTY - validateOnBlur - will trigger validation on blur */
  validateOnBlur?: boolean;
  /** PROPERTY - validateOnChange - will trigger validation on change */
  validateOnChange?: boolean;
  /** PROPERTY - keepOnUnmount - keep form data on form unmount */
  keepOnUnmount?: boolean;
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

export interface IForm {
  /** PROPERTY - Form name */
  domain: Domain;
  /** PROPERTY - Form name */
  name: string;
  /** $$STORE - Form active fields - all fields statuses - flat */
  $active: Store<Record<string, boolean>>;
  /** $$STORE - Form active only fields - all fields statuses - flat */
  $activeOnly: Store<Record<string, true>>;
  /** $$STORE - Form active values - all active / visible fields values - flat */
  $activeValues: Store<Record<string, any>>;
  /** $$STORE - Form values - all fields values - flat */
  $values: Store<Record<string, any>>;
  /** $$STORE - Form errors - all field errors */
  $errors: Store<Record<string, string[] | null>>;
  /** $$STORE - Form errors - fields last error - flat */
  $error: Store<Record<string, string | null>>;
  /** $$STORE - Form valid - true if form is valid */
  $valid: Store<boolean>;
  /** $$STORE - Form submitting - true if busy */
  $submitting: Store<boolean>;
  /** $$STORE - Form touched - true if touched */
  $touched: Store<boolean>;
  /** $$STORE - Form touches - all fields touches - flat */
  $touches: Store<Record<string, boolean>>;
  /** $$STORE - Form dirty - true if diff from initial value */
  $dirty: Store<boolean>;
  /** $$STORE - Form dirties - all fields dirty state - flat */
  $dirties: Store<Record<string, boolean>>;
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
  setActive: EventCallable<{ name: string; value: any }>;
  /** EVENT - Form update fields values */
  setValues: EventCallable<Record<string, any>>;
  /** EVENT - Form onChange event */
  onChange: EventCallable<{ name: string; value: any }>;
  /** EVENT - Form onBlur event */
  onBlur: EventCallable<{ name: string; value: any }>;
  /** EVENT - Form validate trigger */
  validate: EventCallable<IValidationParams>;
  /** PROP - Form config */
  config: IFormConfig;
  /** METHOD - Set form config */
  setConfig: (cfg: IFormConfig) => void;
  /** PROP - Form config */
  configs: Record<string, IFieldConfig>;
  /** METHOD - Set field config */
  setFieldConfig: (cfg: IFieldConfig) => void;
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
  value: any;
  /** METHOD - send field value on change */
  onChange: (value: any) => void;
  /** METHOD - send field value on blur */
  onBlur: (value: any) => void;
  [any: string]: any;
}

export interface IRFieldProps {
  /** PROPERTY - name */
  name: IFieldConfig['name'];
  /** PROPERTY - initial value */
  initialValue?: any;
  /** METHOD - parse value before store */
  parse?: IFieldConfig['parse'];
  /** METHOD - format value before display */
  format?: IFieldConfig['format'];
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
    values: Record<string, any>,
    activeValues: Record<string, any>,
  ) => boolean;
  /** PROPERTY - setTo set fields on show */
  setTo?: Record<string, any>;
  /** PROPERTY - setTo set fields on hide */
  resetTo?: Record<string, any>;
  /** PROPERTY - form update debounce - 0 */
  updateDebounce?: number;
  /** METHOD - render - accepts form values and return react element */
  render?: (values: Record<string, any>) => ReactElement;
}

export interface IRIfFieldValueProps {
  children?: ReactNode;
  /** PROPERTY - field name to check against */
  field: string;
  /** PROPERTY - form name to check against */
  formName?: string;
  /** METHOD - check - accepts form values and return boolean, if true render children */
  check: (value: any) => boolean;
  /** METHOD - render - accepts values array and return react element */
  render?: (value: any) => ReactElement;
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
