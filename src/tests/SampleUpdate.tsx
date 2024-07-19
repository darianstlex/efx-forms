import React from 'react';

import { getForm } from '../index';
import { Form } from '../index';
import { TextField } from './components/Input';
import { sample } from 'effector';
import { UseFormStore } from './components/Hooks';

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

export const SampleUpdate = () => {
  return (
    <>
      <div style={{width: 400, margin: '20px auto'}}>
        <TextField
          formName="formSampleUpdate"
          data-test="one"
          name="one"
          label="One"
          initialValue={0}
          type="number"
          format={(num: number) => `${num}`}
          parse={(num: number) => Number(num)}
        />
      </div>
      <Form name="formSampleUpdate">
        <TextField
          data-test="two"
          name="two"
          label="Two"
          initialValue={0}
          type="number"
          format={(num: number) => `${num}`}
          parse={(num: number) => Number(num)}
        />
        <TextField
          data-test="three"
          name="three"
          label="Three"
          initialValue={0}
          type="number"
          format={(num: number) => `${num}`}
          parse={(num: number) => Number(num)}
        />
        <UseFormStore title="values" store="$values"/>
      </Form>
    </>
  );
};
