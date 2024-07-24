import type { ReactElement } from 'react';

import type { IRIfFieldValueProps } from './types';
import { useFieldStore } from './useFieldStore';

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
  const value = useFieldStore({ store: '$values', formName, name: field });
  const show = check(value);
  const output = () => (render ? render(value) : children);

  return (show ? output() : null) as ReactElement;
};

IfFieldValue.displayName = 'IfFieldsValue';
