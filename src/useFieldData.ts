import { useFormInstance } from './useFormInstance';
import { useStoreProp } from './useStoreProp';

/**
 * Return field data belongs to the current or provided form
 */
export const useFieldData = (name: string, formName?: string) => {
  const form = useFormInstance(formName);
  return {
    value: useStoreProp(form.$values, name),
    active: useStoreProp(form.$active, name, true),
    dirty: useStoreProp(form.$dirties, name, false),
    error: useStoreProp(form.$error, name, null),
    errors: useStoreProp(form.$errors, name, null),
  };
};
