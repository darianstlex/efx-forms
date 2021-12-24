import { IField, IFieldConfig, IFormHooks } from './model';
export declare const fieldConfigDefault: Omit<IFieldConfig, 'name'>;
export declare const createField: ({ name, ...fieldConfig }: Omit<IFieldConfig, 'format'>, { formChange, resetField, updateActive, updateError, updateTouch, updateValue, setRemoteErrors, }: IFormHooks) => IField;
