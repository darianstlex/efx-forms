---
sidebar_position: 1
---

# Introduction

EFX-Forms is an Effector-based React form library that provides powerful state management for your forms with built-in validation, conditional rendering, and reactive data flow.

## What is EFX-Forms?

EFX-Forms leverages Effector's reactive stores and effects to manage form state. Unlike traditional form libraries, it uses Effector's store system to track values, errors, validation state, and field activity - all reactively.

## Key Features

- **Reactive State Management**: Built on Effector stores for predictable state flow
- **Built-in Validators**: Common validators like `required`, `email`, and more
- **Conditional Rendering**: Components like `IfFormValues` and `IfFieldValue` for dynamic forms
- **Flat Values with Shape Support**: Store values flat (`address[0]`) but shape them for use (`address: []`)
- **Dual CJS/ESM Build**: Works with any modern React setup

## Quick Links

- [Installation](./installation.md) - Set up EFX-Forms in your project
- [Quickstart](./quickstart.md) - Build your first form in minutes
- [API Reference](./api/components.md) - Complete component and hook documentation

## Peer Dependencies

EFX-Forms requires the following peer dependencies:

- `react` (`>=16.8.0 <20.0.0`)
- `effector` (`>=23.0.0 <24.0.0`)
- `effector-react` (`>=23.0.0 <24.0.0`)
- `lodash` (`^4.17.0`)

Make sure these are installed in your project before using EFX-Forms.
