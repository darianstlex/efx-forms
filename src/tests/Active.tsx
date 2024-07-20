import React from 'react';
import { useUnit } from 'effector-react';

import type { IRFormProps } from '../index';
import { Form, useFormInstance } from '../index';
import { required, email } from '../validators';
import { TextField } from './components/Input';
import { Button } from './components/Button';
import { CheckboxField } from './components/Checkbox';
import { UseFormStore } from './components/Hooks';
import { IfFieldValue } from '../IfFieldValue';

export const Active = (props: Partial<IRFormProps>) => {
  const form = useFormInstance('formTwo');
  const [reset] = useUnit([form.reset]);
  return (
    <Form name="formTwo" {...props}>
      <TextField
        data-test="user.name"
        name="user.name"
        label="Name"
        initialValue="Initial User"
        validators={[required()]}
      />
      <CheckboxField
        data-test="user.hasEmail"
        initialValue={true}
        name="user.hasEmail"
        label="Has Email"
      />
      <IfFieldValue field="user.hasEmail" check={(hasEmail) => !!hasEmail}>
        <TextField
          validateOnChange
          data-test="user.email"
          name="user.email"
          label="Email"
          validators={[required(), email()]}
        />
      </IfFieldValue>
      <TextField
        data-test="user.password"
        name="user.password"
        label="Password"
        validators={[required()]}
      />
      <UseFormStore title="active" store="$active" />
      <UseFormStore title="activeValues" store="$activeValues" />
      <UseFormStore title="values" store="$values" />
      <UseFormStore title="error" store="$error" />
      <Button data-test="submit" type="submit">Submit</Button>
      <span style={{ display: 'inline-block', width: 20 }} />
      <Button secondary data-test="reset" onClick={() => reset()}>Reset</Button>
    </Form>
  );
};
