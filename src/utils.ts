import { createDomain, Domain } from 'effector';
import reduce from 'lodash-es/reduce';
import set from 'lodash-es/set';

export const domain: Domain = createDomain('forms');

export const shapeValues = (values: {}) => reduce(values, (acc, val, key) => set(acc, key, val), {});
