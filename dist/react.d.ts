import React from 'react';
import { IField, IForm, IFormValues, REfxFieldProps, REfxFormProps, REfxWhenProps, TFieldValue } from './model';
export declare const FormNameContext: React.Context<string>;
/**
 * Return parent or requested form instance
 */
export declare const useForm: (name?: string | undefined) => IForm;
/**
 * Return form values - flat
 */
export declare const useFormValues: (name?: string | undefined) => IFormValues;
/**
 * Return field instance belongs to the current or provided form
 */
export declare const useField: (name: string, formName?: string | undefined) => IField;
/**
 * Return field value of the current or provided form
 */
export declare const useFieldValue: (name: string, formName?: string | undefined) => TFieldValue;
export declare const REfxForm: {
    ({ children, onSubmit, name, remoteValidation, skipClientValidation, initialValues, validateOnBlur, validateOnChange, validations, }: REfxFormProps): JSX.Element;
    displayName: string;
};
export declare const REfxField: {
    ({ Field, name, formName, ...rest }: REfxFieldProps): JSX.Element;
    displayName: string;
};
/**
 * Conditional rendering based on form values
 */
export declare const REfxWhen: {
    ({ children, check, form, setTo, resetTo, updateDebounce }: REfxWhenProps): React.ReactElement<any, string | React.JSXElementConstructor<any>> | null;
    displayName: string;
};
