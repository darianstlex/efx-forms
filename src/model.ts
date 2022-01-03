import { Domain, Effect, Event, Store } from 'effector';
import { ComponentType, ReactElement, ReactNode } from 'react';

export type TFieldValue = string | number | null | boolean | [] | {};
export type TFieldValidator = (value: any) => string | false;

type TFiltered<T, TK> = Pick<T, { [K in keyof T]: T[K] extends TK ? K : never }[keyof T]>;
type TFilteredKeyOf<T, TK> = keyof TFiltered<T, TK>;
type TFilteredType<T, TK> = Required<T>[TFilteredKeyOf<T, TK>];
type TExtractStoreTypes<P> = P extends Store<infer T> ? T : never;

export type TFormStores = TFiltered<IForm, Store<any>>;
export type TFormStoreKey = TFilteredKeyOf<IForm, Store<any>>;
export type TFormStore = TFilteredType<IForm, Store<any>>;
export type TFormStoreValue = TExtractStoreTypes<TFormStore>;

export type TFieldStores = TFiltered<IField, Store<any>>;
export type TFieldStoreKey = TFilteredKeyOf<IField, Store<any>>;
export type TFieldStore = TFilteredType<IField, Store<any>>;
export type TFieldStoreValue = TExtractStoreTypes<TFieldStore>;

export interface IFieldConfig {
  name: string;
  initialValue: TFieldValue;
  parse: (value: any) => TFieldValue;
  format: (value: TFieldValue) => any;
  validators: TFieldValidator[];
  validateOnBlur: boolean;
  validateOnChange: boolean;
}

export interface IField {
  /** PROPERTY - Field name */
  name: string;
  /** PROPERTY - Field active / visible */
  active: boolean;
  /** $$STORE - Field active / mounted */
  $active: Store<boolean>;
  /** $$STORE - Field value */
  $value: Store<TFieldValue>;
  /** $$STORE - Field touched state */
  $touched: Store<boolean>;
  /** $$STORE - Field dirty state */
  $dirty: Store<boolean>;
  /** $$STORE - Field error messages on validation */
  $errors: Store<string[]>;
  /** EVENT - Field onChange */
  onChange: Event<any>;
  /** EVENT - Field onBlur */
  onBlur: Event<void>;
  /** EVENT - Field update - updates field value without triggering change event */
  update: Event<TFieldValue>;
  /** EVENT - Field reset - if field is touched or not valid */
  reset: Event<void>;
  /** EVENT - Field validate - runs field validation */
  validate: Event<void>;
  /** EVENT - Field setActive - set field activity / visibility */
  setActive: Event<boolean>;
  /** EVENT - Field setError - set provided field error */
  setError: Event<string>;
  /** EVENT - Field reset errors */
  resetError: Event<void>;
  /** METHOD - internal use */
  syncData: () => void;
  /** DATA - Field config - get/set field config */
  config: Omit<IFieldConfig, 'format'>;
}

export interface IFormSubmitArgs {
  cb: (values: IFormValues) => Promise<IFormErrors | void> | void;
  skipClientValidation?: boolean;
}

export interface IFormOnSubmitArgs extends IFormSubmitArgs {
  values: IFormValues;
  errors: IFormErrors;
  valid: boolean;
}

export interface IFormSubmitResponseSuccess {
  values?: IFormValues;
}

export interface IFormSubmitResponseError {
  errors?: IFormErrors;
  remoteErrors?: IFormErrors;
}

export interface IFormHooks {
  formDomain: Domain;
  onFormSubmit: Event<IFormSubmitArgs>;
  onFormUpdate: Event<IFormValues>;
  onFormReset: Event<void>;
  onFormErrors: Event<IFormErrors>;
  setFormChange: Event<IFormValueUpdate>;
  setFormActive: Event<IFormActiveUpdate>;
  setFormError: Event<IFormErrorUpdate>;
  setFormDirty: Event<IFormDirtyUpdate>;
  setFormTouch: Event<IFormToucheUpdate>;
  setFormValue: Event<IFormValueUpdate>;
}

export interface IFormInitialValues {
  [name: string]: TFieldValue;
}

export interface IFormConfigDefault {
  name: string;
  initialValues: IFormInitialValues,
  onSubmit: IFormSubmitArgs['cb'];
  keepOnUnmount: boolean;
  skipClientValidation: boolean;
  validateOnBlur: boolean;
  validateOnChange: boolean;
  validators: IFormValidators;
}

export interface IFormConfig {
  /** PROPERTY - name */
  name: IFormConfigDefault['name'];
  /** PROPERTY - initial values - flat */
  initialValues?: IFormConfigDefault['initialValues'],
  /** PROPERTY - validateOnBlur - will trigger validation on blur */
  validateOnBlur?: IFormConfigDefault['validateOnBlur'];
  /** PROPERTY - validateOnChange - will trigger validation on change */
  validateOnChange?: IFormConfigDefault['validateOnChange'];
  /** PROPERTY - formValidations array of validators per field */
  formValidators?: IFormConfigDefault['validators'];
  /** PROPERTY - keepOnUnmount - keep form data on form unmount */
  keepOnUnmount?: IFormConfigDefault['keepOnUnmount'];
  /** PROPERTY - skipClientValidation - if true will skip validation on submit */
  skipClientValidation?: IFormConfigDefault['skipClientValidation'];
}

