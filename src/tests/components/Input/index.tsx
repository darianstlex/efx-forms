import React from 'react';
import type { InputHTMLAttributes } from 'react';

import './index.css';
import { Field } from '../../../FieldComponent';
import { IFieldProps, IRFieldProps } from '../../../types';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  label: string;
  name: string;
}

export const Input = ({ id, label, error, onChange, name,  ...rest }: InputProps & IFieldProps) => (
  <div className="input-wrapper">
    <label htmlFor={id || name}>{label}</label>
    <input
      name={name}
      id={id || name}
      className="input-field"
      type="text"
      onChange={(e) => onChange(e.target.value)}
      {...rest}
    />
    {error && <span data-test={`${name}-error`} className="input-error">{error}</span>}
  </div>
);

export const TextField = ({ name, ...rest }: Omit<IRFieldProps, 'Field'> & InputProps) => (
  <Field name={name} Field={Input} {...rest} />
);

export const NumberField = ({ name, ...rest }: Omit<IRFieldProps, 'Field'> & InputProps) => (
  <Field
    name={name}
    Field={Input}
    type="number"
    format={(num: number) => `${num}`}
    parse={(num: number) => Number(num)}
    {...rest}
  />
);
