import { useFieldStore } from './useFieldStore';

interface Result {
  value: any;
  active: boolean;
  dirty: boolean;
  error: string | null;
  errors: string[] | null;
}

/**
 * Return field data belongs to the current or provided form
 */
export const useFieldData = (name: string, formName?: string): Result => {
  return {
    value: useFieldStore({ store: '$values', formName, name }),
    active: useFieldStore({ store: '$active', formName, name, defaultValue: false }),
    dirty: useFieldStore({ store: '$dirties', formName, name, defaultValue: false }),
    error: useFieldStore({ store: '$error', formName, name, defaultValue: null }),
    errors: useFieldStore({ store: '$errors', formName, name, defaultValue: null }),
  };
};
