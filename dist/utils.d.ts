import { Domain, Store } from 'effector';
export declare const domain: Domain;
/**
 * Return truthy values only
 */
export declare const truthyFy: (values?: {}) => {};
/**
 * Transform flat to structured object
 */
export declare const shapeFy: (values?: {}) => {};
/**
 * Return store with truthy values only
 */
export declare const truthyFyStore: ($store: Store<{}>) => Store<{}>;
/**
 * Transform flat to structured store
 */
export declare const shapeFyStore: ($store: Store<{}>) => Store<{}>;
