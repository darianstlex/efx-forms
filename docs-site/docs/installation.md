---
sidebar_position: 2
---

# Installation

## Prerequisites

Before installing EFX-Forms, ensure you have a React project set up with the required peer dependencies.

## Install Package

Install EFX-Forms using npm:

```bash
npm install efx-forms
```

## Install Peer Dependencies

EFX-Forms depends on the following peer dependencies. If they're not already in your project, install them:

```bash
npm install react effector effector-react lodash
```

**Version Requirements:**

| Package | Version |
|---------|---------|
| react | `>=16.8.0 <20.0.0` |
| effector | `>=23.0.0 <24.0.0` |
| effector-react | `>=23.0.0 <24.0.0` |
| lodash | `^4.17.0` |

## Verify Installation

Once installed, you can import EFX-Forms components in your React components:

```tsx
import { Form, Field } from 'efx-forms';
```

## Build Variants

EFX-Forms ships with both CommonJS and ES Modules builds:

- **CommonJS**: Default import from `'efx-forms'`
- **ESM**: Available in the `lib/mjs/` directory for modern bundlers

No additional configuration is needed - your bundler will automatically pick the appropriate build.

## Next Steps

Now that EFX-Forms is installed, check out the [Quickstart](./quickstart.md) guide to build your first form.
