import { Effect, Event, Store } from 'effector';
import { ComponentType, ReactNode } from 'react';
export declare type TFieldValue = string | number | null | boolean;
export declare type TFieldValidator = (value: any) => string | false;
export declare type TFormErrors = {
    [name: string]: string;
};
export interface IFormSubmitResponseError {
    errors?: TFormErrors;
    remoteErrors?: TFormErrors;
}
export interface IFieldConfig {
    name: string;
    initialValue: TFieldValue;
    parse: (value: TFieldValue) => TFieldValue;
    format: (value: TFieldValue) => TFieldValue;
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
    /** $$STORE - Field touched */
    $touched: Store<boolean>;
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
export interface IFormHooks {
    formChange: Event<IFormValueUpdate>;
    resetField: Event<void>;
    updateActive: Event<IFormActiveUpdate>;
    updateError: Event<IFormErrorUpdate>;
    updateTouch: Event<IFormToucheUpdate>;
    updateValue: Event<IFormValueUpdate>;
    setRemoteErrors: Event<IFormSubmitResponseError>;
}
export interface IFormInitialValues {
    [name: string]: TFieldValue;
}
export interface IFormConfigDefault {
    name: string;
    initialValues: IFormInitialValues;
    onSubmit: IFormSubmitArgs['cb'];
    remoteValidation: boolean;
    skipClientValidation: boolean;
    validateOnBlur: boolean;
    validateOnChange: boolean;
    validations: IFormValidations;
}
export interface IFormConfig {
    /** PROPERTY - name */
    name: string;
    /** PROPERTY - initial values - flat */
    initialValues?: IFormInitialValues;
    /** PROPERTY - validateOnBlur - will trigger validation on blur */
    validateOnBlur?: boolean;
    /** PROPERTY - validateOnChange - will trigger validation on change */
    validateOnChange?: boolean;
    /** PROPERTY - formValidations array of validators per field */
    formValidations?: IFormValidations;
}
export interface IFormSubmitArgs {
    cb: (values: IFormValues) => void;
    skipClientValidation?: boolean;
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
export interface IFormValidations {
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
    /** EVENT - Form reset - resets form and all fields */
    reset: Event<void>;
    /** METHOD - Form submit - callback will be called with form values if form is valid - sync */
    submit: (args: IFormSubmitArgs) => void;
    /** EFFECT - Form submit - callback will be called with form values to get remote validation */
    submitRemote: Effect<IFormSubmitArgs, void, IFormSubmitResponseError>;
    /** DATA - Form config - get/set field config */
    config: IFormConfig;
    /** DATA - Form fields getter */
    fields: IFormFields;
    /** METHOD - Form get field - return field by name */
    getField: (name: string) => IField;
    /** METHOD - Form register field */
    registerField: (config: Omit<IFieldConfig, 'format'>) => IField;
    /** METHOD - Form remove field - delete field by name */
    removeField: (name: string) => void;
}
export interface IForms {
    [name: string]: IForm;
}
export interface REfxFormProps extends Omit<IFormConfig, 'formValidations'> {
    children?: ReactNode;
    /** METHOD - submit - will trigger submit based on remoteValidation property */
    onSubmit?: IFormSubmitArgs['cb'];
    /** PROPERTY - remoteValidation - if true will call remote submit */
    remoteValidation?: boolean;
    /** PROPERTY - skipClientValidation - if true will skip validation on submit */
    skipClientValidation?: boolean;
    /** PROPERTY - validations array of validators per field */
    validations?: IFormValidations;
}
export interface REfxFieldProps {
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
    /** PROPERTY - internal use */
    form?: IForm;
    /** PROPERTY - internal use */
    formConfig?: Omit<IFormConfig, 'name'>;
    [any: string]: any;
}
