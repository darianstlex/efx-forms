import { createDomain } from 'effector';
import type { Domain, Store } from 'effector';
import reduce from 'lodash/reduce';
import set from 'lodash/set';
import pickBy from 'lodash/pickBy';

export const domain: Domain = createDomain('@fx-forms');

type TObject = Record<string, unknown>;

/**
 * Return truthy values only
 */
export const truthyFy = (values = {}): TObject => pickBy(values, Boolean);

/**
 * Transform flat to structured object
 */
export const shapeFy = (values = {}): TObject =>
  reduce(values, (acc, val, key) => set(acc, key, val), {});

/**
 * Return store with truthy values only
 */
export const truthyFyStore = ($store: Store<TObject>) => $store.map(truthyFy);

/**
 * Transform flat to structured store
 */
export const shapeFyStore = ($store: Store<TObject>) => $store.map(shapeFy);

/**
 * Check if object have truthy value
 */
export const hasTruthy = (obj: Record<string, any>) =>
  Object.values(obj).some(Boolean);
