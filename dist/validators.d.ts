import { TFieldValidator } from './model';
export declare const required: ({ msg }?: {
    msg?: string | undefined;
}) => TFieldValidator;
export declare const email: ({ msg }?: {
    msg?: string | undefined;
}) => TFieldValidator;
export declare const min: ({ value, msg }: {
    value: any;
    msg?: string | undefined;
}) => TFieldValidator;
export declare const max: ({ value, msg }: {
    value: any;
    msg?: string | undefined;
}) => TFieldValidator;
export declare const lessThan: ({ value, msg }: {
    value: any;
    msg?: string | undefined;
}) => TFieldValidator;
export declare const moreThan: ({ value, msg }: {
    value: any;
    msg?: string | undefined;
}) => TFieldValidator;
export declare const length: ({ value, msg }: {
    value: any;
    msg?: string | undefined;
}) => TFieldValidator;
export declare const matches: ({ regexp, label, msg }: {
    regexp: any;
    label?: string | undefined;
    msg?: string | undefined;
}) => TFieldValidator;
export declare const positive: ({ msg }?: {
    msg?: string | undefined;
}) => TFieldValidator;
export declare const negative: ({ msg }?: {
    msg?: string | undefined;
}) => TFieldValidator;
