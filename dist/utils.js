import { createDomain } from 'effector';
import reduce from 'lodash-es/reduce';
import set from 'lodash-es/set';
import pickBy from 'lodash-es/pickBy';
export var domain = createDomain('forms');
/**
 * Return truthy values only
 */
export var truthyFy = function (values) { return pickBy(values, Boolean); };
/**
 * Transform flat to structured object
 */
export var shapeFy = function (values) { return reduce(values, function (acc, val, key) { return set(acc, key, val); }, {}); };
/**
 * Return store with truthy values only
 */
export var truthyFyStore = function ($store) { return $store.map(truthyFy); };
/**
 * Transform flat to structured store
 */
export var shapeFyStore = function ($store) { return $store.map(shapeFy); };
