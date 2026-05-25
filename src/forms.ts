import type { IFormConfig, IForms } from './types';
import { createFormHandler } from './form';

export const forms: IForms = {};

/**
 * Create/get form instance
 */
export const getForm = (name: IFormConfig['name']) => {
  if (!forms[name]) {
    forms[name] = createFormHandler({ name });
  }
  return forms[name];
};
