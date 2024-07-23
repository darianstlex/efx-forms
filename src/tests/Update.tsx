import React from 'react';
import { useUnit } from 'effector-react';

import type { IRFormProps } from '../index';
import { Form, useFormInstance } from '../index';
import { required } from '../validators';
import { TextField } from './components/Input';
import { Button } from './components/Button';
import type { SendFormDataProps } from './components/Hooks';
import { SendFormData, UseFormStore } from './components/Hooks';

interface Props extends Partial<IRFormProps> {
  setFormData: SendFormDataProps['onSend'];
}

export const Update = ({ setFormData, ...props }: Props) => {
  const form = useFormInstance('formUpdate');
  const [reset] = useUnit([form.reset]);
  const submit = async (values: Record<string, any>) => {
    console.log(values); // eslint-disable-line
    return Promise.reject({
      'user.name': 'This user is taken',
    });
  };
  return (
    <Form name="formUpdate" {...props} onSubmit={submit}>
      <TextField
        data-test="user.name"
        name="user.name"
        label="Name"
        validateOnChange={!props.validateOnChange}
        validators={[required()]}
      />
      <TextField
        data-test="user.password"
        name="user.password"
        label="Password"
        validators={[required()]}
      />
      <UseFormStore title="values" store="$values"/>
      <UseFormStore title="touches" store="$touches"/>
      <UseFormStore title="error" store="$error"/>
      <Button data-test="submit" type="submit">
        Submit
      </Button>
      <span style={{ display: 'inline-block', width: 20 }}/>
      <Button data-test="reset" onClick={() => reset()}>
        Reset
      </Button>
      <span style={{ display: 'inline-block', width: 20 }}/>
      <SendFormData onSend={setFormData}/>
    </Form>
  );
};
