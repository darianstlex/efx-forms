var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { guard, sample } from 'effector';
import { domain } from './utils';
var store = domain.store, event = domain.event;
export var fieldConfigDefault = {
    parse: function (value) { return value; },
    format: function (value) { return value; },
    validators: [],
    initialValue: '',
    validateOnBlur: true,
    validateOnChange: false,
};
export var createField = function (_a, _b) {
    var formChange = _b.formChange, resetField = _b.resetField, updateActive = _b.updateActive, updateError = _b.updateError, updateDirty = _b.updateDirty, updateTouch = _b.updateTouch, updateValue = _b.updateValue, setRemoteErrors = _b.setRemoteErrors;
    var name = _a.name, fieldConfig = __rest(_a, ["name"]);
    var config = __assign({ name: name }, fieldConfig);
    var update = event("".concat(name, "-field-update"));
    var validate = event("".concat(name, "-field-validate"));
    var setActive = event("".concat(name, "-field-active"));
    var setError = event("".concat(name, "-field-push-error"));
    var resetError = event("".concat(name, "-field-reset-error"));
    var onChange = event("".concat(name, "-field-onChange"));
    var onBlur = event("".concat(name, "-field-onBlur"));
    var reset = event("".concat(name, "-field-reset"));
    /**
     * Field value store
     */
    var $value = store(config.initialValue, { name: "$".concat(name, "-field-value") })
        .on(update, function (_, value) { return value; })
        .on(onChange, function (_, value) { return config.parse(value); })
        .on(reset, function () { return config.initialValue || null; });
    /**
     * Trigger form change on field onChange event
     */
    sample({
        source: onChange,
        fn: function (value) { return ({ name: name, value: value }); },
        target: formChange,
    });
    /**
     * Updates form values on field value changes
     */
    sample({
        source: $value,
        fn: function (value) { return ({ name: name, value: value }); },
        target: updateValue,
    });
    /**
     * Field dirty store - true if diff to initial value
     */
    var $dirty = store(false, { name: "$".concat(name, "-field-dirty") })
        .on(onChange, function (_, value) { return value !== config.initialValue; })
        .reset(reset);
    /**
     * Updates form dirties on field dirty change
     */
    sample({
        source: $dirty,
        fn: function (dirty) { return ({ name: name, dirty: dirty }); },
        target: updateDirty,
    });
    /**
     * Field touched store - true onChange
     */
    var $active = store(false, { name: "$".concat(name, "-field-active") })
        .on(setActive, function (_, active) { return active; })
        .reset(reset);
    /**
     * Update form active fields on activity change
     */
    sample({
        source: $active,
        fn: function (active) { return ({ name: name, active: active }); },
        target: updateActive,
    });
    /**
     * Field touched store - true onChange
     */
    var $touched = store(false, { name: "$".concat(name, "-field-touched") })
        .on(onChange, function () { return true; })
        .reset(reset);
    /**
     * Detect changes after blur to run validation
     */
    var $changedAfterBlur = store(false, { name: "$".concat(name, "-field-changed-after-blur") })
        .on(onChange, function () { return true; })
        .on(validate, function () { return false; })
        .reset(reset);
    /**
     * Updates form touches on field touched
     */
    sample({
        source: $touched,
        fn: function (touched) { return ({ name: name, touched: touched }); },
        target: updateTouch,
    });
    /**
     * Errors store - calculated on validation
     */
    var $errors = store([], {
        name: "$".concat(name, "-field-errors"),
        updateFilter: function (curr, prev) { return JSON.stringify(curr) !== JSON.stringify(prev); },
    }).on(sample({
        clock: validate,
        source: $value,
        fn: function (value) { return config.validators.map(function (vd) { return vd(value); }).filter(Boolean); },
    }), function (_, errors) { return errors; }).on(setRemoteErrors, function (_, _a) {
        var _b = _a.remoteErrors, remoteErrors = _b === void 0 ? {} : _b;
        return (remoteErrors[name] ? [remoteErrors[name]] : []);
    }).on(setError, function (_, error) { return ([error]); }).reset([resetError, reset]);
    /**
     * Updates form errors on field validation change
     */
    sample({
        source: $errors,
        fn: function (_a) {
            var _b = _a[0], error = _b === void 0 ? null : _b;
            return ({ name: name, error: error });
        },
        target: updateError,
    });
    /**
     * Validate field onBlur if field is touched and has changes
     * from the last blur event and validateOnBlur is set
     */
    guard({
        clock: onBlur,
        source: [$touched, $changedAfterBlur],
        filter: function (_a) {
            var touched = _a[0], changed = _a[1];
            return changed && touched && config.validateOnBlur && !config.validateOnChange;
        },
        target: validate,
    });
    /**
     * Validate field onChange if field is touched and validateOnChange is set
     */
    guard({
        clock: onChange,
        source: $touched,
        filter: function (touched) { return touched && config.validateOnChange; },
        target: validate,
    });
    /**
     * Reset field on form reset event if field is touched or has errors
     */
    guard({
        clock: resetField,
        source: [$touched, $errors],
        filter: function (_a) {
            var touched = _a[0], error = _a[1][0];
            return touched || !!error;
        },
        target: reset,
    });
    /**
     * Sync field data to form on initial setup
     */
    var syncData = function () {
        updateValue({ name: name, value: $value.getState() });
        var _a = $errors.getState()[0], error = _a === void 0 ? null : _a;
        updateError({ name: name, error: error });
    };
    return {
        name: name,
        $active: $active,
        $value: $value,
        $touched: $touched,
        $dirty: $dirty,
        $errors: $errors,
        onChange: onChange,
        onBlur: onBlur,
        update: update,
        reset: reset,
        validate: validate,
        setActive: setActive,
        setError: setError,
        resetError: resetError,
        syncData: syncData,
        get active() {
            return $active.getState();
        },
        get config() {
            return config;
        },
        set config(data) {
            config = __assign(__assign({}, config), data);
        },
    };
};
