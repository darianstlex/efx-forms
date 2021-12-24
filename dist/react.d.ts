import React from 'react';
import { IField, IForm, REfxFieldProps, REfxFormProps } from './model';
export declare const FormNameContext: React.Context<string>;
/**
 * Return parent or requested form instance
 */
export declare const useForm: (name?: string | undefined) => IForm;
/**
 * Return field instance belongs to the current or given form
 */
export declare const useField: (name: string, formName?: string | undefined) => IField;
export declare const REfxForm: {
    ({ children, onSubmit, name, remoteValidation, skipClientValidation, initialValues, validateOnBlur, validateOnChange, validations, }: REfxFormProps): JSX.Element;
    displayName: string;
};
export declare const REfxField: {
    ({ Field, name, formName, ...rest }: REfxFieldProps): JSX.Element;
    displayName: string;
};
