import type { Effect , Store } from 'effector';
import { attach, combine, sample } from 'effector';
import isEmpty from 'lodash/isEmpty';
import pickBy from 'lodash/pickBy';
import reduce from 'lodash/reduce';
import get from 'lodash/get';

import { domain, hasTruthy } from './utils';

import type {
  IForm,
  IFormData,
  ISubmitArgs,
  IFormConfig,
  IFieldConfig,
  TFieldValidator,
  IValidationParams,
  IFormOnSubmitArgs,
  TCommonConfigKeys,
  ISubmitResponseError,
  ISubmitResponseSuccess,
} from './types';

import { FIELD_CONFIG, FORM_CONFIG } from './constants';

const getFieldConfigProp = (data: IFormData, name: string, prop: TCommonConfigKeys) => {
  return get(data, ['configs', name, prop], get(data, ['config', prop]));
};

const getFieldInitVal = (data: IFormData, name: string) => {
  return get(data, ['configs', name, 'initialValue'], get(data, ['config', 'initialValues', name]));
};

const getFieldValidators = (data: IFormData, name: string) => {
  return get(data, ['configs', name, 'validators'], get(data, ['config', 'validators', name]));
};

export const createFormHandler = (formConfig: IFormConfig): IForm => {
  const data: IFormData = {
    config: Object.assign({}, FORM_CONFIG, formConfig),
    configs: {} as IFormData['configs'],
  };

  const dm = domain.domain(formConfig.name);

  const setActive = dm.event<{ name: string; value: boolean }>('set-active');
  const setError = dm.event<{ name: string; errors: string[] | null }>('set-error');
  const setErrors = dm.event<Record<string, string[] | null>>('set-errors');
  const setValues = dm.event<Record<string, any>>('set-values');
  const onChange = dm.event<{ name: string; value: any }>('on-change');
  const onBlur = dm.event<{ name: string; value: any }>('on-blur');
  const reset = dm.event<void>('reset');
  const resetField = dm.event<string>('reset-field');
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
    .on(reset, (state) => reduce(
      state,
      (acc, _, name) => Object.assign(acc, { [name]: getFieldInitVal(data, name) }),
      {} as Record<string, any>,
    ))
    .on(resetField, (state, field) => {
      const value = getFieldInitVal(data, field);
      return value !== state[field] ? Object.assign({}, state, { [field]: value }) : state;
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
      (acc, _, field) => Object.assign(acc, { [field]: values[field] }),
      {} as Record<string, any>,
    ),
  );

  /**
   * Validations store - keeps all fields validation errors
   */
  const $errors = dm
    .store<Record<string, string[] | null>>({}, { name: '$errors' })
    .on(setError, (state, { name, errors }) =>
      Object.assign({}, state, { [name]: errors }),
    )
    .on(setErrors, (state, errors) =>
      Object.assign({}, state, errors),
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
      {} as Record<string, string | null>,
    ),
  );

  /**
   * Calculates form valid state
   */
  const $valid = combine($activeOnly, $error, ((active, errors) => {
    const activeErrors = reduce(errors, (acc, error, name) => {
      error && active[name] && (acc[name] = error);
      return acc;
    }, {} as Record<string, string | null>);
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
    }, {} as Record<string, boolean>);
    return !isEmpty(activeTouches) ? hasTruthy(activeTouches) : false;
  }));

  /**
   * Dirties store - keeps all fields dirty state
   */
  const $dirties = dm
    .store<Record<string, boolean>>({}, { name: '$dirties' })
    .on(onChange, (state, { name, value }) => {
      const dirty = value !== getFieldInitVal(data, name);
      return state[name] === dirty ? state : Object.assign({}, state, { [name]: dirty });
    })
    .reset(erase, reset, submit.done);

  /**
   * Calculates form dirty state
   */
  const $dirty = combine($activeOnly, $dirties, ((active, dirties) => {
    const activeDirties = reduce(dirties, (acc, dirty, name) => {
      dirty && active[name] && (acc[name] = dirty);
      return acc;
    }, {} as Record<string, boolean>);
    return !isEmpty(activeDirties) ? hasTruthy(activeDirties) : false;
  }));

  /**
   * Reset form untouched fields
   */
  sample({
    clock: resetUntouched,
    source: { values: $values, touches: $touches },
    fn: ({ values, touches }, fields) => {
      const target = reduce(fields, (acc, field) => {
        const changed = values[field] !== getFieldInitVal(data, field);
        !touches[field] && changed && (acc[field] = getFieldInitVal(data, field));
        return acc;
      }, {} as Record<string, any>);

      return !isEmpty(target) ? Object.assign({}, values, target) : values;
    },
    target: $values,
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
            getFieldValidators(data, field) || [];
          const errors = validators
            ?.map?.((vd) => vd(values[field], values))
            ?.filter(Boolean) as string[];
          return Object.assign(acc, { [field]: errors?.length ? errors : null });
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
        getFieldValidators(data, source?.name as string) || [];
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
    source: { touches: $touches, active: $active },
    filter: ({ touches }, { name }) =>
      touches[name] && !!getFieldConfigProp(data, name, 'validateOnBlur'),
    fn: (_, { name }) => ({ name }),
    target: validate,
  });

  /**
   * Validate field onChange if the field is touched and validateOnChange is set
   */
  sample({
    clock: onChange,
    filter: ({ name }) => !!getFieldConfigProp(data, name, 'validateOnChange'),
    fn: ({ name }) => ({ name }),
    target: validate,
  });

  /**
   * Reset errors on change if validateOnChange is disabled
   */
  sample({
    clock: onChange,
    fn: ({ name }) => ({ name, errors: null }),
    filter: ({ name }) => !getFieldConfigProp(data, name, 'validateOnChange'),
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
          { [key]: remoteErrors?.[key] ? [remoteErrors?.[key] as string] : null },
        ),
        {} as Record<string, string[] | null>,
      );
    },
    target: setErrors,
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
    resetField,
    resetUntouched,
    setActive,
    setValues,
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
