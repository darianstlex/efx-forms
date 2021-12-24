import React from 'react';
import { IForm, REfxFieldProps, REfxFormProps } from './model';
export declare const FormNameContext: React.Context<string>;
export declare const REfxForm: {
    ({ children, onSubmit, name, remoteValidation, skipClientValidation, initialValues, validateOnBlur, validateOnChange, validations, }: REfxFormProps): JSX.Element;
    displayName: string;
};
/**
 * Return parent or requested form instance
 */
export declare const useForm: (name?: string | undefined) => IForm;
export declare const REfxField: {
    ({ Field, name, formName, ...rest }: REfxFieldProps): JSX.Element;
    displayName: string;
};
