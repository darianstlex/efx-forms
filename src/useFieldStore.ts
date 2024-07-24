import { useUnit } from 'effector-react';

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
  const form = useFormInstance(formName);
  const values = useUnit(form[store]);

  return values[name] ?? defaultValue;
};
