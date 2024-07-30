import { useCallback, useState } from 'react';
import type { Store, UnitValue } from 'effector';

import { useStoreWatch } from './useStoreWatch';

export const useStorePropFn = <S extends Store<any>>(
  store: S,
  getter: (value: UnitValue<S>) => any,
  defaultValue?: any,
) => {
  const [value, setValue] = useState(defaultValue);

  const updateValue = useCallback((values: UnitValue<S>) => {
    const getterValue = getter(values);
    const newValue = getterValue !== undefined ? getterValue : defaultValue;
    newValue !== value && setValue(newValue);
  }, [defaultValue, getter, value]);

  useStoreWatch(store, updateValue);

  return value as UnitValue<S>[string];
};
