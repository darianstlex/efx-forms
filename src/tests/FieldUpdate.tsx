import React from 'react';

import type { IFieldConfig } from '../index';
import { useFormMethods } from '../useFormMethods';
import { TextField } from './components/Input';
import { Button } from './components/Button';
import type { SendFormDataProps } from './components/Hooks';
import { SendFormData, UseFormStore } from './components/Hooks';

interface Props {
  fieldConfig: Omit<IFieldConfig, 'name'>;
  setFormData: SendFormDataProps['onSend'];
}

export const FieldUpdate = ({ fieldConfig, setFormData }: Props) => {
  const { reset } = useFormMethods('formFieldUpdate');

  return (
    <div style={{ margin: '20px auto', width: 400 }}>
      <TextField
        {...fieldConfig}
        formName="formFieldUpdate"
        data-test="user.name"
        name="user.name"
        label="Name"
      />
      <UseFormStore formName="formFieldUpdate" title="values" store="$values"/>
      <UseFormStore
        formName="formFieldUpdate"
        title="touches"
        store="$touches"
      />
      <Button data-test="reset" onClick={() => reset()}>
        Reset
      </Button>
      <span style={{ display: 'inline-block', width: 20 }}/>
      <SendFormData name="formFieldUpdate" onSend={setFormData}/>
    </div>
  );
};
