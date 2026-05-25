import type { Store, UnitValue } from 'effector';
import { useStoreMap } from 'effector-react';
import get from 'lodash/get';

export const useStoreProp = <S extends Store<any>>(store: S, prop: string, defaultValue?: any) => {
  return useStoreMap({
    store,
    keys: [prop],
    fn: (state, [propName]) => get(state, propName),
    defaultValue,
  }) as UnitValue<S>[string];
};
