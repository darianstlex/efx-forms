import type { ReactElement } from 'react';

import { useFieldData } from './useFieldData';
import type { IRFieldDataProviderProps } from './types';

/**
 * Field data provider
 */
export const FieldDataProvider = ({
  children,
  name,
  formName,
}: IRFieldDataProviderProps) => {
  const values = useFieldData(name, formName);
  return children(values) as ReactElement;
};

FieldDataProvider.displayName = 'FieldDataProvider';
