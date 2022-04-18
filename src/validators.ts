import type { TFieldValidator } from './model';

export const required = ({ msg = 'This field is required' } = {}): TFieldValidator =>
  (val: string) => !val ? msg : false;

export const email = ({ msg = 'Must be a valid email' } = {}): TFieldValidator =>
  (val: string) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? msg : false;

export const min = ({ value, msg = `Must be greater or equal to ${value}` }): TFieldValidator =>
  (val: string | number) => Number(val) < value ? msg : false;

export const max = ({ value, msg = `Must be less or equal to ${value}` }): TFieldValidator =>
  (val: string | number) => Number(val) > value ? msg : false;

export const lessThan = ({ value, msg = `Length must be less than ${value}` }): TFieldValidator =>
  (val: string) => `${val}`.length >= value ? msg : false;

export const moreThan = ({ value, msg = `Length must be more than ${value}` }): TFieldValidator =>
  (val: string) => `${val}`.length <= value ? msg : false;

export const length = ({ value, msg = `Length must be exactly ${value} characters` }): TFieldValidator =>
  (val: string | number) => `${val}`.length !== value ? msg : false;

export const matches = ({ regexp, label = '', msg = `Must match the following: "${label}"`}): TFieldValidator =>
  (val: string) => !regexp.test(val) ? msg : false;

export const positive = ({ msg = 'Must be a positive number' } = {}): TFieldValidator =>
  (val: string | number) => Number(val) <= 0 ? msg : false;

export const negative = ({ msg = 'Must be a negative number' } = {}): TFieldValidator =>
  (val: string | number) => Number(val) >= 0 ? msg : false;

export const number = ({ msg = 'Must be a number' } = {}): TFieldValidator =>
  (val: string) => isNaN(Number(val)) ? msg : false;
