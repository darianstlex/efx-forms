import { useUnit } from 'effector-react';

import type { TFormStoreKey } from './types';
import { $null } from './constants';
import { useFormInstance } from './useFormInstance';

/**
 * Return form stores values array
 */
export const useFormStores = (stores: TFormStoreKey[], formName?: string) => {
  const form = useFormInstance(formName);
  return useUnit(stores.map((name) => form?.[name] || $null));
};
