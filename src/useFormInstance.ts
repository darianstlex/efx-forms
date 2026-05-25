import type { IForm } from './types';
import { useFormName } from './context';
import { getForm } from './forms';

/**
 * Return parent or requested form instance
 */
export const useFormInstance = (name?: string): IForm => {
  const formName = useFormName();
  return getForm(name || formName);
};
