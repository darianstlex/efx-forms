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
import React, { useMemo } from 'react';
import { useStore } from 'effector-react';
import { createForm, formConfigDefault } from './form';
import { fieldConfigDefault } from './field';
import omit from 'lodash-es/omit';
var emptyOnSubmit = function () { };
export var REfxForm = function (_a) {
    var _b = _a.children, children = _b === void 0 ? null : _b, _c = _a.onSubmit, onSubmit = _c === void 0 ? emptyOnSubmit : _c, _d = _a.remoteValidation, remoteValidation = _d === void 0 ? false : _d, _e = _a.skipClientValidation, skipClientValidation = _e === void 0 ? false : _e, _f = _a.name, name = _f === void 0 ? formConfigDefault.name : _f, _g = _a.initialValues, initialValues = _g === void 0 ? formConfigDefault.initialValues : _g, _h = _a.validateOnBlur, validateOnBlur = _h === void 0 ? formConfigDefault.validateOnBlur : _h, _j = _a.validateOnChange, validateOnChange = _j === void 0 ? formConfigDefault.validateOnChange : _j;
    var form = useMemo(function () {
        return createForm({ name: name });
    }, [name]);
    var submit = function (event) {
        event.preventDefault();
        if (remoteValidation) {
            return form.submitRemote({ cb: onSubmit, skipClientValidation: skipClientValidation });
        }
        form.submit({ cb: onSubmit });
    };
    var elements = React.Children.toArray(children);
    return (_jsx("form", __assign({ onSubmit: submit }, { children: elements.map(function (field) {
            var _a, _b;
            var isExField = ((_b = (_a = field) === null || _a === void 0 ? void 0 : _a.type) === null || _b === void 0 ? void 0 : _b.displayName) === 'REfxField';
            return isExField ? React.cloneElement(field, {
                form: form,
                formConfig: {
                    initialValues: initialValues,
                    validateOnBlur: validateOnBlur,
                    validateOnChange: validateOnChange,
                },
            }) : field;
        }) }), void 0));
};
REfxForm.displayName = 'REfxForm';
export var REfxField = function (_a) {
    var Field = _a.Field, _b = _a.form, form = _b === void 0 ? createForm({ name: formConfigDefault.name }) : _b, name = _a.name, _c = _a.formConfig, _d = _c === void 0 ? omit(formConfigDefault, ['name']) : _c, _e = _d.initialValues, initialValues = _e === void 0 ? {} : _e, formConfig = __rest(_d, ["initialValues"]), _f = _a.initialValue, initialValue = _f === void 0 ? initialValues[name] : _f, _g = _a.parse, parse = _g === void 0 ? fieldConfigDefault.parse : _g, _h = _a.format, format = _h === void 0 ? fieldConfigDefault.format : _h, _j = _a.validators, validators = _j === void 0 ? fieldConfigDefault.validators : _j, validateOnBlur = _a.validateOnBlur, validateOnChange = _a.validateOnChange, props = __rest(_a, ["Field", "form", "name", "formConfig", "initialValue", "parse", "format", "validators", "validateOnBlur", "validateOnChange"]);
    var _k = useMemo(function () {
        var field = form.fields[name];
        var fieldConfig = __assign({ name: name, form: form, initialValue: initialValue, parse: parse, validators: validators, validateOnBlur: validateOnBlur, validateOnChange: validateOnChange }, formConfig);
        field && (field.config = fieldConfig);
        return field || form.registerField(fieldConfig);
    }, [form, name, initialValue, parse, validators, validateOnBlur, validateOnChange, formConfig]), $value = _k.$value, $errors = _k.$errors, onChange = _k.onChange, onBlur = _k.onBlur;
    var value = useStore($value) || '';
    var error = useStore($errors)[0];
    return (_jsx(Field, __assign({}, __assign({ error: error, name: name, value: format(value), onChange: onChange, onBlur: function () { return onBlur(); } }, props)), void 0));
};
REfxField.displayName = 'REfxField';
