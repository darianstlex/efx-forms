import './index.css';

import { beforeMount } from '@playwright/experimental-ct-react/hooks';
import { Provider } from 'effector-react';
import { fork } from 'effector';

beforeMount(async ({ App }) => {
  const scope = fork();
  return <Provider value={scope}><App /></Provider>;
});
