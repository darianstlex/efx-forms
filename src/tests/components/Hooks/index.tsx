import type { TFormStoreKey } from '../../../types';
import { useFormStore } from '../../../useFormStore';

const mapValue = (val: any) => {
  if (val === '') return '';
  if (val === undefined) return 'undefined';
  if (val === null) return 'null';
  return val;
};


const Display = ({ title, data }: { title: string, data: any }) => (
  <div style={{ padding: 10, marginBottom: 20, border: 'solid 1px grey' }}>
    <div style={{ margin: 10 }}>{title}</div>
    <pre data-test={`${title}-result`} style={{ margin: '10px 10px', textAlign: 'left', fontSize: '12px' }}>
      {JSON.stringify(data, (k, v) => mapValue(v), 2)}
    </pre>
  </div>
);

export const UseFormStore = ({ title = 'Block', store, formName }: {
  title?: string;
  store: TFormStoreKey;
  formName?: string;
}) => {
  const value = useFormStore(store, formName);
  return (<Display title={title} data={value} />);
};

