import React from 'react';
import { useUnit } from 'effector-react';

import type {IRFormProps, IFormValues, IFormConfig, IFieldConfig} from '../index';
import { Form, Field, useFormInstance } from '../index';
import { required } from '../validators';
import { Input } from './components/Input';
import { Button } from './components/Button';
import { UseFormStore } from './components/Hooks';

interface Props extends Partial<IRFormProps> {
  setConfig?: (data: { config: IFormConfig; configs: Record<string, IFieldConfig> }) => void;
}

export const Update = (props: Props) => {
  const form = useFormInstance('formUpdate');
  const [reset] = useUnit([form.reset]);
  const submit = async (values: IFormValues) => {
    console.log(values);
    return Promise.reject({
      'user.name': 'This user is taken',
    });
  };
  return (
    <Form name="formUpdate" {...props} onSubmit={submit}>
      <Field
        data-test="user.name"
        name="user.name"
        Field={Input}
        label="Name"
        type="text"
        validateOnChange={!props.validateOnChange}
        validators={[required()]}
      />
      <Field
        data-test="user.password"
        name="user.password"
        Field={Input}
        label="Password"
        type="text"
        validators={[required()]}
      />
      <UseFormStore title="values" store="$values"/>
      <UseFormStore title="touches" store="$touches"/>
      <Button data-test="submit" type="submit">Submit</Button>
      <span style={{display: 'inline-block', width: 20}}/>
      <Button data-test="reset" onClick={() => reset()}>Reset</Button>
      <span style={{display: 'inline-block', width: 20}}/>
      <Button
        data-test="config"
        onClick={() => props?.setConfig?.({config: form.config, configs: form.configs})}
      >
        Config
      </Button>
    </Form>
  );
};
