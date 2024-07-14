import React from 'react';
import { useUnit } from 'effector-react';

import type { IRFormProps } from '../index';
import { Form, Field, useFormInstance } from '../index';
import { required, email } from '../validators';
import { Input } from './components/Input';
import { Button } from './components/Button';
import { UseFormStore } from './components/Hooks';

export const DirtyTouchErrors = (props: Partial<IRFormProps>) => {
  const form = useFormInstance('formOne');
  const [reset] = useUnit([form.reset]);
  return (
    <Form name="formOne" onSubmit={props?.onSubmit} {...props}>
      <Field
        data-test="user.name"
        name="user.name"
        Field={Input}
        label="Name"
        type="text"
        initialValue="Initial User"
        validators={[required({ msg: 'Must have' })]}
      />
      <Field
        validateOnChange
        data-test="user.email"
        name="user.email"
        Field={Input}
        label="Email"
        type="text"
        validators={[required(), email()]}
      />
      <Field
        data-test="user.password"
        name="user.password"
        Field={Input}
        label="Password"
        type="text"
        validators={[required({ msg: 'Required!'})]}
      />
      <UseFormStore title="touched" store="$touched" />
      <UseFormStore title="dirty" store="$dirty" />
      <UseFormStore title="touches" store="$touches" />
      <UseFormStore title="dirties" store="$dirties" />
      <UseFormStore title="errors" store="$errors" />
      <UseFormStore title="error" store="$error" />
      <Button data-test="submit" type="submit">Submit</Button>
      <span style={{ display: 'inline-block', width: 20 }} />
      <Button secondary data-test="reset" onClick={() => reset()}>Reset</Button>
    </Form>
  );
};
