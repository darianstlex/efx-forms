import { Domain } from 'effector';
export declare const domain: Domain;
/**
 * Return truthy values only
 */
export declare const truthyFy: (values: any) => Partial<any>;
/**
 * Transform flat to structured object
 */
export declare const shapeFy: (values: {}) => {};
/**
 * Return store with truthy values only
 */
export declare const truthyFyStore: ($store: any) => any;
/**
 * Transform flat to structured store
 */
export declare const shapeFyStore: ($store: any) => any;
