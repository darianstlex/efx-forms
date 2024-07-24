import React from 'react';

import { getForm, type IRFormProps } from '../index';
import { Form } from '../index';
import { NumberField } from './components/Input';
import { sample } from 'effector';
import type { SendFormDataProps } from './components/Hooks';
import { SendFormData, UseFormStore } from './components/Hooks';

const form = getForm({ name: 'formSampleUpdate' });

sample({
  clock: form.onChange,
  source: form.$values,
  filter: (_, { name }) => name === 'one',
  fn: (values, { value }) => ({
    two: Number(value) * 2,
  }),
  target: form.setValues,
});

sample({
  clock: form.onChange,
  source: form.$values,
  filter: (values, { name }) => name === 'two',
  fn: (values, { value }) => ({
    three: Number(value) * 3,
  }),
  target: form.setValues,
});

sample({
  clock: form.onChange,
  source: form.$values,
  filter: (values, { name }) => name === 'three',
  fn: (values, { value }) => ({
    one: Number(value) / 3,
  }),
  target: form.setValues,
});

interface Props extends Partial<IRFormProps> {
  setFormData: SendFormDataProps['onSend'];
}

export const SampleUpdate = ({ setFormData, ...props }: Props) => {
  return (
    <>
      <div style={{ width: 400, margin: '20px auto' }}>
        <NumberField
          formName="formSampleUpdate"
          data-test="one"
          name="one"
          label="One"
          initialValue={55}
        />
      </div>
      <Form
        name="formSampleUpdate"
        initialValues={{ one: 0, two: 0, three: 0 }}
        {...props}
      >
        <NumberField data-test="two" name="two" label="Two" />
        <NumberField data-test="three" name="three" label="Three"/>
        <UseFormStore title="values" store="$values"/>
        <SendFormData onSend={setFormData}/>
      </Form>
    </>
  );
};
