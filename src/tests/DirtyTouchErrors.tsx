import React from 'react';
import { useUnit } from 'effector-react';

import type { IRFormProps } from '../index';
import { Form, useFormInstance } from '../index';
import { required, email } from '../validators';
import { TextField } from './components/Input';
import { Button } from './components/Button';
import { UseFormStore } from './components/Hooks';

export const DirtyTouchErrors = (props: Partial<IRFormProps>) => {
  const form = useFormInstance('formOne');
  const [reset] = useUnit([form.reset]);
  return (
    <Form name="formOne" onSubmit={props?.onSubmit} {...props}>
      <TextField
        data-test="user.name"
        name="user.name"
        label="Name"
        initialValue="Initial User"
        validators={[required({ msg: 'Must have' })]}
      />
      <TextField
        validateOnChange
        data-test="user.email"
        name="user.email"
        label="Email"
        validators={[required(), email()]}
      />
      <TextField
        data-test="user.password"
        name="user.password"
        label="Password"
        validators={[required({ msg: 'Required!' })]}
        initialValue={null}
      />
      <UseFormStore title="activeValues" store="$activeValues" />
      <UseFormStore title="touched" store="$touched" />
      <UseFormStore title="dirty" store="$dirty" />
      <UseFormStore title="touches" store="$touches" />
      <UseFormStore title="dirties" store="$dirties" />
      <UseFormStore title="errors" store="$errors" />
      <UseFormStore title="error" store="$error" />
      <Button data-test="submit" type="submit">
        Submit
      </Button>
      <span style={{ display: 'inline-block', width: 20 }} />
      <Button secondary data-test="reset" onClick={() => reset()}>
        Reset
      </Button>
    </Form>
  );
};
