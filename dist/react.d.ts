/// <reference types="react" />
import { REfxFieldProps, REfxFormProps } from './model';
export declare const REfxForm: {
    ({ children, onSubmit, remoteValidation, skipClientValidation, name, initialValues, validateOnBlur, validateOnChange, }: REfxFormProps): JSX.Element;
    displayName: string;
};
export declare const REfxField: {
    ({ Field, form, name, formConfig: { initialValues, ...formConfig }, initialValue, parse, format, validators, validateOnBlur, validateOnChange, ...props }: REfxFieldProps): JSX.Element;
    displayName: string;
};