export interface IFormErrors {
  [name: string]: string | null;
}

export interface IFormErrorUpdate {
  name: string;
  error: string | null;
}

export interface IFormTouches {
  [name: string]: boolean;
}

export interface IFormToucheUpdate {
  name: string;
  touched: boolean;
}

export interface IFormDirties {
  [name: string]: boolean;
}

export interface IFormDirtyUpdate {
  name: string;
  dirty: boolean;
}

export interface IFormActive {
  [name: string]: boolean;
}

export interface IFormActiveUpdate {
  name: string;
  active: boolean;
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

export interface IFormValidators {
  [name: string]: TFieldValidator[];
}

export interface IFormFields {
  [name: string]: IField;
}

export interface IForm {
  /** PROPERTY - Form name */
  name: string;
  /** $$STORE - Form active fields - all fields statuses - flat */
  $active: Store<IFormActive>;
  /** $$STORE - Form active values - all active / visible fields values - flat */
  $actives: Store<IFormValues>;
  /** $$STORE - Form values - all fields values on field onChange event - flat */
  $changes: Store<IFormValues>;
  /** $$STORE - Form values - all fields values - flat */
  $values: Store<IFormValues>;
  /** $$STORE - Form errors - all fields errors - flat */
  $errors: Store<IFormErrors>;
  /** $$STORE - Form valid - true if form is valid */
  $valid: Store<boolean>;
  /** $$STORE - Form submitting - true if busy */
  $submitting: Store<boolean>;
  /** $$STORE - Form touched - true if touched */
  $touched: Store<boolean>;
  /** $$STORE - Form touches - all fields touches - flat */
  $touches: Store<IFormTouches>;
  /** $$STORE - Form dirty - true if diff from initial value */
  $dirty: Store<boolean>;
  /** $$STORE - Form dirties - all fields dirty state - flat */
  $dirties: Store<IFormDirties>;
  /** EVENT - Form reset - resets form and all fields */
  reset: Event<void>;
  /**
   * EFFECT - Form submit - callback will be called with form values if form is valid
   * or if callback returns promise reject with errors, will highlight them in the form
   */
  submit: Effect<IFormSubmitArgs, IFormSubmitResponseSuccess, IFormSubmitResponseError>;
  /** DATA - Form config - get/set field config */
  config: IFormConfig;
  /** DATA - Form fields getter */
  fields: IFormFields;
  /** METHOD - Form get field - return field by name */
  getField: (name: string) => IField;
  /** METHOD - Form register field */
  registerField: (config: Omit<IFieldConfig, 'format'>) => IField;
  /** EVENT - Form update fields values */
  update: Event<IFormValues>;
}

export interface IForms {
  [name: string]: IForm;
}

export interface IRFormProps extends Omit<IFormConfig, 'formValidations'> {
  children?: ReactNode;
  /** METHOD - submit - will trigger submit based on remoteValidation property */
  onSubmit?: IFormSubmitArgs['cb'];
  /** PROPERTY - skipClientValidation - if true will skip validation on submit */
  skipClientValidation?: IFormConfigDefault['skipClientValidation'];
  /** PROPERTY - object of validators per field */
  validators?: IFormValidators;
  /** PROPERTY - keepOnUnmount - keep form data on form unmount */
  keepOnUnmount?: IFormConfigDefault['keepOnUnmount'];
  [any: string]: any;
}

export interface IRFieldProps {
  /** PROPERTY - name */
  name: IFieldConfig['name'];
  /** PROPERTY - initial value */
  initialValue?: TFieldValue;
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
  check: (values: IFormValues) => boolean;
  /** PROPERTY - setTo set fields on show */
  setTo?: IFormValues;
  /** PROPERTY - setTo set fields on hide */
  resetTo?: IFormValues;
  /** PROPERTY - form update debounce - 0 */
  updateDebounce?: number;
  /** METHOD - render - accepts form values and return react element */
  render?: (values: IFormValues) => ReactElement;
}

export interface IRIfFieldsValueProps {
  children?: ReactNode;
  /** PROPERTY - fields name array to check against */
  fields: string[];
  /** PROPERTY - form name to check against */
  formName?: string;
  /** METHOD - check - accepts form values and return boolean, if true render children */
  check: (values: any[]) => boolean;
  /** METHOD - render - accepts values array and return react element */
  render?: (values: any[]) => ReactElement;
}

export interface IRFormDataProviderProps {
  /** render function - args are subscribed stores in array */
  children: (values: any[]) => ReactNode;
  /** PROPERTY - form name to get data from */
  name?: string;
  /** PROPERTY - stores array - string - ['$values', '$errors'] */
  stores: TFormStoreKey[];
}

export interface IRFieldDataProviderProps {
  /** render function - args are subscribed stores in array */
  children: (values: any[]) => ReactNode;
  /** PROPERTY - field name to get data from */
  name: string;
  /** PROPERTY - form name to get data from */
  formName?: string;
  /** PROPERTY - stores array - string - ['$value', '$errors'] */
  stores: TFieldStoreKey[];
}

export interface IRFieldsValueProviderProps {
  /** render function - args are subscribed stores values in array */
  children: (values: any[]) => ReactNode;
  /** PROPERTY - form name to get fields from */
  formName?: string;
  /** PROPERTY - fields array - string - ['user.name', 'user.age'] */
  fields: string[];
}
