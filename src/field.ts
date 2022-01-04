import { guard, sample } from 'effector';

import { IField, IFieldConfig, IFormHooks, TFieldValue } from './model';

export const fieldConfigDefault: Omit<IFieldConfig, 'name'> = {
  parse: (value) => value,
  format: (value) => value,
  validators: [],
  initialValue: '',
  validateOnBlur: true,
  validateOnChange: false,
};

export const createField = ({ name, ...fieldConfig }: Omit<IFieldConfig, 'format'>, {
  formDomain,
  onFormSubmit,
  onFormUpdate,
  onFormReset,
  onFormErrors,
  setFormChange,
  setFormActive,
  setFormError,
  setFormDirty,
  setFormTouch,
  setFormValue,
}: IFormHooks): IField => {
  let config = { name, ...fieldConfig };

  const fieldDomain = formDomain.domain(`@${name}`);

  const update = fieldDomain.event<TFieldValue>('update');
  const validate = fieldDomain.event<void>('validate');
  const setActive = fieldDomain.event<boolean>('active');
  const setError = fieldDomain.event<string>('push-error');
  const resetError = fieldDomain.event<void>('reset-error');
  const onChange = fieldDomain.event<TFieldValue>('onChange');
  const onBlur = fieldDomain.event<void>('onBlur');
  const reset = fieldDomain.event<void>('reset');

  /**
   * Field value store
   */
  const $value = fieldDomain.store<TFieldValue>(config.initialValue, { name: '$value' })
    .on(update, (_, value) => value)
    .on(onChange, (_, value) => config.parse(value))
    .on(reset, () => config.initialValue || null);

  /**
   * Trigger form change on field onChange event
   */
  sample({
    source: onChange,
    fn: (value) => ({ name, value }),
    target: setFormChange,
  });

  /**
   * Updates form values on field value changes
   */
  sample({
    source: $value,
    fn: (value) => ({ name, value }),
    target: setFormValue,
  });

  /**
   * Field dirty store - true if diff to initial value
   */
  const $dirty = fieldDomain.store<boolean>(false, { name: '$dirty' })
    .on(onChange, (_, value) => value !== config.initialValue)
    .reset(reset);

  /**
   * Updates form dirties on field dirty change
   */
  sample({
    source: $dirty,
    fn: (dirty) => ({ name, dirty }),
    target: setFormDirty,
  });

  /**
   * Field touched store - true onChange
   */
  const $active = fieldDomain.store<boolean>(false, { name: '$active' })
    .on(setActive, (_, active) => active);

  /**
   * Update form active fields on activity change
   */
  sample({
    source: $active,
    fn: (active) => ({ name, active }),
    target: setFormActive,
  });

  /**
   * Field touched store - true onChange
   */
  const $touched = fieldDomain.store<boolean>(false, { name: '$touched' })
    .on(onChange, () => true)
    .reset(reset);

  /**
   * Detect changes after blur to run validation
   */
  const $hasChanges = fieldDomain.store<boolean>(false, { name: '$has-changes' })
    .on(onChange, () => true)
    .on([validate, onFormSubmit], () => false)
    .reset(reset);

  /**
   * Updates form touches on field touched
   */
  sample({
    source: $touched,
    fn: (touched) => ({ name, touched }),
    target: setFormTouch,
  });

  /**
   * Errors store - calculated on validation
   */
  const $errors = fieldDomain.store<string[]>([], {
    name: '$errors',
    updateFilter: (curr, prev) => JSON.stringify(curr) !== JSON.stringify(prev),
  }).on(
    sample({
      clock: [validate, onFormSubmit, update],
      source: $value,
      fn: (value) => config.validators.map((vd) => vd(value)).filter(Boolean) as string[],
    }),
    (_, errors) => errors,
  ).on(
    onFormErrors,
    (_, errors) => (errors[name] ? [errors[name] as string] : []),
  ).on(setError, (_, error) => [error]).reset([resetError, reset]);

  /**
   * Updates form errors on field validation change
   */
  sample({
    source: $errors,
    fn: ([error = null]) => ({ name, error }),
    target: setFormError,
  });

  /**
   * Validate field onBlur if field is touched and has changes
   * from the last blur event and validateOnBlur is set
   */
  guard({
    clock: onBlur,
    source: [$touched, $hasChanges],
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
    clock: onFormReset,
    source: [$touched, $errors],
    filter: ([touched, [error]]) => touched || !!error,
    target: reset,
  });

  /**
   * Update field on form update event
   */
  sample({
    clock: onFormUpdate.filterMap(({ [name]: value }) => value),
    target: update,
  });

  /**
   * Sync field data to form on initial setup
   */
  const syncData = () => {
    setFormValue({ name, value: $value.getState() });
    const [error = null] = $errors.getState();
    setFormError({ name, error });
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
    set config({ name, ...fieldConfig}) {
      config = { ...config, ...fieldConfig };
    },
  };
};
