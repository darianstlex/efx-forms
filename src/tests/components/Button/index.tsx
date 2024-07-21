import React from 'react';
import type { ReactNode } from 'react';

import './index.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
  children: ReactNode;
  secondary?: boolean;
}

export const Button = ({
  children,
  secondary = false,
  type = 'button',
  ...props
}: ButtonProps) => (
  <button
    className={['button', secondary ? 'button-secondary' : ''].join(' ')}
    {...{ type, ...props }}
  >
    {children}
  </button>
);
