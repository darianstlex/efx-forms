import { createDomain } from 'effector';
import type { Domain, Store } from 'effector';
import reduce from 'lodash/reduce';
import set from 'lodash/set';
import pickBy from 'lodash/pickBy';
import forEach from 'lodash/forEach';
import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';

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

/**
 * Transform object to flat, one level, object
 */
export const flattenObjectKeys = (obj = {}) => {
  const result = {};

  const flatten = (collection: Record<string, any>, prefix = '', suffix = '') => {
    forEach(collection, (value, key) => {
      const path = `${prefix}${key}${suffix}`;

      if (isArray(value)) {
        flatten(value, `${path}[`, ']');
      } else if (isPlainObject(value)) {
        flatten(value, `${path}.`);
      } else {
        result[path] = value;
      }
    });
  };

  flatten(obj);

  return result;
};
