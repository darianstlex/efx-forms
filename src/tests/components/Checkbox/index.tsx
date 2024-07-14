import React from 'react';

import './index.css';

interface CheckboxProps {
  id: string;
  name: string;
  label: string;
  error: string;
  value: boolean;
  onChange: (checked: boolean) => void;
}

export const Checkbox = ({ id, label, error, value, onChange, name, ...rest }: CheckboxProps) => (
  <div className="checkbox-wrapper">
    <div className="checkbox-field">
      <label htmlFor={id || name} className="checkbox-label">{label}</label>
      <input
        id={id || name}
        type="checkbox"
        className="input"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        {...rest}
      />
    </div>
    {error && <span className="checkbox-error">{error}</span>}
  </div>
);
