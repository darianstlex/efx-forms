import React from 'react';

import './index.css';

type TValue = string | number;
interface InputProps {
  id: string;
  name: string;
  label: string;
  error: string;
  onChange: (value: TValue) => void
}

export const Input = ({ id, label, error, onChange, name,  ...rest }: InputProps) => (
  <div className="input-wrapper">
    <label htmlFor={id || name}>{label}</label>
    <input
      name={name}
      id={id || name}
      className="input-input"
      onChange={(e) => onChange(e.target.value)}
      {...rest}
    />
    {error && <span data-test={`${name}-error`} className="input-error">{error}</span>}
  </div>
);
