import type { Store, UnitValue } from 'effector';
import { useUnit } from 'effector-react';

import type { IForm, TFormStoreKey } from './types';
import { $null } from './constants';
import { useFormInstance } from './useFormInstance';

/**
 * Return form store value
 */
export const useFormStore = <T extends TFormStoreKey>(store: T, formName?: string) => {
  const form = useFormInstance(formName);
  return useUnit((form?.[store] as Store<UnitValue<IForm[T]>>) || $null);
};
