import type { Effect , Store } from 'effector';
import { attach, combine, sample } from 'effector';
import isEmpty from 'lodash/isEmpty';
import pickBy from 'lodash/pickBy';
import reduce from 'lodash/reduce';

import { domain, hasTruthy } from './utils';

import type {
  IFieldConfig,
  IForm,
  IFormConfig,
  IFormOnSubmitArgs,
  ISubmitArgs,
  ISubmitResponseError,
  ISubmitResponseSuccess,
  IValidationParams,
  TFieldValidator,
} from './types';

import { FIELD_CONFIG, FORM_CONFIG } from './constants';

export const createFormHandler = (formConfig: IFormConfig): IForm => {
  const data = {
    config: Object.assign({}, FORM_CONFIG, formConfig),
    configs: {},
  } as { config: IFormConfig; configs: Record<string, IFieldConfig> };

  const getFieldConfigProp = (name: string, prop: string) => {
    return data.configs?.[name]?.[prop] !== undefined ? data.configs[name][prop] : data.config[prop];
  };

  const getFieldInitVal = (name: string) => {
    return data.configs?.[name]?.initialValue !== undefined
      ? data.configs[name].initialValue
      : data.config?.initialValues?.[name];
  };

  const dm = domain.domain(formConfig.name);

  const setActive = dm.event<{ name: string; value: boolean }>('set-active');
  const setError = dm.event<{ name: string; errors: string[] | null }>('set-error');
  const setErrors = dm.event<Record<string, string[] | null>>('set-errors');
  const setValues = dm.event<Record<string, any>>('set-values');
  const setTouchedValues = dm.event<Record<string, any>>('set-touched');
  const setUntouchedValues = dm.event<Record<string, any>>('set-untouched');
  const onChange = dm.event<{ name: string; value: any }>('on-change');
  const onBlur = dm.event<{ name: string; value: any }>('on-blur');
  const reset = dm.event<string | void>('reset');
  const resetUntouched = dm.event<string[]>('reset-untouched');
  const erase = dm.event<void>('erase');
  const validate = dm.event<IValidationParams>('validate');

  /**
   * Fields status store - keeps fields active / mounted status
   */
  const $active = dm
    .store<Record<string, boolean>>({}, { name: '$active' })
    .on(setActive, (state, { name, value }) =>
      state[name] !== value ? Object.assign({}, state, { [name]: value }) : state,
    )
    .reset(erase);

  /**
   * Values store - fields values
   */
  const $values = dm
    .store<Record<string, any>>({}, { name: '$values' })
    .on(setValues, (state, values) => Object.assign({}, state, values))
    .on(onChange, (state, { name, value }) => {
      const parse = data.configs[name]?.parse || FIELD_CONFIG.parse!;
      const parsedValue = parse(value);
      return state[name] !== parsedValue ? Object.assign({}, state, { [name]: parsedValue }) : state;
    })
    .reset(erase);

  /**
   * Active only fields
   */
  const $activeOnly = $active.map((active) => pickBy(active, Boolean)) as Store<
    Record<string, true>
  >;

  /**
   * Fields status store - keeps active fields values
   */
  const $activeValues = combine($activeOnly, $values, (active, values) =>
    reduce(
      active,
      (acc, _, field) => {
        acc[field] = values[field];
        return acc;
      },
      {} as Record<string, any>,
    ),
  );

  /**
   * Validations store - keeps all fields validation errors
   */
  const $errors = dm
    .store<Record<string, string[] | null>>({}, { name: '$errors' })
    .on(setError, (state, { name, errors }) =>
      pickBy(Object.assign({}, state, { [name]: errors }), (error) => !!error),
    )
    .on(setErrors, (state, errors) =>
      pickBy(Object.assign({}, state, errors), (error) => !!error),
    )
    .reset(erase, reset);

  /**
   * Errors store - keeps all fields validation errors
   */
  const $error = $errors.map((errors) => {
    return reduce(
      errors,
      (acc, _, field) => {
        acc[field] = errors?.[field]?.[0] || null;
        return acc;
      },
      {} as Record<string, string | null>,
    );
  });

  /**
   * Calculates form valid state
   */
  const $valid = $error.map((state) =>
    !isEmpty(state) ? !hasTruthy(state) : true,
  );

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
    mapParams: (params = {}, { values, errors, valid }) => ({
      cb: params?.cb,
      values,
      errors,
      valid,
      skipClientValidation: Object.hasOwn(params, 'skipClientValidation')
        ? params.skipClientValidation
        : data.config.skipClientValidation,
    }),
    effect: onSubmit,
    name: `@fx-forms/${formConfig.name}/attach-submit`,
  });

  /**
   * Touches store - keeps all fields touch state
   */
  const $touches = dm
    .store<Record<string, boolean>>({}, { name: '$touches' })
    .on(onChange, (state, { name }) =>
      state[name] ? state : Object.assign({}, state, { [name]: true }),
    )
    .reset(erase, reset, submit.done);

  /**
   * Calculates form touched state
   */
  const $touched = $touches.map((state) =>
    !isEmpty(state) ? hasTruthy(state) : false,
  );

  /**
   * Dirties store - keeps all active fields dirty state
   */
  const $dirties = $activeValues.map((values) => {
    const dirties = reduce(
      values,
      (acc, _, field: string) => {
        acc[field] = values[field] !== getFieldInitVal(field);
        return acc;
      },
      {} as Record<string, boolean>,
    );
    return pickBy(dirties, (dirty) => dirty);
  });

  /**
   * Calculates form dirty state
   */
  const $dirty = $dirties.map((state) =>
    !isEmpty(state) ? hasTruthy(state) : false,
  );

  /**
   * Reset form value/values to the initial state
   */
  sample({
    clock: reset,
    source: { values: $values },
    fn: ({ values }, field) =>
      field
        ? Object.assign({}, values, { [field]: getFieldInitVal(field) })
        : reduce(
            values,
            (acc, _, name) => {
              acc[name] = getFieldInitVal(name);
              return acc;
            },
            {} as Record<string, any>,
          ),
    target: $values,
  });

  /**
   * Reset form untouched fields
   */
  sample({
    clock: resetUntouched,
    source: { values: $values, touches: $touches },
    fn: ({ values, touches }, fields) => {
      const target = reduce(fields, (acc, field) => {
        const changed = values[field] !== getFieldInitVal(field);
        !touches[field] && changed && (acc[field] = getFieldInitVal(field));
        return acc;
      }, {} as Record<string, any>);

      return !isEmpty(target) ? Object.assign({}, values, target) : values;
    },
    target: $values,
  });

  /**
   * Reset field error on deactivation
   */
  sample({
    clock: setActive,
    filter: ({ value }) => !value,
    fn: ({ name }) => ({ name, errors: null }),
    target: setError,
  });

  /**
   * Form validation logic
   */
  sample({
    clock: [
      validate,
      sample({
        clock: submit,
        filter: ({ skipClientValidation }) => !skipClientValidation,
        fn: () => ({}) as IValidationParams,
      }),
    ],
    source: { values: $values, active: $activeOnly },
    filter: (_, source) => !source?.name,
    fn: ({ values, active }) => {
      return reduce(
        active,
        (acc, _, field) => {
          const validators: ReturnType<TFieldValidator>[] =
            getFieldConfigProp(field, 'validators') || [];
          const errors = validators
            ?.map?.((vd) => vd(values[field], values))
            ?.filter(Boolean) as string[];
          acc[field] = errors?.length ? errors : null;
          return acc;
        },
        {} as Record<string, string[] | null>,
      );
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
      const validators: ReturnType<TFieldValidator>[] =
        getFieldConfigProp(source?.name as string, 'validators') || [];
      const errors = validators
        .map?.((vd) => vd(values[source?.name as string], values))
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
    source: { touches: $touches, active: $active },
    filter: ({ touches }, { name }) =>
      touches[name] && getFieldConfigProp(name, 'validateOnBlur'),
    fn: (_, { name }) => ({ name }),
    target: validate,
  });

  /**
   * Validate field onChange if the field is touched and validateOnChange is set
   */
  sample({
    clock: onChange,
    filter: ({ name }) => getFieldConfigProp(name, 'validateOnChange'),
    fn: ({ name }) => ({ name }),
    target: validate,
  });

  /**
   * Set non touched values
   */
  sample({
    clock: setUntouchedValues,
    source: { touches: $touches },
    fn: ({ touches }, values) => pickBy(values, (_, key) => !touches[key]),
    target: setValues,
  });

  /**
   * Set touched values
   */
  sample({
    clock: setTouchedValues,
    source: { touches: $touches },
    fn: ({ touches }, values) => pickBy(values, (_, key) => !!touches[key]),
    target: setValues,
  });

  /**
   * Reset errors on change if validateOnChange is disabled
   */
  sample({
    clock: onChange,
    fn: ({ name }) => ({ name, errors: null }),
    filter: ({ name }) => !getFieldConfigProp(name, 'validateOnChange'),
    target: setError,
  });

  /**
   * Reset errors on setValues
   */
  sample({
    clock: setValues,
    fn: (values) =>
      reduce(
        values,
        (acc, _, field) => {
          acc[field] = null;
          return acc;
        },
        {} as Record<string, string[] | null>,
      ),
    target: setErrors,
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
        (acc, _, key) => {
          acc[key] = remoteErrors?.[key] ? [remoteErrors?.[key] as string] : null;
          return acc;
        },
        {} as Record<string, string[] | null>,
      );
    },
    target: setErrors,
  });

  /**
   * Set initial field value on field activation
   */
  sample({
    clock: setActive,
    filter: ({ value }) => value,
    fn: ({ name }) => name,
    target: reset,
  });

  /**
   * Erase form configs
   */
  sample({
    clock: erase,
    fn: () => {
      data.config = Object.assign({}, FORM_CONFIG);
      data.configs = {};
    },
  });

  return {
    domain: dm,
    name: formConfig.name,
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
    erase,
    onBlur,
    onChange,
    reset,
    resetUntouched,
    setActive,
    setValues,
    setTouchedValues,
    setUntouchedValues,
    submit,
    validate,
    get config() {
      return data.config;
    },
    setConfig: (cfg: IFormConfig) => {
      data.config = Object.assign({}, FORM_CONFIG, cfg);
    },
    get configs() {
      return data.configs;
    },
    setFieldConfig: (cfg: IFieldConfig) => {
      data.configs[cfg.name] = Object.assign({}, cfg);
    },
  };
};
