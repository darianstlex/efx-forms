import { guard, sample } from 'effector';

import { domain } from './utils';
import { IField, IFieldConfig, IFormHooks, TFieldValue } from './model';

const { store, event } = domain;

export const fieldConfigDefault: Omit<IFieldConfig, 'name'> = {
  parse: value => value,
  format: value => value,
  validators: [],
  initialValue: '',
  validateOnBlur: true,
  validateOnChange: false,
};

export const createField = ({ name, ...fieldConfig }: Omit<IFieldConfig, 'format'>, {
  formChange,
  resetField,
  updateActive,
  updateError,
  updateDirty,
  updateTouch,
  updateValue,
  setRemoteErrors,
}: IFormHooks): IField => {
  let config = { name, ...fieldConfig };

  const update = event<TFieldValue>(`${name}-field-update`);
  const validate = event<void>(`${name}-field-validate`);
  const setActive = event<boolean>(`${name}-field-active`);
  const setError = event<string>(`${name}-field-push-error`);
  const resetError = event<void>(`${name}-field-reset-error`);
  const onChange = event<TFieldValue>(`${name}-field-onChange`);
  const onBlur = event<void>(`${name}-field-onBlur`);
  const reset = event<void>(`${name}-field-reset`);

  /**
   * Field value store
   */
  const $value = store<TFieldValue>(config.initialValue, { name: `$${name}-field-value` })
    .on(update, (_, value) => value)
    .on(onChange, (_, value) => config.parse(value))
    .on(reset, () => config.initialValue || null);

  /**
   * Trigger form change on field onChange event
   */
  sample({
    source: onChange,
    fn: (value) => ({ name, value }),
    target: formChange,
  });

  /**
   * Updates form values on field value changes
   */
  sample({
    source: $value,
    fn: (value) => ({ name, value }),
    target: updateValue,
  });

  /**
   * Field dirty store - true if diff to initial value
   */
  const $dirty = store<boolean>(false, { name: `$${name}-field-dirty` })
    .on(onChange, (_, value) => value !== config.initialValue)
    .reset(reset);

  /**
   * Updates form dirties on field dirty change
   */
  sample({
    source: $dirty,
    fn: (dirty) => ({ name, dirty }),
    target: updateDirty,
  });

  /**
   * Field touched store - true onChange
   */
  const $active = store<boolean>(false, { name: `$${name}-field-active` })
    .on(setActive, (_, active) => active)
    .reset(reset);

  /**
   * Update form active fields on activity change
   */
  sample({
    source: $active,
    fn: (active) => ({ name, active }),
    target: updateActive,
  });

  /**
   * Field touched store - true onChange
   */
  const $touched = store<boolean>(false, { name: `$${name}-field-touched` })
    .on(onChange, () => true)
    .reset(reset);

  /**
   * Detect changes after blur to run validation
   */
  const $changedAfterBlur = store<boolean>(false, { name: `$${name}-field-changed-after-blur` })
    .on(onChange, () => true)
    .on(validate, () => false)
    .reset(reset);

  /**
   * Updates form touches on field touched
   */
  sample({
    source: $touched,
    fn: (touched) => ({ name, touched }),
    target: updateTouch,
  });

  /**
   * Errors store - calculated on validation
   */
  const $errors = store<string[]>([], {
    name: `$${name}-field-errors`,
    updateFilter: (curr, prev) => JSON.stringify(curr) !== JSON.stringify(prev),
  }).on(
    sample({
      clock: validate,
      source: $value,
      fn: (value) => config.validators.map((vd) => vd(value)).filter(Boolean) as string[],
    }),
    (_, errors) => errors,
  ).on(
    setRemoteErrors,
    (_, { remoteErrors = {} }) => (remoteErrors[name] ? [remoteErrors[name]] : []),
  ).on(setError, (_, error) => ([error])).reset([resetError, reset]);

  /**
   * Updates form errors on field validation change
   */
  sample({
    source: $errors,
    fn: ([error = null]) => ({ name, error }),
    target: updateError,
  });

  /**
   * Validate field onBlur if field is touched and has changes
   * from the last blur event and validateOnBlur is set
   */
  guard({
    clock: onBlur,
    source: [$touched, $changedAfterBlur],
    filter: ([touched, changed]) => changed && touched && config.validateOnBlur && !config.validateOnChange,
    target: validate,
  });

  /**
   * Validate field onChange if field is touched and validateOnChange is set
   */
  guard({
    clock: onChange,
    source: $touched,
    filter: (touched) => touched && config.validateOnChange,
    target: validate,
  });

  /**
   * Reset field on form reset event if field is touched or has errors
   */
  guard({
    clock: resetField,
    source: [$touched, $errors],
    filter: ([touched, [error]]) => touched || !!error,
    target: reset,
  });

  /**
   * Sync field data to form on initial setup
   */
  const syncData = () => {
    updateValue({ name, value: $value.getState() });
    const [error = null] = $errors.getState();
    updateError({ name, error });
  };

  return {
    name,
    $active,
    $value,
    $touched,
    $dirty,
    $errors,
    onChange,
    onBlur,
    update,
    reset,
    validate,
    setActive,
    setError,
    resetError,
    syncData,
    get active() {
      return $active.getState();
    },
    get config() {
      return config;
    },
    set config(data) {
      config = { ...config, ...data };
    },
  };
};
