import type { ReactElement } from 'react';

import { useForm } from './useForm';
import type { IRFormDataProviderProps } from './types';

/**
 * Form data stores provider
 */
export const FormDataProvider = ({ children, name }: IRFormDataProviderProps) => {
  const data = useForm(name);
  return children(data) as ReactElement;
};

FormDataProvider.displayName = 'FormDataProvider';
