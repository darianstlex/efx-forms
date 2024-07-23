import React from 'react';

import type { IFieldConfig, IFormConfig, TFormStoreKey } from '../../../types';
import { useFormStore } from '../../../useFormStore';
import { useFormInstance } from '../../../useFormInstance';
import { useFormData } from '../../../useFormData';
import { Button } from '../Button';

const mapValue = (val: any) => {
  if (val === '') return '';
  if (val === undefined) return 'undefined';
  if (val === null) return 'null';
  return val;
};

const Display = ({ title, data }: { title: string; data: any }) => (
  <div style={{ padding: 10, marginBottom: 20, border: 'solid 1px grey' }}>
    <div style={{ margin: 10 }}>{title}</div>
    <pre
      data-test={`${title}-result`}
      style={{ margin: '10px 10px', textAlign: 'left', fontSize: '12px' }}
    >
      {JSON.stringify(data, (k, v) => mapValue(v), 2)}
    </pre>
  </div>
);

export const UseFormStore = ({
  title = 'Block',
  store,
  formName,
}: {
  title?: string;
  store: TFormStoreKey;
  formName?: string;
}) => {
  const value = useFormStore(store, formName);
  return <Display title={title} data={value} />;
};

export interface OnSendParams {
  config: IFormConfig,
  configs: Record<string, IFieldConfig>,
  form: ReturnType<typeof useFormData>,
}

export interface SendFormDataProps {
  name?: string;
  onSend: (data: OnSendParams) => void;
}

export const SendFormData = ({ name, onSend }: SendFormDataProps) => {
  const form = useFormInstance(name);
  const data = useFormData(name);

  const onClick = () => {
    onSend({
      config: form.config,
      configs: form.configs,
      form: data,
    });
  };

  return (
    <Button data-test="send-form-data" onClick={onClick}>
      Set Data
    </Button>
  );
};
