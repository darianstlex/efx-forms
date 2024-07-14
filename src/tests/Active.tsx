import React from 'react';
import { useUnit } from 'effector-react';

import type { IRFormProps } from '../index';
import { Form, Field, useFormInstance } from '../index';
import { required, email } from '../validators';
import { Input } from './components/Input';
import { Button } from './components/Button';
import { Checkbox } from './components/Checkbox';
import { UseFormStore } from './components/Hooks';
import { IfFieldValue } from '../IfFieldValue';

export const Active = (props: Partial<IRFormProps>) => {
  const form = useFormInstance('formTwo');
  const [reset] = useUnit([form.reset]);
  return (
    <Form name="formTwo" {...props}>
      <Field
        data-test="user.name"
        name="user.name"
        Field={Input}
        label="Name"
        type="text"
        initialValue="Initial User"
        validators={[required()]}
      />
      <Field
        data-test="user.hasEmail"
        initialValue={true}
        name="user.hasEmail"
        Field={Checkbox}
        label="Has Email"
      />
      <IfFieldValue field="user.hasEmail" check={(hasEmail) => !!hasEmail}>
        <Field
          validateOnChange
          data-test="user.email"
          name="user.email"
          Field={Input}
          label="Email"
          type="text"
          validators={[required(), email()]}
        />
      </IfFieldValue>
      <Field
        data-test="user.password"
        name="user.password"
        Field={Input}
        label="Password"
        type="text"
        validators={[required()]}
      />
      <UseFormStore title="active" store="$active" />
      <UseFormStore title="activeValues" store="$activeValues" />
      <UseFormStore title="values" store="$values" />
      <Button data-test="submit" type="submit">Submit</Button>
      <span style={{ display: 'inline-block', width: 20 }} />
      <Button secondary data-test="reset" onClick={() => reset()}>Reset</Button>
    </Form>
  );
};
