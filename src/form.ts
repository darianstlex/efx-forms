import type { Effect, Store } from 'effector';
import { attach, combine, sample } from 'effector';
import isEmpty from 'lodash/isEmpty';
import pickBy from 'lodash/pickBy';
import reduce from 'lodash/reduce';
import get from 'lodash/get';

import { domain, hasTruthy } from './utils';

import type {
  IForm,
  IRTrue,
  IRError,
  IRErrors,
  IRValues,
  IRBoolean,
  ISubmitArgs,
  IFormConfig,
  IFieldConfig,
  IValuePayload,
  IErrorsPayload,
  IBooleanPayload,
  TFieldValidator,
  IValidationParams,
  IFormOnSubmitArgs,
  TCommonConfigKeys,
  ISubmitResponseError,
  ISubmitResponseSuccess,
} from './types';

import { FIELD_CONFIG, FORM_CONFIG } from './constants';

const E_OBJ = Object.freeze({});

const getConfigProp = (
  fieldConfig: IFieldConfig,
  formConfig: IFormConfig,
  prop: TCommonConfigKeys,
) => {
  return get(fieldConfig, [prop], get(formConfig, [prop]));
};

const getConfigValidators = (
  fieldConfig: IFieldConfig,
  formConfig: IFormConfig,
  name: string,
): ReturnType<TFieldValidator>[] => {
  return get(fieldConfig, ['validators'], get(formConfig, ['validators', name])) || [];
};

const getConfigInitialValue = (
  fieldConfig: IFieldConfig,
  formConfig: IFormConfig,
  name: string,
) => {
  return get(fieldConfig, ['initialValue'], get(formConfig, ['initialValues', name]));
};

