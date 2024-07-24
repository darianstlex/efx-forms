import { useFieldStore } from './useFieldStore';

/**
 * Return field data belongs to the current or provided form
 */
export const useFieldData = (name: string, formName?: string) => {
  return {
    value: useFieldStore({ store: '$values', formName, name }),
    active: useFieldStore({ store: '$active', formName, name }),
    dirty: useFieldStore({ store: '$dirties', formName, name }),
    error: useFieldStore({ store: '$error', formName, name }),
    errors: useFieldStore({ store: '$errors', formName, name }),
  };
};
