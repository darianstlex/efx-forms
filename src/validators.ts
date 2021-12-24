import { TFieldValidator } from './model';

export const required = ({ msg = 'This field is required' }): TFieldValidator =>
  (val: string) => !val ? msg : false;

export const email = ({ msg = 'Must be a valid email' }): TFieldValidator =>
  (val: string) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? msg : false;

export const min = ({ min, msg = `Must be greater than or equal to ${min}` }): TFieldValidator =>
  (val: string | number) => Number(val) < min ? msg : false;

export const max = ({ max, msg = `Must be less than or equal to ${max}` }): TFieldValidator =>
  (val: string | number) => Number(val) > max ? msg : false;

export const lessThan = ({ less, msg = `Must be less than ${less}` }): TFieldValidator =>
  (val: string) => `${val}`.length >= less ? msg : false;

export const moreThan = ({ more, msg = `Must be greater than ${more}` }): TFieldValidator =>
  (val: string) => `${val}`.length <= more ? msg : false;

export const length = ({ length, msg = `Must be exactly ${length} characters` }): TFieldValidator =>
  (val: string | number) => `${val}`.length !== length ? msg : false;

export const matches = ({ regexp, pattern, msg = `Must match the following: "${pattern}"`}): TFieldValidator =>
  (val: string) => !regexp.test(val) ? msg : false;

export const positive = ({ msg = 'Must be a positive number' }): TFieldValidator =>
  (val: string | number) => Number(val) <= 0 ? msg : false;

export const negative = ({ msg = 'Must be a negative number' }): TFieldValidator =>
  (val: string | number) => Number(val) >= 0 ? msg : false;
