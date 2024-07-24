import { useEffect, useState } from 'react';
import { createWatch } from 'effector';
import { useProvidedScope } from 'effector-react';

import { useFormInstance } from './useFormInstance';
import type { TFormStoreKey } from './types';

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

export const useFieldStore = ({
  store,
  name,
  formName,
  defaultValue,
}: UseFieldStoreProps) => {
  const scope = useProvidedScope();
  const form = useFormInstance(formName);
  const [value, setValue] = useState();

  useEffect(() => {
    const unwatch = createWatch({
      unit: form[store],
      scope: scope || undefined,
      fn: (values) => {
        setValue(values?.[name]);
      },
    });

    return () => {
      unwatch();
    };
  }, [store, name, form, scope]);

  return value ?? defaultValue;
};
