import type { TFieldValidator } from './types';

export const required: TFieldValidator =
  ({ msg = 'This field is required' } = {}) =>
  (val: string) =>
    !val ? msg : false;

export const email: TFieldValidator =
  ({ msg = 'Must be a valid email' } = {}) =>
  (val: string) =>
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? msg : false;

export const min: TFieldValidator =
  ({ value, msg = `Must be greater or equal to ${value}` } = {}) =>
  (val: string | number) =>
    Number(val) < value ? msg : false;

export const max: TFieldValidator =
  ({ value, msg = `Must be less or equal to ${value}` } = {}) =>
  (val: string | number) =>
    Number(val) > value ? msg : false;

export const lessThan: TFieldValidator =
  ({ value, msg = `Length must be less than ${value}` } = {}) =>
  (val: string) =>
    `${val}`.length >= value ? msg : false;

export const moreThan: TFieldValidator =
  ({ value, msg = `Length must be more than ${value}` } = {}) =>
  (val: string) =>
    `${val}`.length <= value ? msg : false;

export const length: TFieldValidator =
  ({ value, msg = `Length must be exactly ${value} characters` } = {}) =>
  (val: string | number) =>
    `${val}`.length !== value ? msg : false;

export const matches: TFieldValidator =
  ({ regexp, label = '', msg = `Must match the following: '${label}'` } = {}) =>
  (val: string) =>
    !regexp?.test(val) ? msg : false;

export const positive: TFieldValidator =
  ({ msg = 'Must be a positive number' } = {}) =>
  (val: string | number) =>
    Number(val) <= 0 ? msg : false;

export const negative: TFieldValidator =
  ({ msg = 'Must be a negative number' } = {}) =>
  (val: string | number) =>
    Number(val) >= 0 ? msg : false;

export const number: TFieldValidator =
  ({ msg = 'Must be a number' } = {}) =>
  (val: string) =>
    isNaN(Number(val)) ? msg : false;
