import { useUnit } from 'effector-react';

import { useFormInstance } from './useFormInstance';
import type { IRValues } from './types';

/**
 * Return form values - flat
 */
export const useFormValues = (formName?: string): IRValues => {
  const { $values } = useFormInstance(formName);
  return useUnit($values);
};
