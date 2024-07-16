import React from 'react';
import { useUnit } from 'effector-react';

import type {IRFormProps, IFormValues, IFormConfig, IFieldConfig} from '../index';
import { Form, Field, useFormInstance } from '../index';
import { required } from '../validators';
import { Input } from './components/Input';
import { Button } from './components/Button';
import { UseFormStore } from './components/Hooks';

interface Props {
  formConfig: IFormConfig;
  fieldConfig: Omit<IFieldConfig, 'name'>;
  setConfig?: (data: { config: IFormConfig; configs: Record<string, IFieldConfig> }) => void;
}

export const FieldUpdate = ({ formConfig, fieldConfig, setConfig }: Props) => {
  const form = useFormInstance('formFieldUpdate');
  form.setConfig(formConfig);
  const [reset] = useUnit([form.reset]);

  return (
    <div style={{ margin: '0 auto', width: 400 }}>
      <Field
        {...fieldConfig}
        formName="formFieldUpdate"
        data-test="user.name"
        name="user.name"
        Field={Input}
        label="Name"
        type="text"
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
