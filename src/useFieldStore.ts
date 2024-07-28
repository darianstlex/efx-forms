import { useCallback, useEffect, useState } from 'react';
import { createWatch, type UnitValue } from 'effector';
import { useProvidedScope } from 'effector-react';

import { useFormInstance } from './useFormInstance';
import type { IForm, TFormStoreKey } from './types';

type TFieldStore = Extract<
  TFormStoreKey,
  | '$active'
  | '$activeOnly'
  | '$activeValues'
  | '$values'
  | '$errors'
  | '$error'
  | '$touches'
  | '$dirties'
>;

interface UseFieldStoreProps {
  store: TFieldStore;
  name: string;
  formName?: string;
  defaultValue?: any;
}

export const useFieldStore = <T extends UseFieldStoreProps>({
  store,
  name,
  formName,
  defaultValue,
}: T) => {
  const scope = useProvidedScope();
  const form = useFormInstance(formName);
  const [value, setValue] = useState(defaultValue);

  const updateValue = useCallback((values?: Record<string, any>) => {
    const newValue = values?.[name] !== undefined ? values[name] : defaultValue;
    newValue !== value && setValue(newValue);
  }, [defaultValue, name, value]);

  useEffect(() => {
    updateValue(scope?.getState(form[store]));
    const unwatch = createWatch({
      unit: form[store],
      scope: scope || undefined,
      fn: (values) => {
        updateValue(values);
      },
    });

    return () => {
      unwatch();
    };
  }, [form, scope, store, updateValue]);

  return value as UnitValue<IForm[T['store']]>[string];
};
