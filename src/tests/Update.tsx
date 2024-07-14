import React from 'react';
import { useUnit } from 'effector-react';

import type { IRFormProps, IFormValues } from '../index';
import { Form, Field, useFormInstance } from '../index';
import { required } from '../validators';
import { Input } from './components/Input';
import { Button } from './components/Button';
import { UseFormStore } from './components/Hooks';

export const Update = (props: Partial<IRFormProps>) => {
  const form = useFormInstance('formOutside');
  const [reset] = useUnit([form.reset]);
  const submit = async (values: IFormValues) => {
    console.log('SUBMIT PROMISE', values);
    return Promise.reject({
      'user.name': 'This user is taken',
    });
  };
  return (
    <>
      <Form name="formOutside" onSubmit={submit} {...props}>
        <Field
          data-test="user.name"
          name="user.name"
          Field={Input}
          label="Name"
          type="text"
          validators={[required()]}
        />
        <Field
          formName="formOutside"
          data-test="user.password"
          name="user.password"
          Field={Input}
          label="Password"
          type="text"
          validators={[required()]}
        />
        <UseFormStore title="values" store="$values" />
        <Button data-test="submit" type="submit">Submit</Button>
        <span style={{ display: 'inline-block', width: 20 }} />
        <Button secondary data-test="reset" onClick={() => reset()}>Reset</Button>
      </Form>
    </>
  );
};
