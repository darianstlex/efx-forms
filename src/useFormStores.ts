import { useUnit } from 'effector-react';
import type { Tuple, UnitValue } from 'effector';

import type { IForm, TFormStoreKey } from './types';
import { $null } from './constants';
import { useFormInstance } from './useFormInstance';

type Stores<T> = { [K in keyof T]: T[K] extends TFormStoreKey ? UnitValue<IForm[T[K]]> : T[K] };

/**`
 * Return form stores values array
 */
export const useFormStores = <T extends Tuple<TFormStoreKey>>(stores: T, formName?: string) => {
  const form = useFormInstance(formName);
  return useUnit(stores.map((name) => form?.[name as TFormStoreKey] || $null)) as Stores<T>;
};
