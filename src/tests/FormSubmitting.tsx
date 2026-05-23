import React from 'react';

import type { IRFormProps } from '../index';
import { Form } from '../index';
import { useFormMethods } from '../useFormMethods';
import { required } from '../validators';
import { TextField } from './components/Input';
import { Button } from './components/Button';
import type { SendFormDataProps } from './components/Hooks';
import { SendFormData, UseFormStore } from './components/Hooks';

interface Props extends Partial<IRFormProps> {
  setFormData: SendFormDataProps['onSend'];
}

export const FormSubmitting = ({ setFormData, onSubmit, ...props }: Props) => {
  const { reset } = useFormMethods('submitting-test');
  return (
    <Form
      name="submitting-test"
      onSubmit={onSubmit}
      {...props}
    >
      <TextField
        data-test="username"
        name="username"
        label="Username"
        validators={[required()]}
      />
      <UseFormStore title="submitting" store="$submitting" />
      <UseFormStore title="values" store="$values" />
      <Button data-test="submit" type="submit">
        Submit
      </Button>
      <span style={{ display: 'inline-block', width: 20 }} />
      <Button secondary data-test="reset" onClick={() => reset()}>
        Reset
      </Button>
      <span style={{ display: 'inline-block', width: 20 }} />
      <SendFormData onSend={setFormData} />
    </Form>
  );
};

export const FormSubmittingFailure = ({ setFormData }: Props) => {
  const handleSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    throw { username: 'Username already taken' };
  };

  return (
    <Form
      name="submitting-fail-test"
      onSubmit={handleSubmit}
    >
      <TextField
        data-test="username"
        name="username"
        label="Username"
      />
      <UseFormStore title="submitting" store="$submitting" />
      <SendFormData onSend={setFormData} />
    </Form>
  );
};
