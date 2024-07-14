import { useUnit } from 'effector-react';

import type { IFormValues } from './types';
import { useFormInstance } from './useFormInstance';

/**
 * Return form values - flat
 */
export const useFormValues = (formName?: string): IFormValues => {
  const { $values } = useFormInstance(formName);
  return useUnit($values);
};
