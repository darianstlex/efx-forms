import { combine, Effect, guard, sample } from 'effector';
import isEmpty from 'lodash-es/isEmpty';
import pickBy from 'lodash-es/pickBy';

import { domain } from './utils';
import { createField } from './field';
import {
  IFormErrorUpdate,
  IFormConfig,
  IFormErrors,
  IFormTouches,
  IFormToucheUpdate,
  IFormValues,
  IFormValueUpdate,
  IFormOnFieldChange,
  IFormSubmitArgs,
  IFormSubmitResponseError,
  IForms,
  IForm,
  IFormFields,
  IFormConfigDefault,
  IFormActive,
  IFormActiveUpdate,
} from './model';

const { store, effect, event } = domain;

export const formConfigDefault: IFormConfigDefault = {
  name: 'default',
  initialValues: {},
  onSubmit: () => {},
  remoteValidation: false,
  skipClientValidation: false,
  validateOnBlur: true,
  validateOnChange: false,
  validations: {},
};

export const forms: IForms = {
  [formConfigDefault.name]: {} as IForm,
};

const hasTruthy = (object) => Object.values(object).some((it) => it);

const createFormHandler = (formConfig: IFormConfig): IForm => {
  let config: IFormConfig = { ...formConfig };
  const { name } = formConfig;

  const fields: IFormFields = {};

  const updateActive = event<IFormActiveUpdate>(`${name}-form-update-field-state`);
  const updateError = event<IFormErrorUpdate>(`${name}-form-update-validation`);
  const updateTouch = event<IFormToucheUpdate>(`${name}-form-update-touch`);
  const updateValue = event<IFormValueUpdate>(`${name}-form-update-value`);
  const reset = event<void>(`${name}-form-reset`);
  const onChange = event<IFormOnFieldChange>(`${name}-form-change`);

  /**
   * Validation errors store - keeps all fields validation errors
   */
  const $errors = store<IFormErrors>({}, { name: `$${name}-form-errors`})
    .on(updateError, (state, { name, error }) => ({ ...state, [name]: error }));

  /**
   * Calculates form validation
   */
  const $valid = $errors.map((state) => !isEmpty(state) ? !hasTruthy(state) : true);

  /**
   * Fields status store - keeps fields activity / visibility status
   */
  const $active = store<IFormActive>({}, { name: `$${name}-form-active`})
    .on(updateActive, (state, { name, active }) => ({ ...state, [name]: active }));

  /**
   * Touches store - keeps all fields touches
   */
  const $touches = store<IFormTouches>({}, { name: `$${name}-form-touches`})
    .on(updateTouch, (state, { name, touched }) => ({ ...state, [name]: touched }));

  /**
   * Calculates form touched
   */
  const $touched = $touches.map((state) => !isEmpty(state) ? !hasTruthy(state) : true);

  /**
   * Values store - keeps all fields values
   */
  const $values = store<IFormValues>({}, { name: `$${name}-form-values`})
    .on(updateValue, (state, { name, value }) => ({ ...state, [name]: value }));

  /**
   * Changes store, triggers change on field change event
   */
  const $changes = store<IFormValues>({}, { name: `$${name}-form-changes`})
    .on(sample({
      clock: onChange,
      fn: (values, { name, value }) => ({ ...values, [name]: value }),
      source: $values,
    }), (_, values) => values);

  /**
   * Sync form submit with option to skip validation
   */
  const submit = ({ cb, skipClientValidation }: IFormSubmitArgs) => {
    Object.values(fields).forEach(({ validate }) => validate());
    if ($valid.getState() || skipClientValidation) {
      cb($values.getState());
    }
  };

  /**
   * Remote validation form submit with option to skip client validation
   * cb - is api call for the remote validation, response contains validation
   * results in format { field1: message, field2: message }, if empty - valid
   */
  const submitRemote: Effect<IFormSubmitArgs, void, IFormSubmitResponseError> = effect({
    handler: async ({ cb, skipClientValidation = false }) => {
      if (!skipClientValidation) {
        Object.values(fields).forEach(({ validate }) => validate());
        if (!$valid.getState()) {
          return Promise.reject({ errors: $errors.getState() });
        }
      }
      try {
        await cb($values.getState());
      } catch (remoteErrors) {
        return Promise.reject({ remoteErrors });
      }
    },
    name: `${name}-form-submit`,
  });

  return {
    name,
    $active,
    $actives: combine(
      $active,
      $values,
      (active, values) => pickBy(values, (_, name) => active[name])
    ),
    $changes,
    $errors,
    $valid,
    $values,
    $touched,
    $touches,
    $submitting: submitRemote.pending,
    get config() {
      return config;
    },
    set config(formConfig) {
      config = { ...config, ...formConfig };
    },
    get fields() {
      return fields;
    },
    reset,
    submit,
    submitRemote,
    getField: (name) => fields[name],
    registerField: ({ name, ...fieldConfig }) => {
      if (fields[name]) {
        fields[name].config = { name, ...fieldConfig };
      }
      fields[name] = createField(
        { name, ...fieldConfig },
        {
        formChange: onChange,
        resetField: reset,
        updateActive,
        updateError,
        updateTouch,
        updateValue,
        setRemoteErrors: guard({
          source: submitRemote.failData,
          filter: ({ remoteErrors }) => !!remoteErrors,
        }),
      });
      setTimeout(() => fields[name].syncData(), 0);
      return fields[name];
    },
    removeField: (name) => {
      delete(fields[name]);
    },
    update: (values) => {
      Object.entries(values).forEach(([field, value]) => {
        fields[field]?.update(value);
      })
    },
  };
};

/**
 * Create/return form with the given name/config
 */
export const createForm = (config: IFormConfig) => {
  const { name } = config;
  if (forms[name]) {
    forms[name].config = config;
    return forms[name];
  }
  forms[name] = createFormHandler(config);
  return forms[name];
};

/**
 * Return form with given name or create new one if it doesn't exist
 */
export const getForm = (name = formConfigDefault.name) => forms[name] || createForm({ name });

