import { attach, combine, sample } from 'effector';
import type { Effect } from 'effector';
import isEmpty from 'lodash/isEmpty';
import pickBy from 'lodash/pickBy';

import { domain, hasTruthy } from './utils';

import type {
  IFieldConfig,
  IForm,
  IFormConfig,
  IFormOnSubmitArgs,
  INameErrors,
  INameBoolean,
  INameValue,
  ISubmitArgs,
  ISubmitResponseError,
  ISubmitResponseSuccess,
  IValidationParams,
} from './types';

import { FORM_CONFIG, FIELD_CONFIG } from './constants';

export const createFormHandler = (formConfig: IFormConfig): IForm => {
  const data = {
    config: { ...FORM_CONFIG, ...formConfig },
    configs: {},
  } as { config: IFormConfig, configs: Record<string, IFieldConfig> };

  const dm = domain.domain(formConfig.name);

  const setActive = dm.event<INameBoolean>('set-active');
  const setError = dm.event<INameErrors>('set-error');
  const setErrors = dm.event<Record<string, string[] | null>>('set-errors');
  const setValues = dm.event<Record<string, any>>('set-values');
  const onChange = dm.event<INameValue>('on-change');
  const onBlur = dm.event<INameValue>('on-blur');
  const reset = dm.event<string | void>('reset');
  const erase = dm.event<void>('erase');
  const validate = dm.event<IValidationParams>('validate');

  /**
   * Fields status store - keeps fields activity / visibility status
   */
  const $active = dm.store<Record<string, boolean>>({}, { name: '$active'})
    .on(setActive, (
      state,
      { name, value }) => ({ ...state, [name]: value }),
    ).reset(erase);

  /**
   * Values store - fields values
   */
  const $values = dm.store<Record<string, any>>({}, { name: '$values'})
    .on(setValues, (state, values) => ({ ...state, ...values }))
    .on(onChange, (state, { name, value }) => {
      const parse = data.configs[name]?.parse || FIELD_CONFIG.parse!;
      return { ...state, [name]: parse(value) };
    })
    .reset(erase);

  /**
   * Fields status store - keeps active fields values
   */
  const $activeValues = combine(
    $active,
    $values,
    (active, values) => pickBy(values, (_, name) => active[name]),
  );

  /**
   * Validations store - keeps all fields validation errors
   */
  const $errors = dm.store<Record<string, string[]>>({}, { name: '$errors'})
    .on(setError, (
      state,
      { name, errors }) => pickBy({ ...state, [name]: errors }, (error) => !!error),
    ).on(setErrors, (
      state,
      errors) => pickBy({ ...state, ...errors }, (error) => !!error),
    ).reset(erase, reset);

  /**
   * Errors store - keeps all fields validation errors
   */
  const $error = $errors.map((errors) => {
    return Object.keys(errors).reduce((acc, key) => ({
      ...acc,
      [key]: errors[key][0],
    }), {});
  });

  /**
   * Calculates form valid state
   */
  const $valid = $error.map((state) => !isEmpty(state) ? !hasTruthy(state) : true);

  /**
   * Touches store - keeps all fields touch state
   */
  const $touches = dm.store<Record<string, boolean>>({}, { name: '$touches'})
    .on(onChange, (
      state,
      { name }) => ({ ...state, [name]: true }),
    ).reset(erase, reset);

  /**
   * Calculates form touched state
   */
  const $touched = $touches.map((state) => !isEmpty(state) ? hasTruthy(state) : false);

  /**
   * Dirties store - keeps all active fields dirty state
   */
  const $dirties = $activeValues.map((values) => {
    const dirties = Object.keys(values).reduce((acc, field: string) => {
      const initialValue = data.configs[field]?.initialValue || data.config.initialValues?.[field];
      acc[field] = values[field] !== initialValue;
      return acc;
    }, {} as Record<string, boolean>);
    return pickBy(dirties, (dirty) => dirty);
  });

  /**
   * Calculates form dirty state
   */
  const $dirty = $dirties.map((state) => !isEmpty(state) ? hasTruthy(state) : false);

  /**
   * Reset form value/values to the initial value
   */
  sample({
    clock: reset,
    source: { values: $values },
    fn: ({ values }, field) => {
      return field ? {
        ...values,
        [field]: data.configs?.[field]?.initialValue || data.config.initialValues?.[field],
      } : Object.keys(values).reduce((acc, key) => ({
        ...acc,
        [key]: data.configs?.[key]?.initialValue || data.config.initialValues?.[key],
      }), {});
    },
    target: $values,
  });

  /**
   * Form submit effect.
   * If callback is promise and returns errors object, will be highlighted in the
   * corresponded fields: { fieldName: 'Name already exist' }.
   * Return values on success and errors on error
   */
  const onSubmit: Effect<
    IFormOnSubmitArgs,
    ISubmitResponseSuccess,
    ISubmitResponseError
  > = dm.effect({
    handler: async ({
      cb,
      values,
      errors,
      valid,
      skipClientValidation,
    }) => {
      if (valid || skipClientValidation) {
        try {
          await cb?.(values);
          return Promise.resolve({ values });
        } catch (remoteErrors) {
          console.log('ERRORS: ', remoteErrors);
          return Promise.reject({ remoteErrors });
        }
      }
      return Promise.reject({ errors });
    },
    name: `@fx-forms/${formConfig.name}/submit`,
  });

  /**
   * Form submit attached effect, triggers fields validation if not skipped,
   * attach data needed to process onSubmit effect.
   */
  const submit: Effect<
    ISubmitArgs,
    ISubmitResponseSuccess,
    ISubmitResponseError
  > = attach({
    source: { values: $values, errors: $error, valid: $valid },
    mapParams: (
      { cb, skipClientValidation },
      { values, errors, valid },
    ) => ({ cb, values, errors, valid, skipClientValidation: skipClientValidation || data.config.skipClientValidation }),
    effect: onSubmit,
    name: `@fx-forms/${formConfig.name}/attach-submit`,
  });


  /**
   * Form validation logic
   */
  sample({
    clock: [validate, sample({
      clock: submit,
      filter: ({ skipClientValidation }) => !skipClientValidation,
      fn: () => ({}) as IValidationParams,
    })],
    source: { values: $values, active: $active },
    filter: (_, source) => !source?.name,
    fn: ({ values, active }) => {
      return Object.keys(active).reduce((acc, field) => {
        const validators = data.configs[field].validators || data.config.validators?.[field] || [];
        const errors = validators.map((vd) => vd(values[field], values)).filter(Boolean) as string[];
        return { ...acc, [field]: errors.length ? errors : null };
      }, {});
    },
    target: setErrors,
  });

  /**
   * Field validation logic
   */
  sample({
    clock: validate,
    source: { values: $values },
    filter: (_, source) => !!source?.name,
    fn: ({ values }, source) => {
      const validators = data.configs[source?.name as string].validators || data.config.validators?.[source?.name as string] || [];
      const errors = validators.map((vd) => vd(values[source?.name as string], values)).filter(Boolean) as string[];
      return { name: source?.name as string, errors: errors.length ? errors : null };
    },
    target: setError,
  });

  setErrors.watch((errs) => console.log('SET_ERRORS', errs));

  /**
   * Validate field onBlur if the field is touched and validateOnBlur is set
   */
  sample({
    clock: onBlur,
    source: { touches: $touches, active: $active },
    filter: ({ touches }, { name }) => touches[name] && (data.configs?.[name]?.validateOnBlur || !!data.config.validateOnBlur),
    fn: (_, { name }) => ({ name }),
    target: validate,
  });

  /**
   * Validate field onChange if the field is touched and validateOnChange is set
   */
  sample({
    clock: onChange,
    filter: ({ name }) => (data.configs?.[name]?.validateOnChange || !!data.config.validateOnChange),
    fn: ({ name }) => ({ name }),
    target: validate,
  });

  /**
   * Reset errors on change if validateOnChange is disabled
   */
  sample({
    clock: onChange,
    fn: ({ name }) => ({ name, errors: null }),
    filter: ({ name }) => !(data.configs?.[name]?.validateOnChange || !!data.config.validateOnChange),
    target: setError,
  });

  /**
   * Reset errors on setValues
   */
  sample({
    clock: setValues,
    fn: (values) => Object.keys(values).reduce((acc, field) => ({ ...acc, [field]: null }), {}),
    target: setErrors,
  });

  /**
   * Erase form configs
   */
  sample({
    clock: erase,
    fn: () => {
      data.config = { ...FORM_CONFIG };
      data.configs = {};
    },
  });

  /**
   * Set submit remote validation errors
   */
  sample({
    clock: submit.failData,
    filter: (it) => !!it.remoteErrors,
    fn: ({ remoteErrors }) => {
      return Object.keys(remoteErrors!).reduce((acc, key) => ({
        ...acc,
        [key]: [remoteErrors?.[key]].filter(Boolean),
      }), {});
    },
    target: setErrors,
  });

  return {
    domain: dm,
    name: formConfig.name,
    $active,
    $activeValues,
    $error,
    $errors,
    $dirty,
    $dirties,
    $submitting: onSubmit.pending,
    $touched,
    $touches,
    $valid,
    $values,
    erase,
    onBlur,
    onChange,
    reset,
    setActive,
    setValues,
    submit,
    validate,
    get config() {
      return data.config;
    },
    setConfig: (cfg: IFormConfig) => {
      data.config = { ...FORM_CONFIG, ...cfg };
    },
    get configs() {
      return data.configs;
    },
    setFieldConfig: (cfg: IFieldConfig) => {
      data.configs[cfg.name] = { ...FIELD_CONFIG, ...cfg };
    },
  };
};
