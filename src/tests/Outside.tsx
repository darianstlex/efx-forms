import React from 'react';
import { useUnit } from 'effector-react';

import type { IRFormProps } from '../index';
import { Form, useFormInstance } from '../index';
import { required } from '../validators';
import { TextField } from './components/Input';
import { Button } from './components/Button';
import { UseFormStore } from './components/Hooks';

export const Outside = (props: Partial<IRFormProps>) => {
  const form = useFormInstance('formOutside');
  const [reset] = useUnit([form.reset]);
  return (
    <>
      <Form name="formOutside" onSubmit={props?.onSubmit} {...props}>
        <TextField
          data-test="user.name"
          name="user.name"
          label="Name"
          validators={[required()]}
        />
        <UseFormStore title="active" store="$active" />
        <UseFormStore title="values" store="$values" />
        <Button data-test="submit" type="submit">
          Submit
        </Button>
        <span style={{ display: 'inline-block', width: 20 }} />
        <Button secondary data-test="reset" onClick={() => reset()}>
          Reset
        </Button>
      </Form>
      <div style={{ width: 400, margin: '0 auto' }}>
        <TextField
          formName="formOutside"
          data-test="user.password"
          name="user.password"
          label="Password"
          validators={[required()]}
        />
      </div>
    </>
  );
};
