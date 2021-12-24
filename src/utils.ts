import { createDomain, Domain, Store } from 'effector';
import reduce from 'lodash-es/reduce';
import set from 'lodash-es/set';
import pickBy from 'lodash-es/pickBy';

export const domain: Domain = createDomain('forms');

/**
 * Return truthy values only
 */
export const truthyFy = (values) => pickBy(values, Boolean);

/**
 * Transform flat to structured object
 */
export const shapeFy = (values: {}) => reduce(values, (acc, val, key) => set(acc, key, val), {});

/**
 * Return store with truthy values only
 */
export const truthyFyStore = ($store: Store<any>): Store<any> => $store.map(truthyFy);

/**
 * Transform flat to structured store
 */
export const shapeFyStore = ($store: Store<any>): Store<any> => $store.map(shapeFy);
