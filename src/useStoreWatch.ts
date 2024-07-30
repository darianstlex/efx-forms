import { useEffect } from 'react';
import type { Store, UnitValue } from 'effector';
import { createWatch } from 'effector';
import { useProvidedScope } from 'effector-react';

export const useStoreWatch = <S extends Store<any>>(
  store: S,
  onUpdate: (value: UnitValue<S>) => any,
) => {
  const scope = useProvidedScope();

  useEffect(() => {
    onUpdate(scope?.getState(store));
    const unwatch = createWatch({
      unit: store,
      scope: scope || undefined,
      fn: (values) => {
        onUpdate(values);
      },
    });

    return () => {
      unwatch();
    };
  }, [scope, store, onUpdate]);
};
