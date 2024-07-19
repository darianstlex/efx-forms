import { useUnit } from 'effector-react';

import { useFormInstance } from './useFormInstance';

/**
 * Return form values - flat
 */
export const useFormValues = (formName?: string): Record<string, any> => {
  const { $values } = useFormInstance(formName);
  return useUnit($values);
};
