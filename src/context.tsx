import React, { createContext, useContext } from 'react';
import { FORM_CONFIG } from './constants';

export const FormNameContext = createContext(FORM_CONFIG.name);

/**
 * Get form name from context
 */
export const useFormName = () => {
  return useContext(FormNameContext);
};

export const FormProvider = ({ name, children }: {
  name: string;
  children: React.ReactNode;
}) => (<FormNameContext.Provider value={name}>{children}</FormNameContext.Provider>);
