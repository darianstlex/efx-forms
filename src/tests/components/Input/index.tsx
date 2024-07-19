import React from 'react';

import './index.css';
import { Field } from '../../../FieldComponent';
import { IFieldProps, IRFieldProps } from '../../../types';

interface InputProps {
  id?: string;
  label: string;
}

export const Input = ({ id, label, error, onChange, name,  ...rest }: InputProps & IFieldProps) => (
  <div className="input-wrapper">
    <label htmlFor={id || name}>{label}</label>
    <input
      name={name}
      id={id || name}
      className="input-input"
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
