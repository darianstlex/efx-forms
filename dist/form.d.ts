import { IFormConfig, IForms, IForm, IFormConfigDefault } from './model';
export declare const formConfigDefault: IFormConfigDefault;
export declare const forms: IForms;
/**
 * Create/return form with the given name/config
 */
export declare const createForm: (config: IFormConfig) => IForm;
/**
 * Return form with given name or create new one if it doesn't exist
 */
export declare const getForm: (name?: string) => IForm;
