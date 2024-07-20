import React, { InputHTMLAttributes } from 'react';

import './index.css';
import { IFieldProps, IRFieldProps } from '../../../types';
import { Field } from '../../../FieldComponent';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  label: string;
  name: string;
}

export const Checkbox = ({ id, label, error, value, onChange, name, ...rest }: InputProps & IFieldProps) => (
  <div className="checkbox-wrapper">
    <div className="checkbox-field">
      <label htmlFor={id || name} className="checkbox-label">{label}</label>
      <input
        id={id || name}
        type="checkbox"
        className="checkbox-input"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        {...rest}
      />
    </div>
    {error && <span className="checkbox-error">{error}</span>}
  </div>
);

export const CheckboxField = ({ name, ...rest }: Omit<IRFieldProps, 'Field'> & InputProps) => (
  <Field name={name} Field={Checkbox} {...rest} />
);
