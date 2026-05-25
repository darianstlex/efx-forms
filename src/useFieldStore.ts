import type { UnitValue } from 'effector';

import type { IForm, IValue, TFormStoreKey } from './types';
import { useFormInstance } from './useFormInstance';
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
  | '$fieldsConfig'
>;

interface UseFieldStoreProps {
  store: TFieldStore;
  name: string;
  formName?: string;
  defaultValue?: IValue;
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
