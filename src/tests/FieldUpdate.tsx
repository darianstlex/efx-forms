import React from 'react';
import { useUnit } from 'effector-react';

import type { IFormConfig, IFieldConfig } from '../index';
import { useFormInstance } from '../index';
import { TextField } from './components/Input';
import { Button } from './components/Button';
import { UseFormStore } from './components/Hooks';

interface Props {
  fieldConfig: Omit<IFieldConfig, 'name'>;
  setConfig?: (data: { config: IFormConfig; configs: Record<string, IFieldConfig> }) => void;
}

export const FieldUpdate = ({ fieldConfig, setConfig }: Props) => {
  const form = useFormInstance('formFieldUpdate');
  const [reset] = useUnit([form.reset]);

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
      <UseFormStore formName="formFieldUpdate" title="touches" store="$touches"/>
      <Button data-test="reset" onClick={() => reset()}>Reset</Button>
      <span style={{ display: 'inline-block', width: 20 }}/>
      <Button
        data-test="config"
        onClick={() => setConfig?.({ config: form.config, configs: form.configs })}
      >
        Config
      </Button>
    </div>
  );
};
