import type { ReactElement } from 'react';
import { useStoreMap } from 'effector-react';

import { useFormInstance } from './useFormInstance';
import type { IRIfFieldValueProps } from './types';

/**
 * Conditional rendering based on field value
 */
export const IfFieldValue = ({
  children,
  check,
  field,
  formName,
  render,
}: IRIfFieldValueProps) => {
  const form = useFormInstance(formName);
  const value = useStoreMap(form.$values, (it) => it[field]);
  const show = check(value);
  const output = () => render ? render(value) : children;

  return (show ? output() : null) as ReactElement;
};

IfFieldValue.displayName = 'IfFieldsValue';
