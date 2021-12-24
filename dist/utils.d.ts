/// <reference types="lodash" />
import { Domain, Store } from 'effector';
export declare const domain: Domain;
/**
 * Return truthy values only
 */
export declare const truthyFy: (values?: {}) => import("lodash").Dictionary<unknown>;
/**
 * Transform flat to structured object
 */
export declare const shapeFy: (values?: {}) => {};
/**
 * Return store with truthy values only
 */
export declare const truthyFyStore: ($store: Store<any>) => Store<import("lodash").Dictionary<unknown>>;
/**
 * Transform flat to structured store
 */
export declare const shapeFyStore: ($store: Store<any>) => Store<{}>;
