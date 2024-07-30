import { useCallback, useState } from 'react';
import type { Store, UnitValue } from 'effector';

import { useStoreWatch } from './useStoreWatch';

export const useStoreProp = <S extends Store<any>>(store: S, prop: string, defaultValue?: any) => {
  const [value, setValue] = useState(defaultValue);

  const updateValue = useCallback((values?: Record<string, any>) => {
    const newValue = values?.[prop] !== undefined ? values[prop] : defaultValue;
    newValue !== value && setValue(newValue);
  }, [defaultValue, prop, value]);

  useStoreWatch(store, updateValue);

  return value as UnitValue<S>[string];
};
