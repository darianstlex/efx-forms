import React from 'react';

import type { IRFormProps } from '../index';
import { Form } from '../index';
import { IfFormValues } from '../IfFormValues';
import { IfFieldValue } from '../IfFieldValue';
import { TextField } from './components/Input';
import { CheckboxField } from './components/Checkbox';
import type { SendFormDataProps } from './components/Hooks';
import { SendFormData, UseFormStore } from './components/Hooks';

interface Props extends Partial<IRFormProps> {
  setFormData: SendFormDataProps['onSend'];
}

export const IfFormValuesBasic = ({ setFormData }: Props) => {
  return (
    <Form name="if-form-values-test">
      <TextField
        data-test="age"
        name="age"
        label="Age"
        type="number"
      />
      <IfFormValues
        check={(values) => (values['age'] as number) >= 18}
      >
        <div data-test="adult-content">Adult content visible</div>
      </IfFormValues>
      <UseFormStore title="values" store="$values" />
      <SendFormData onSend={setFormData} />
    </Form>
  );
};

export const IfFormValuesSetTo = ({ setFormData }: Props) => {
  return (
    <Form name="if-form-values-setto-test">
      <CheckboxField
        data-test="newsletter"
        name="newsletter"
        label="Newsletter"
      />
      <TextField
        data-test="email"
        name="email"
        label="Email"
      />
      <IfFormValues
        check={(values) => values['newsletter'] === true}
        setTo={{ email: 'subscribe@example.com' }}
      >
        <div data-test="newsletter-active">Newsletter active</div>
      </IfFormValues>
      <UseFormStore title="values" store="$values" />
      <SendFormData onSend={setFormData} />
    </Form>
  );
};

export const IfFormValuesResetTo = ({ setFormData }: Props) => {
  return (
    <Form name="if-form-values-resetto-test">
      <CheckboxField
        data-test="showExtra"
        name="showExtra"
        label="Show Extra"
      />
      <TextField
        data-test="extra"
        name="extra"
        label="Extra Field"
      />
      <IfFormValues
        check={(values) => values['showExtra'] === true}
        resetTo={{ extra: '' }}
      >
        <div data-test="extra-visible">Extra visible</div>
      </IfFormValues>
      <UseFormStore title="values" store="$values" />
      <SendFormData onSend={setFormData} />
    </Form>
  );
};

export const IfFieldValueBasic = ({ setFormData }: Props) => {
  return (
    <Form name="if-field-value-test">
      <TextField
        data-test="status"
        name="status"
        label="Status"
      />
      <IfFieldValue
        field="status"
        check={(value) => value === 'active'}
      >
        <div data-test="active-status">Status is active</div>
      </IfFieldValue>
      <UseFormStore title="values" store="$values" />
      <SendFormData onSend={setFormData} />
    </Form>
  );
};

export const IfFieldValueRender = ({ setFormData }: Props) => {
  return (
    <Form name="if-field-value-render-test">
      <TextField
        data-test="status"
        name="status"
        label="Status"
      />
      <IfFieldValue
        field="status"
        check={(value) => value === 'active'}
        render={(value) => (
          <div data-test="status-render">Status: {value as string}</div>
        )}
      />
      <UseFormStore title="values" store="$values" />
      <SendFormData onSend={setFormData} />
    </Form>
  );
};

export const IfNestedConditionals = ({ setFormData }: Props) => {
  return (
    <Form name="nested-conditionals-test">
      <CheckboxField
        data-test="enabled"
        name="enabled"
        label="Enabled"
      />
      <TextField
        data-test="level"
        name="level"
        label="Level"
        type="number"
      />
      <IfFieldValue
        field="enabled"
        check={(value) => value === true}
      >
        <IfFormValues
          check={(values) => (values['level'] as number) >= 10}
        >
          <div data-test="high-level">High level enabled</div>
        </IfFormValues>
      </IfFieldValue>
      <UseFormStore title="values" store="$values" />
      <SendFormData onSend={setFormData} />
    </Form>
  );
};
