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
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useMemo, } from 'react';
import { useStore } from 'effector-react';
import debounce from 'lodash-es/debounce';
import isEmpty from 'lodash-es/isEmpty';
import { createForm, formConfigDefault, getForm } from './form';
import { fieldConfigDefault } from './field';
export var FormNameContext = createContext(formConfigDefault.name);
/**
 * Return parent or requested form instance
 */
export var useForm = function (name) {
    var formName = useContext(FormNameContext);
    return useMemo(function () { return getForm(name || formName); }, [name, formName]);
};
/**
 * Return form values - flat
 */
export var useFormValues = function (name) {
    var $values = useForm(name).$values;
    return useStore($values);
};
/**
 * Return field instance belongs to the current or provided form
 */
export var useField = function (name, formName) {
    var form = useForm(formName);
    return useMemo(function () { return form.fields[name]; }, [name, formName]);
};
/**
 * Return field value of the current or provided form
 */
export var useFieldValue = function (name, formName) {
    var $value = useField(name, formName).$value;
    return useStore($value);
};
export var REfxForm = function (_a) {
    var _b = _a.children, children = _b === void 0 ? null : _b, _c = _a.onSubmit, onSubmit = _c === void 0 ? formConfigDefault.onSubmit : _c, _d = _a.name, name = _d === void 0 ? formConfigDefault.name : _d, _e = _a.remoteValidation, remoteValidation = _e === void 0 ? formConfigDefault.remoteValidation : _e, _f = _a.skipClientValidation, skipClientValidation = _f === void 0 ? formConfigDefault.skipClientValidation : _f, _g = _a.initialValues, initialValues = _g === void 0 ? formConfigDefault.initialValues : _g, _h = _a.validateOnBlur, validateOnBlur = _h === void 0 ? formConfigDefault.validateOnBlur : _h, _j = _a.validateOnChange, validateOnChange = _j === void 0 ? formConfigDefault.validateOnChange : _j, _k = _a.validations, validations = _k === void 0 ? formConfigDefault.validations : _k;
    var form = useMemo(function () { return createForm({
        name: name,
        initialValues: initialValues,
        validateOnBlur: validateOnBlur,
        validateOnChange: validateOnChange,
        formValidations: validations,
    }); }, [name, initialValues, validateOnBlur, validateOnChange, validations]);
    var submit = function (event) {
        event.preventDefault();
        if (remoteValidation) {
            form.submitRemote({ cb: onSubmit, skipClientValidation: skipClientValidation });
        }
        else {
            form.submit({ cb: onSubmit, skipClientValidation: skipClientValidation });
        }
    };
    return (_jsx(FormNameContext.Provider, __assign({ value: name }, { children: _jsx("form", __assign({ onSubmit: submit }, { children: children }), void 0) }), void 0));
};
REfxForm.displayName = 'REfxForm';
export var REfxField = function (_a) {
    var Field = _a.Field, name = _a.name, formName = _a.formName, rest = __rest(_a, ["Field", "name", "formName"]);
    var _b = useForm(formName), config = _b.config, fields = _b.fields, registerField = _b.registerField;
    var N = config.name, _c = config.initialValues, initialValues = _c === void 0 ? {} : _c, _d = config.formValidations, formValidations = _d === void 0 ? {} : _d, formConfig = __rest(config, ["name", "initialValues", "formValidations"]);
    var _e = rest.initialValue, initialValue = _e === void 0 ? initialValues[name] : _e, _f = rest.parse, parse = _f === void 0 ? fieldConfigDefault.parse : _f, _g = rest.format, format = _g === void 0 ? fieldConfigDefault.format : _g, _h = rest.validators, validators = _h === void 0 ? formValidations[name] || fieldConfigDefault.validators : _h, _j = rest.validateOnBlur, validateOnBlur = _j === void 0 ? formConfig.validateOnBlur : _j, _k = rest.validateOnChange, validateOnChange = _k === void 0 ? formConfig.validateOnChange : _k, props = __rest(rest, ["initialValue", "parse", "format", "validators", "validateOnBlur", "validateOnChange"]);
    var _l = useMemo(function () {
        var field = fields[name];
        var fieldConfig = {
            name: name,
            initialValue: initialValue,
            parse: parse,
            validators: validators,
            validateOnBlur: validateOnBlur,
            validateOnChange: validateOnChange,
        };
        field && (field.config = fieldConfig);
        return field || registerField(fieldConfig);
    }, [name, initialValue, parse, validators, validateOnBlur, validateOnChange, formConfig]), $value = _l.$value, $errors = _l.$errors, onChange = _l.onChange, onBlur = _l.onBlur, setActive = _l.setActive;
    useEffect(function () {
        setActive(true);
        return function () {
            setActive(false);
        };
    }, []);
    var value = useStore($value) || '';
    var _m = useStore($errors), error = _m[0], errors = _m.slice(1);
    return (_jsx(Field, __assign({}, __assign({ error: error, errors: errors, name: name, value: format(value), onChange: onChange, onBlur: function () { return onBlur(); } }, props)), void 0));
};
REfxField.displayName = 'REfxField';
/**
 * Conditional rendering based on form values
 */
export var REfxWhen = function (_a) {
    var children = _a.children, check = _a.check, form = _a.form, setTo = _a.setTo, resetTo = _a.resetTo, _b = _a.updateDebounce, updateDebounce = _b === void 0 ? 0 : _b;
    var formInst = useForm(form);
    var values = useStore(formInst.$values);
    var show = useMemo(function () { return check(values); }, [values]);
    var updateDeb = useCallback(debounce(formInst.update, updateDebounce), [formInst, updateDebounce]);
    useEffect(function () {
        show && !isEmpty(setTo) && updateDeb(setTo);
        !show && !isEmpty(resetTo) && updateDeb(resetTo);
        return updateDeb.cancel;
    }, [show]);
    return show ? children : null;
};
REfxWhen.displayName = 'REfxWhen';
