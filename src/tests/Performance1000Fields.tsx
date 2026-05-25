import React from 'react';

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

export const Performance1000Fields = ({ setFormData, onSubmit }: Props) => {
  const { reset } = useFormMethods('performance-form');
  
  // Generate 1000 field names
  const fieldNames = React.useMemo(() => {
    return Array.from({ length: 1000 }, (_, i) => `field_${i}`);
  }, []);

  return (
    <>
      <Form
        name="performance-form"
        validators={{
          field_0: [required()],
          field_500: [required()],
          field_999: [required()],
        }}
        onSubmit={onSubmit}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
          {fieldNames.map((name, index) => (
            <TextField
              key={name}
              data-test={`field_${index}`}
              name={name}
              label={`Field ${index}`}
              placeholder={`Field ${index}...`}
            />
          ))}
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <Button data-test="submit" type="submit">
            Submit
          </Button>
          <span style={{ display: 'inline-block', width: 20 }}/>
          <Button secondary data-test="reset" onClick={() => reset()}>
            Reset
          </Button>
          <span style={{ display: 'inline-block', width: 20 }}/>
          <SendFormData onSend={setFormData} name="performance-form" />
        </div>
      </Form>
    </>
  );
};
