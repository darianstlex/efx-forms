import { TFieldValidator } from './model';

export const required = ({ msg = 'This field is required' } = {}): TFieldValidator =>
  (val: string) => !val ? msg : false;

export const email = ({ msg = 'Must be a valid email' } = {}): TFieldValidator =>
  (val: string) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? msg : false;

export const min = ({ value, msg = `Must be greater than or equal to ${value}` }): TFieldValidator =>
  (val: string | number) => Number(val) < value ? msg : false;

export const max = ({ value, msg = `Must be less than or equal to ${value}` }): TFieldValidator =>
  (val: string | number) => Number(val) > value ? msg : false;

export const lessThan = ({ value, msg = `Must be less than ${value}` }): TFieldValidator =>
  (val: string) => `${val}`.length >= value ? msg : false;

export const moreThan = ({ value, msg = `Must be greater than ${value}` }): TFieldValidator =>
  (val: string) => `${val}`.length <= value ? msg : false;

export const length = ({ value, msg = `Must be exactly ${value} characters` }): TFieldValidator =>
  (val: string | number) => `${val}`.length !== value ? msg : false;

export const matches = ({ regexp, label = '', msg = `Must match the following: "${label}"`}): TFieldValidator =>
  (val: string) => !regexp.test(val) ? msg : false;

export const positive = ({ msg = 'Must be a positive number' } = {}): TFieldValidator =>
  (val: string | number) => Number(val) <= 0 ? msg : false;

export const negative = ({ msg = 'Must be a negative number' } = {}): TFieldValidator =>
  (val: string | number) => Number(val) >= 0 ? msg : false;
