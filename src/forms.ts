import type { IFormConfig, IForms } from './types';
import { createFormHandler } from './form';
import isEmpty from 'lodash/isEmpty';

export const forms: IForms = {};

/**
 * Create form with the given config
 */
export const getForm = (config: IFormConfig) => {
  const { name, ...rest } = config;
  !forms[name] && (forms[name] = createFormHandler(config));
  !isEmpty(rest) && forms[name].setConfig(config);
  return forms[name];
};
