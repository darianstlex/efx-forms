import React from 'react';

import type { IRFormProps } from '../index';
import { Form } from '../index';
import { TextField } from './components/Input';
import { Button } from './components/Button';
import type { SendFormDataProps } from './components/Hooks';
import { SendFormData, UseFormStore } from './components/Hooks';

interface Props extends Partial<IRFormProps> {
  setFormData: SendFormDataProps['onSend'];
}

const passwordMatch = (value: string, values: Record<string, any>): string | false => {
  if (value !== values['password']) {
    return 'Passwords do not match';
  }
  return false;
};

const endDateAfterStart = (value: string, values: Record<string, any>): string | false => {
  const startDate = values['startDate'];
  if (startDate && value && new Date(value) <= new Date(startDate)) {
    return 'End date must be after start date';
  }
  return false;
};

const requiredIfShipping = (value: string, values: Record<string, any>): string | false => {
  if (values['useShipping'] === true && !value) {
    return 'Shipping address is required';
  }
  return false;
};

const maxBudget = (value: string, values: Record<string, any>): string | false => {
  const budget = parseFloat(values['budget']);
  const requested = parseFloat(value);
  if (budget && requested && requested > budget) {
    return `Cannot exceed budget of ${budget}`;
  }
  return false;
};

export const ValidationPasswordConfirm = ({ setFormData }: Props) => {
  return (
    <Form name="password-confirm-test">
      <TextField
        data-test="user.password"
        name="password"
        label="Password"
        type="password"
      />
      <TextField
        data-test="user.password-outside"
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        validators={[passwordMatch]}
        validateOnBlur
      />
      <UseFormStore title="errors" store="$errors" />
      <UseFormStore title="valid" store="$valid" />
      <Button data-test="submit" type="submit">
        Submit
      </Button>
      <SendFormData onSend={setFormData} />
    </Form>
  );
};

export const ValidationDateRange = ({ setFormData }: Props) => {
  return (
    <Form name="date-range-test">
      <TextField
        data-test="startDate"
        name="startDate"
        label="Start Date"
        type="date"
      />
      <TextField
        data-test="endDate"
        name="endDate"
        label="End Date"
        type="date"
        validators={[endDateAfterStart]}
        validateOnBlur
      />
      <UseFormStore title="errors" store="$errors" />
      <UseFormStore title="valid" store="$valid" />
      <Button data-test="submit" type="submit">
        Submit
      </Button>
      <SendFormData onSend={setFormData} />
    </Form>
  );
};

export const ValidationConditionalRequired = ({ setFormData }: Props) => {
  return (
    <Form name="conditional-required-test">
      <input
        type="checkbox"
        data-test="user.hasEmail"
        name="useShipping"
      />
      <TextField
        data-test="shippingAddress"
        name="shippingAddress"
        label="Shipping Address"
        validators={[requiredIfShipping]}
        validateOnBlur
      />
      <UseFormStore title="errors" store="$errors" />
      <UseFormStore title="valid" store="$valid" />
      <Button data-test="submit" type="submit">
        Submit
      </Button>
      <SendFormData onSend={setFormData} />
    </Form>
  );
};

export const ValidationBudgetCheck = ({ setFormData }: Props) => {
  return (
    <Form name="budget-check-test">
      <TextField
        data-test="budget"
        name="budget"
        label="Budget"
        type="number"
      />
      <TextField
        data-test="requested"
        name="requested"
        label="Requested Amount"
        type="number"
        validators={[maxBudget]}
        validateOnBlur
      />
      <UseFormStore title="errors" store="$errors" />
      <UseFormStore title="valid" store="$valid" />
      <Button data-test="submit" type="submit">
        Submit
      </Button>
      <SendFormData onSend={setFormData} />
    </Form>
  );
};
