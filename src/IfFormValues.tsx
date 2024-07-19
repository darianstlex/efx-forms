import type { ReactElement } from 'react';
import { useEffect, useRef } from 'react';
import { useUnit } from 'effector-react';

import { useFormInstance } from './useFormInstance';
import type { IRIfFormValuesProps } from './types';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';

/**
 * Conditional rendering based on form values
 */
export const IfFormValues = ({
   children,
   check,
   form,
   setTo,
   resetTo,
   render,
   updateDebounce = 0,
}: IRIfFormValuesProps) => {
  const formInst = useFormInstance(form);
  const [values, activeValues, setValues] = useUnit([
    formInst.$values,
    formInst.$activeValues,
    formInst.setValues,
  ]);
  const show = check(values, activeValues);
  const updateDeb = useRef(debounce(setValues, updateDebounce)).current;

  useEffect(() => {
    show && !isEmpty(setTo) && updateDeb(setTo as Record<string, any>);
    !show && !isEmpty(resetTo) && updateDeb(resetTo as Record<string, any>);
    return () => {
      updateDeb.cancel();
    };
  }, [resetTo, setTo, show, updateDeb]);

  const output = () => render ? render(values) : children;

  return (show ? output() : null) as ReactElement;
};

IfFormValues.displayName = 'IfFormValues';