export const createFormHandler = (createFormConfig: Pick<IFormConfig, 'name' | 'serialize'>): IForm => {
  const dm = domain.domain(createFormConfig.name);

  const setFormConfig = dm.event<IFormConfig>('set-form-config');
  const setFieldConfig = dm.event<IFieldConfig>('set-field-config');
  const setActive = dm.event<IBooleanPayload>('set-active');
  const setError = dm.event<IErrorsPayload>('set-error');
  const setErrors = dm.event<IRErrors>('set-errors');
  const replaceErrors = dm.event<IRErrors>('replace-errors');
  const setValues = dm.event<IRValues>('set-values');
  const onChange = dm.event<IValuePayload>('on-change');
  const onBlur = dm.event<IValuePayload>('on-blur');
  const reset = dm.event<void>('reset');
  const resetField = dm.event<string>('reset-field');
  const resetUntouched = dm.event<string[]>('reset-untouched');
  const erase = dm.event<void>('erase');
  const validate = dm.event<IValidationParams>('validate');

  const $formConfig = dm.store<IFormConfig>(Object.assign({}, FORM_CONFIG, createFormConfig), {
    name: '$formConfig',
    serialize: createFormConfig.serialize ? undefined : 'ignore',
    sid: `efx-forms-${createFormConfig.name}-$formConfig`,
  })
    .on(setFormConfig, (state, config) => Object.assign({}, state, config))
    .on(erase, () => Object.assign({}, FORM_CONFIG));

  const $fieldsConfig = dm.store<Record<string, IFieldConfig>>(E_OBJ, {
    name: '$fieldsConfig',
    serialize: createFormConfig.serialize ? undefined : 'ignore',
    sid: `efx-forms-${createFormConfig.name}-$fieldsConfig`,
  })
    .on(setFieldConfig, (state, config) =>
      Object.assign({}, state, { [config.name]: config }))
    .on(erase, () => ({}));

  /**
   * Fields status store - keeps fields active / mounted status
   */
  const $active = dm
    .store<IRBoolean>(E_OBJ, {
      name: '$active',
      serialize: createFormConfig.serialize ? undefined : 'ignore',
      sid: `efx-forms-${createFormConfig.name}-$active`,
    })
    .on(setActive, (state, { name, value }) =>
      state[name] !== value ? Object.assign({}, state, { [name]: value }) : state,
    )
    .reset(erase);

  /**
   * Values store - fields values
   */
  const $values = dm
    .store<IRValues>(E_OBJ, {
      name: '$values',
      serialize: createFormConfig.serialize ? undefined : 'ignore',
      sid: `efx-forms-${createFormConfig.name}-$values`,
    })
    .on(setValues, (state, values) => Object.assign({}, state, values))
    .reset(erase);

  sample({
    clock: onChange,
    source: { fieldsConfig: $fieldsConfig, state: $values },
    fn: ({ fieldsConfig, state }, { name, value }) => {
      const parse = fieldsConfig[name]?.parse || FIELD_CONFIG.parse!;
      const parsedValue = parse(value);
      return state[name] !== parsedValue ? Object.assign({}, state, { [name]: parsedValue }) : state;
    },
    target: $values,
  });

  sample({
    clock: resetField,
    source: { fieldsConfig: $fieldsConfig, formConfig: $formConfig, state: $values },
    fn: ({ fieldsConfig, formConfig, state }, field) => {
      const value = getConfigInitialValue(fieldsConfig[field], formConfig, field);
      return value !== state[field] ? Object.assign({}, state, { [field]: value }) : state;
    },
    target: $values,
  });

  sample({
    clock: reset,
    source: { fieldsConfig: $fieldsConfig, formConfig: $formConfig, state: $values },
    fn: ({ fieldsConfig, formConfig, state }) => reduce(
      state,
      (acc, _, name) => Object.assign(acc, { [name]: getConfigInitialValue(fieldsConfig[name], formConfig, name) }),
      {} as IRValues,
    ),
    target: $values,
  });

  /**
   * Active only fields
   */
  const $activeOnly = $active.map((active) => pickBy(active, Boolean)) as Store<
    IRTrue
  >;

  /**
   * Fields status store - keeps active fields values
   */
  const $activeValues = combine($activeOnly, $values, (active, values) =>
    reduce(
      active,
      (acc, _, field) => Object.assign(acc, { [field]: values[field] }),
      {} as IRValues,
    ),
  );

  /**
   * Validations store - keeps all fields validation errors
   */
  const $errors = dm
    .store<IRErrors>(E_OBJ, {
      name: '$errors',
      serialize: createFormConfig.serialize ? undefined : 'ignore',
      sid: `efx-forms-${createFormConfig.name}-$errors`,
    })
    .on(setError, (state, { name, errors }) =>
      Object.assign({}, state, { [name]: errors }),
    )
    .on(setErrors, (state, errors) =>
      Object.assign({}, state, errors),
    )
    .on(replaceErrors, (_, errors) =>
      Object.assign({}, errors),
    )
    .on([
      setActive,
      resetField.map((name) => ({ name })),
    ], (state, { name }) => {
      return state[name] ? Object.assign({}, state, { [name]: null }) : state;
    })
    .reset(erase, reset);

  /**
   * Errors store - keeps all fields validation errors
   */
  const $error = $errors.map((errors) =>
    reduce(
      errors,
      (acc, _, field) => Object.assign(acc, { [field]: errors?.[field]?.[0] || null }),
      {} as IRError,
    ),
  );

  /**
   * Calculates form valid state
   */
  const $valid = combine($activeOnly, $error, ((active, errors) => {
    const activeErrors = reduce(errors, (acc, error, name) => {
      error && active[name] && (acc[name] = error);
      return acc;
    }, {} as IRError);
    return !isEmpty(activeErrors) ? !hasTruthy(activeErrors) : true;
  }));

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
    handler: async ({ cb, values, errors, valid, skipClientValidation }) => {
      if (valid || skipClientValidation) {
        try {
          await cb?.(values);
          return Promise.resolve({ values });
        } catch (remoteErrors) {
          return Promise.reject({ remoteErrors } as { remoteErrors: IRErrors });
        }
      }
      return Promise.reject({ errors });
    },
    name: `@fx-forms/${createFormConfig.name}/submit`,
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
    source: { formConfig: $formConfig, values: $values, errors: $errors, valid: $valid },
    mapParams: (params = {}, { values, errors, valid, formConfig }) => ({
      cb: params?.cb,
      values,
      errors,
      valid,
      skipClientValidation: Object.hasOwn(params, 'skipClientValidation')
        ? params.skipClientValidation
        : formConfig.skipClientValidation,
    }),
    effect: onSubmit,
    name: `@fx-forms/${createFormConfig.name}/attach-submit`,
  });

  /**
   * Touches store - keeps all fields touch state
   */
  const $touches = dm
    .store<IRBoolean>(E_OBJ, {
      name: '$touches',
      serialize: createFormConfig.serialize ? undefined : 'ignore',
      sid: `efx-forms-${createFormConfig.name}-$touches`,
    })
    .on(onChange, (state, { name }) =>
      state[name] ? state : Object.assign({}, state, { [name]: true }),
    )
    .on([
      setActive,
      resetField.map((name) => ({ name })),
      ], (state, { name }) =>
      !state[name] ? state : Object.assign({}, state, { [name]: false }),
    )
    .reset(erase, reset, submit.done);

  /**
   * Calculates form touched state
   */
  const $touched = combine($activeOnly, $touches, ((active, touches) => {
    const activeTouches = reduce(touches, (acc, touch, name) => {
      touch && active[name] && (acc[name] = touch);
      return acc;
    }, {} as IRBoolean);
    return !isEmpty(activeTouches) ? hasTruthy(activeTouches) : false;
  }));

  /**
   * Dirties store - keeps all fields dirty state
   */
  const $dirties = dm
    .store<IRBoolean>(E_OBJ, {
      name: '$dirties',
      serialize: createFormConfig.serialize ? undefined : 'ignore',
      sid: `efx-forms-${createFormConfig.name}-$dirties`,
    })
    .reset(erase, reset, submit.done);

  /**
   * Calculates form dirty state
   */
  const $dirty = combine($activeOnly, $dirties, ((active, dirties) => {
    const activeDirties = reduce(dirties, (acc, dirty, name) => {
      dirty && active[name] && (acc[name] = dirty);
      return acc;
    }, {} as IRBoolean);
    return !isEmpty(activeDirties) ? hasTruthy(activeDirties) : false;
  }));

  sample({
    clock: onChange,
    source: { fieldsConfig: $fieldsConfig, formConfig: $formConfig, state: $dirties },
    fn: ({ fieldsConfig, formConfig, state }, { value, name }) => {
      const dirty = value !== getConfigInitialValue(fieldsConfig[name], formConfig, name);
      return state[name] === dirty ? state : Object.assign({}, state, { [name]: dirty });
    },
    target: $dirties,
  });

  /**
   * Reset form untouched fields
   */
  sample({
    clock: resetUntouched,
    source: { fieldsConfig: $fieldsConfig, formConfig: $formConfig, values: $values, touches: $touches },
    fn: ({ fieldsConfig, formConfig, values, touches }, fields) => {
      const target = reduce(fields, (acc, field) => {
        const initialValue = getConfigInitialValue(fieldsConfig[field], formConfig, field);
        const changed = values[field] !== initialValue;
        !touches[field] && changed && (acc[field] = initialValue);
        return acc;
      }, {} as IRValues);

      return !isEmpty(target) ? Object.assign({}, values, target) : values;
    },
    target: $values,
  });

  /**
   * Form validation logic
   */
  sample({
    clock: [
      sample({
        clock: validate,
        source: $formConfig,
        filter: (formConfig, params) => !params?.name
          && !params?.ignoreSkipClientValidation
          && !formConfig.skipClientValidation,
      }),
      sample({
        clock: submit,
        filter: ({ skipClientValidation }) => !skipClientValidation,
      }),
    ],
    source: { active: $activeOnly, fieldsConfig: $fieldsConfig, formConfig: $formConfig, values: $values },
    fn: ({ active, formConfig, fieldsConfig, values }) => {
      return reduce(
        active,
        (acc, _, field) => {
          const validators = getConfigValidators(fieldsConfig[field], formConfig, field);
          const errors = validators
            ?.map?.((vd) => vd(values[field], values))
            ?.filter(Boolean) as string[];
          return Object.assign(acc, { [field]: errors?.length ? errors : null });
        },
        {} as IRErrors,
      );
    },
    target: setErrors,
  });

  /**
   * Field validation logic
   */
  sample({
    clock: validate,
    source: { fieldsConfig: $fieldsConfig, formConfig: $formConfig, values: $values },
    filter: (_, source) => !!source?.name,
    fn: ({ fieldsConfig, formConfig, values }, source) => {
      const validators = getConfigValidators(fieldsConfig[source?.name as string], formConfig, source?.name as string);
      const errors = validators
        ?.map?.((vd) => vd(values[source?.name as string], values))
        ?.filter?.(Boolean) as string[];
      return {
        name: source?.name as string,
        errors: errors?.length ? errors : null,
      };
    },
    target: setError,
  });

  /**
   * Validate field onBlur if the field is touched and validateOnBlur is set
   */
  sample({
    clock: onBlur,
    source: { fieldsConfig: $fieldsConfig, formConfig: $formConfig, touches: $touches },
    filter: ({ fieldsConfig, formConfig, touches }, { name }) =>
      touches[name] && !!getConfigProp(fieldsConfig[name], formConfig, 'validateOnBlur'),
    fn: (_, { name }) => ({ name }),
    target: validate,
  });

  /**
   * Validate field onChange if the field is touched and validateOnChange is set
   */
  sample({
    clock: onChange,
    source: { fieldsConfig: $fieldsConfig, formConfig: $formConfig },
    filter: ({ fieldsConfig, formConfig }, { name }) =>
      !!getConfigProp(fieldsConfig[name], formConfig, 'validateOnChange'),
    fn: (_, { name }) => ({ name }),
    target: validate,
  });

  /**
   * Reset errors on change if validateOnChange is disabled
   */
  sample({
    clock: onChange,
    source: { fieldsConfig: $fieldsConfig, formConfig: $formConfig },
    filter: ({ fieldsConfig, formConfig }, { name }) =>
      !getConfigProp(fieldsConfig[name], formConfig, 'validateOnChange'),
    fn: (_, { name }) => ({ name, errors: null }),
    target: setError,
  });

  /**
   * Set submit remote validation errors
   */
  sample({
    clock: submit.failData,
    filter: (it) => !!it.remoteErrors,
    fn: ({ remoteErrors }) => {
      return reduce(
        remoteErrors,
        (acc, _, key) => Object.assign(
          acc,
          { [key]: remoteErrors?.[key] ? [remoteErrors?.[key]] : null },
        ),
        {} as IRErrors,
      );
    },
    target: replaceErrors,
  });

  return {
    domain: dm,
    name: createFormConfig.name,
    $active,
    $activeOnly,
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
    $formConfig,
    $fieldsConfig,
    erase,
    onBlur,
    onChange,
    reset,
    resetField,
    resetUntouched,
    setActive,
    setValues,
    setErrors,
    replaceErrors,
    submit,
    validate,
    setConfig: setFormConfig,
    setFieldConfig,
    get config() {
      return $formConfig.getState();
    },
    get configs() {
      return $fieldsConfig.getState();
    },
  };
};
