import React, { useState } from 'react';

import type { IRFormProps } from '../index';
import { Form } from '../index';
import { useFormMethods } from '../useFormMethods';
import { TextField } from './components/Input';
import { Button } from './components/Button';
import type { SendFormDataProps } from './components/Hooks';
import { SendFormData } from './components/Hooks';
import { required } from '../validators';

interface Props extends Partial<IRFormProps> {
  setFormData: SendFormDataProps['onSend'];
}

export const FormValidation = ({ setFormData, onSubmit }: Props) => {
  const { reset } = useFormMethods('formOutside');
  return (
    <>
      <Form
        name="formOutside"
        validators={{
          'user.name': [required()],
          'user.password': [required()],
        }}
        onSubmit={onSubmit}
      >
        <TextField
          data-test="user.name"
          name="user.name"
          label="Name"
        />
        <TextField
          data-test="user.password"
          name="user.password"
          label="Password"
        />
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
          label="Password"
        />
      </div>
    </>
  );
};

export const FieldOverrideValidation = ({ setFormData, onSubmit }: Props) => {
  const { reset } = useFormMethods('formOutside');
  return (
    <>
      <Form
        name="formOutside"
        validators={{
          'user.name': [required()],
          'user.password': [required()],
        }}
        onSubmit={onSubmit}
      >
        <TextField
          data-test="user.name"
          name="user.name"
          label="Name"
          validators={[required({ msg: 'Must have' })]}
        />
        <TextField
          data-test="user.password"
          name="user.password"
          label="Password"
          validators={[required({ msg: 'No way' })]}
        />
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
          passive
          formName="formOutside"
          data-test="user.password-outside"
          name="user.password"
          label="Password"
        />
      </div>
    </>
  );
};

const SimpleFormOne = ({ onSubmit, msg }) => {
  return (
    <Form
      name="simpleForm"
      validators={{
        'user.name': [required({ msg })],
      }}
      onSubmit={onSubmit}
    >
      <TextField
        data-test="user.name"
        name="user.name"
        label="Name"
      />
      <Button data-test="submit" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export const FormValidationUpdate = ({ onSubmit }) => {
  const [msg, setMsg] = useState('Required');
  return (
    <>
      <SimpleFormOne onSubmit={onSubmit} msg={msg}/>
      <div style={{ height: 20 }}/>
      <Button data-test="action" onClick={() => setMsg((it) => `${it}1`)}>
        Action
      </Button>
    </>
  );
};
