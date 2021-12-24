import { TFieldValidator } from './model';
export declare const required: ({ msg }: {
    msg?: string | undefined;
}) => TFieldValidator;
export declare const email: ({ msg }: {
    msg?: string | undefined;
}) => TFieldValidator;
export declare const min: ({ min, msg }: {
    min: any;
    msg?: string | undefined;
}) => TFieldValidator;
export declare const max: ({ max, msg }: {
    max: any;
    msg?: string | undefined;
}) => TFieldValidator;
export declare const lessThan: ({ less, msg }: {
    less: any;
    msg?: string | undefined;
}) => TFieldValidator;
export declare const moreThan: ({ more, msg }: {
    more: any;
    msg?: string | undefined;
}) => TFieldValidator;
export declare const length: ({ length, msg }: {
    length: any;
    msg?: string | undefined;
}) => TFieldValidator;
export declare const matches: ({ regexp, pattern, msg }: {
    regexp: any;
    pattern: any;
    msg?: string | undefined;
}) => TFieldValidator;
export declare const positive: ({ msg }: {
    msg?: string | undefined;
}) => TFieldValidator;
export declare const negative: ({ msg }: {
    msg?: string | undefined;
}) => TFieldValidator;
