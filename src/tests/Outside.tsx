import React from 'react';
import { useUnit } from 'effector-react';

import type { IRFormProps } from '../index';
import { Form, Field, useFormInstance } from '../index';
import { required } from '../validators';
import { Input } from './components/Input';
import { Button } from './components/Button';
import { UseFormStore } from './components/Hooks';

export const Outside = (props: Partial<IRFormProps>) => {
  const form = useFormInstance('formOutside');
  const [reset] = useUnit([form.reset]);
  return (
    <>
      <Form name="formOutside" onSubmit={props?.onSubmit} {...props}>
        <Field
          data-test="user.name"
          name="user.name"
          Field={Input}
          label="Name"
          type="text"
          validators={[required()]}
        />
        <UseFormStore title="active" store="$active" />
        <UseFormStore title="values" store="$values" />
        <Button data-test="submit" type="submit">Submit</Button>
        <span style={{ display: 'inline-block', width: 20 }} />
        <Button secondary data-test="reset" onClick={() => reset()}>Reset</Button>
      </Form>
      <div style={{ width: 400, margin: '0 auto' }}>
        <Field
          formName="formOutside"
          data-test="user.password"
          name="user.password"
          Field={Input}
          label="Password"
          type="text"
          validators={[required()]}
        />
      </div>
    </>
  );
};
