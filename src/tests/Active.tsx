import React from 'react';
import type { IRFormProps } from '../index';
import { Form } from '../index';
import { useFormMethods } from '../useFormMethods';
import { required, email } from '../validators';
import { TextField } from './components/Input';
import { Button } from './components/Button';
import { CheckboxField } from './components/Checkbox';
import type { SendFormDataProps } from './components/Hooks';
import { SendFormData, UseFormStore } from './components/Hooks';
import { IfFieldValue } from '../IfFieldValue';

interface Props extends Partial<IRFormProps> {
  setFormData: SendFormDataProps['onSend'];
}

export const Active = ({ setFormData, ...props }: Props) => {
  const { reset } = useFormMethods('formTwo');
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
      <UseFormStore title="active" store="$active"/>
      <UseFormStore title="activeValues" store="$activeValues"/>
      <UseFormStore title="values" store="$values"/>
      <UseFormStore title="error" store="$error"/>
      <Button data-test="submit" type="submit">
        Submit
      </Button>
      <span style={{ display: 'inline-block', width: 20 }}/>
      <Button secondary data-test="reset" onClick={() => reset()}>
        Reset
      </Button>
      <span style={{ display: 'inline-block', width: 20 }}/>
      <SendFormData onSend={setFormData}/>
    </Form>
  );
};
