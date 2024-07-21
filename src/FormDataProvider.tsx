import type { ReactElement } from 'react';

import { useFormData } from './useFormData';
import type { IRFormDataProviderProps } from './types';

/**
 * Form data stores provider
 */
export const FormDataProvider = ({
  children,
  name,
}: IRFormDataProviderProps) => {
  const data = useFormData(name);
  return children(data) as ReactElement;
};

FormDataProvider.displayName = 'FormDataProvider';
