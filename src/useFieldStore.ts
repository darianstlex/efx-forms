import type { UnitValue } from 'effector';

import { useFormInstance } from './useFormInstance';
import type { IForm, TFormStoreKey } from './types';
import { useStoreProp } from './useStoreProp';

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
  const form = useFormInstance(formName);
  return useStoreProp(form[store], name, defaultValue) as UnitValue<IForm[T['store']]>[string];
};
