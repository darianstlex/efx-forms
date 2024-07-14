import type { Store } from 'effector';
import { useUnit } from 'effector-react';

import type { TFormStoreKey } from './types';
import { $null } from './constants';
import { useFormInstance } from './useFormInstance';

/**
 * Return form store value
 */
export const useFormStore = (store: TFormStoreKey, formName?: string): any => {
  const form = useFormInstance(formName);
  return useUnit(form?.[store] as Store<any> || $null);
};
