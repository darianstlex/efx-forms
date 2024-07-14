import type { IForm, IForms } from './types';
import { useFormName } from './context';
import { getForm } from './forms';

export const forms: IForms = {};

/**
 * Return parent or requested form instance
 */
export const useFormInstance = (name?: string): IForm => {
  const formName = useFormName();
  return getForm({ name: name || formName });
};
