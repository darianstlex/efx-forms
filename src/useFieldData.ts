import { useStoreMap } from 'effector-react';

import { useFormInstance } from './useFormInstance';

/**
 * Return field data belongs to the current or provided form
 */
export const useFieldData = (name: string, formName?: string) => {
  const form = useFormInstance(formName);
  return {
    value: useStoreMap(form.$values, (it) => it[name]),
    active: useStoreMap(form.$active, (it) => it[name]),
    dirty: useStoreMap(form.$dirties, (it) => it[name]),
    error: useStoreMap(form.$error, (it) => it[name]),
    errors: useStoreMap(form.$errors, (it) => it[name]),
  };
};
