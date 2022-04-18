import { attach, combine, sample } from 'effector';
import type { Effect } from 'effector';
import isEmpty from 'lodash/isEmpty';
import pickBy from 'lodash/pickBy';

import { domain } from './utils';
import { createField } from './field';
import type {
  IForm,
  IFormConfig,
  IFormConfigDefault,
  IFormFields,
  IFormValues,
  IFormValueUpdate,
  IFormErrors,
  IFormErrorUpdate,
  IFormTouches,
  IFormToucheUpdate,
  IFormActive,
  IFormActiveUpdate,
  IFormDirties,
  IFormDirtyUpdate,
  IFormOnFieldChange,
  IFormSubmitArgs,
  IFormSubmitResponseError,
  IFormSubmitResponseSuccess,
  IFormOnSubmitArgs,
  IForms,
} from './model';

export const formConfigDefault: IFormConfigDefault = {
  name: 'default',
  initialValues: {},
  onSubmit: () => undefined,
  keepOnUnmount: false,
  skipClientValidation: false,
  validateOnBlur: true,
  validateOnChange: false,
  validators: {},
};

export const forms: IForms = {};

const hasTruthy = (object) => Object.values(object).some((it) => it);

const createFormHandler = (formConfig: IFormConfig): IForm => {
  let config: IFormConfig = { ...formConfig };
  const { name } = formConfig;

  const formDomain = domain.domain(`@${name}`);

  const fields: IFormFields = {};

  const setFormActive = formDomain.event<IFormActiveUpdate>('update-active');
  const setFormError = formDomain.event<IFormErrorUpdate>('update-validation');
  const setFormTouch = formDomain.event<IFormToucheUpdate>('update-touch');
  const setFormDirty = formDomain.event<IFormDirtyUpdate>('update-dirty');
  const setFormValue = formDomain.event<IFormValueUpdate>('update-value');
  const setFormChange = formDomain.event<IFormOnFieldChange>('change');
  const reset = formDomain.event<void>('reset');
  const update = formDomain.event<IFormValues>('update');

  /**
   * Validation errors store - keeps all fields validation errors
   */
  const $errors = formDomain.store<IFormErrors>({}, { name: '$errors'})
    .on(setFormError, (
      state,
      { name, error }) => ({ ...state, [name]: error }),
    );

  /**
   * Calculates form validation
   */
  const $valid = $errors.map((state) => !isEmpty(state) ? !hasTruthy(state) : true);

  /**
   * Fields status store - keeps fields activity / visibility status
   */
  const $active = formDomain.store<IFormActive>({}, { name: '$active'})
    .on(setFormActive, (
      state,
      { name, active }) => ({ ...state, [name]: active }),
    );

  /**
   * Touches store - keeps all fields touches
   */
  const $touches = formDomain.store<IFormTouches>({}, { name: '$touches'})
    .on(setFormTouch, (
      state,
      { name, touched }) => ({ ...state, [name]: touched }),
    );

  /**
   * Calculates form touched
   */
  const $touched = $touches.map((state) => !isEmpty(state) ? !hasTruthy(state) : true);

  /**
   * Dirties store - keeps all fields dirty
   */
  const $dirties = formDomain.store<IFormDirties>({}, { name: '$dirties'})
    .on(setFormDirty, (
      state,
      { name, dirty }) => ({ ...state, [name]: dirty }),
    );

  /**
   * Calculates form dirty
   */
  const $dirty = $dirties.map((state) => !isEmpty(state) ? hasTruthy(state) : false);

  /**
   * Values store - keeps all fields values
   */
  const $values = formDomain.store<IFormValues>({}, { name: '$values'})
    .on(setFormValue, (
      state,
      { name, value }) => ({ ...state, [name]: value }),
    );

  /**
   * Changes store, triggers change on field change event
   */
  const $changes = formDomain.store<IFormValues>({}, { name: '$changes'})
    .on(sample({
      clock: setFormChange,
      fn: (values, { name, value }) => ({ ...values, [name]: value }),
      source: $values,
    }), (_, values) => values);

  /**
   * Form submit effect.
   * If callback is promise and returns errors object, will be highlighted in the
   * corresponded fields: { fieldName: 'Name already exist' }.
   * Return values on success and errors on error
   */
  const onSubmit: Effect<
    IFormOnSubmitArgs,
    IFormSubmitResponseSuccess,
    IFormSubmitResponseError
  > = formDomain.effect({
    handler: async ({
      cb,
      values,
      errors,
      valid,
      skipClientValidation,
    }) => {
      if (valid || skipClientValidation) {
        try {
          await cb(values);
          return Promise.resolve({ values });
        } catch (remoteErrors) {
          return Promise.reject({ remoteErrors });
        }
      }
      return Promise.reject({ errors });
    },
    name: 'submit',
  });

  /**
   * Form submit attached effect, triggers fields validation if not skipped,
   * attach data needed to process onSubmit effect.
   */
  const submit: Effect<
    IFormSubmitArgs,
    IFormSubmitResponseSuccess,
    IFormSubmitResponseError
  > = attach({
    source: { values: $values, errors: $errors, valid: $valid },
    mapParams: (
      { cb, skipClientValidation = config.skipClientValidation },
      { values, errors, valid }
    ) => ({ cb, values, errors, valid, skipClientValidation }),
    effect: onSubmit,
    name: `@forms/@${name}/attach-submit`,
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
    $dirty,
    $dirties,
    $submitting: onSubmit.pending,
    get config() {
      return config;
    },
    set config({ name, ...formConfig}) {
      config = { ...config, ...formConfig };
    },
    get fields() {
      return fields;
    },
    update,
    reset,
    submit,
    getField: (name) => fields[name],
    registerField: ({ name, ...fieldConfig }) => {
      if (fields[name]) {
        fields[name].config = { name, ...fieldConfig };
      }
      fields[name] = createField(
        { name, ...fieldConfig },
        {
        $formValues: $values,
        formDomain,
        onFormUpdate: update,
        onFormReset: reset,
        onFormSubmit: sample({
          clock: submit,
          filter: ({ skipClientValidation }) => !skipClientValidation,
        }),
        onFormErrors: sample({
          source: onSubmit.failData.map(({ remoteErrors }) => remoteErrors as IFormErrors),
          filter: (remoteErrors) => !!remoteErrors,
        }),
        setFormChange,
        setFormActive,
        setFormError,
        setFormDirty,
        setFormTouch,
        setFormValue,
      });
      setTimeout(() => fields[name].syncData(), 0);
      return fields[name];
    },
  };
};

/**
 * Create/Update form with the given config
 */
export const createUpdateForm = (config: IFormConfig) => {
  const { name = formConfigDefault.name } = config;
  if (forms[name]) {
    forms[name].config = config;
    return forms[name];
  }
  return forms[name] = createFormHandler(config);
};

/**
 * Return form with given name or create new one if it doesn't exist
 */
export const getForm = (name = formConfigDefault.name) => createUpdateForm({ name });

