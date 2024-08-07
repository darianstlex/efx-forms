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

export const Outside = ({ setFormData, ...props }: Props) => {
  const { reset } = useFormMethods('formOutside');
  return (
    <>
      <Form name="formOutside" onSubmit={props?.onSubmit} {...props}>
        <TextField
          data-test="user.name"
          name="user.name"
          label="Name"
          validators={[required()]}
        />
        <TextField
          data-test="user.password"
          name="user.password"
          label="Password"
          validators={[required()]}
        />
        <UseFormStore title="active" store="$active"/>
        <UseFormStore title="values" store="$values"/>
        <Button data-test="submit" type="submit">
          Submit
        </Button>
        <span style={{ display: 'inline-block', width: 20 }}/>
        <Button secondary data-test="reset" onClick={() => reset()}>
          Reset
        </Button>
        <span style={{ display: 'inline-block', width: 20 }}/>
        <SendFormData onSend={setFormData} />
      </Form>
      <div style={{ width: 400, margin: '0 auto' }}>
        <TextField
          formName="formOutside"
          data-test="user.password-outside"
          name="user.password"
          label="Password Outside"
          validators={[required()]}
        />
      </div>
    </>
  );
};
