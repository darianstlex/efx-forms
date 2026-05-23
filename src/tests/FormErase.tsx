import React from 'react';

import type { IRFormProps } from '../index';
import { Form } from '../index';
import { useFormMethods } from '../useFormMethods';
import { TextField } from './components/Input';
import { Button } from './components/Button';
import type { SendFormDataProps } from './components/Hooks';
import { SendFormData, UseFormStore } from './components/Hooks';

interface Props extends Partial<IRFormProps> {
  setFormData: SendFormDataProps['onSend'];
}

export const FormErase = ({ setFormData, onSubmit, ...props }: Props) => {
  const { reset, erase } = useFormMethods('erase-test');
  return (
    <Form
      name="erase-test"
      initialValues={{ 'field1': 'initial1', 'field2': 'initial2' }}
      onSubmit={onSubmit}
      {...props}
    >
      <TextField
        data-test="field1"
        name="field1"
        label="Field 1"
      />
      <TextField
        data-test="field2"
        name="field2"
        label="Field 2"
      />
      <UseFormStore title="values" store="$values" />
      <UseFormStore title="touched" store="$touched" />
      <UseFormStore title="dirty" store="$dirty" />
      <UseFormStore title="touches" store="$touches" />
      <UseFormStore title="dirties" store="$dirties" />
      <Button data-test="erase" onClick={() => erase()}>
        Erase
      </Button>
      <span style={{ display: 'inline-block', width: 20 }} />
      <Button secondary data-test="reset" onClick={() => reset()}>
        Reset
      </Button>
      <span style={{ display: 'inline-block', width: 20 }} />
      <SendFormData onSend={setFormData} />
    </Form>
  );
};

export const FormResetField = ({ setFormData }: Props) => {
  const { resetField } = useFormMethods('reset-field-test');
  return (
    <Form
      name="reset-field-test"
      initialValues={{ 'field1': 'initial1', 'field2': 'initial2' }}
    >
      <TextField
        data-test="field1"
        name="field1"
        label="Field 1"
      />
      <TextField
        data-test="field2"
        name="field2"
        label="Field 2"
      />
      <UseFormStore title="values" store="$values" />
      <Button data-test="reset-field1" onClick={() => resetField('field1')}>
        Reset Field 1
      </Button>
      <SendFormData onSend={setFormData} />
    </Form>
  );
};

export const FormResetUntouched = ({ setFormData }: Props) => {
  const { resetUntouched } = useFormMethods('reset-untouched-test');
  return (
    <Form
      name="reset-untouched-test"
      initialValues={{
        'field1': 'initial1',
        'field2': 'initial2',
        'field3': 'initial3',
      }}
    >
      <TextField
        data-test="field1"
        name="field1"
        label="Field 1"
      />
      <TextField
        data-test="field2"
        name="field2"
        label="Field 2"
      />
      <TextField
        data-test="field3"
        name="field3"
        label="Field 3"
      />
      <UseFormStore title="values" store="$values" />
      <Button
        data-test="reset-untouched"
        onClick={() => resetUntouched(['field2', 'field3'])}
      >
        Reset Untouched
      </Button>
      <SendFormData onSend={setFormData} />
    </Form>
  );
};
