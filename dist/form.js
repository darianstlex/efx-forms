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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var _a;
import { combine, guard, sample } from 'effector';
import isEmpty from 'lodash-es/isEmpty';
import pickBy from 'lodash-es/pickBy';
import { domain } from './utils';
import { createField } from './field';
var store = domain.store, effect = domain.effect, event = domain.event;
export var formConfigDefault = {
    name: 'default',
    initialValues: {},
    onSubmit: function () { },
    remoteValidation: false,
    skipClientValidation: false,
    validateOnBlur: true,
    validateOnChange: false,
    validations: {},
};
export var forms = (_a = {},
    _a[formConfigDefault.name] = {},
    _a);
var hasTruthy = function (object) { return Object.values(object).some(function (it) { return it; }); };
var createFormHandler = function (formConfig) {
    var config = __assign({}, formConfig);
    var name = formConfig.name;
    var fields = {};
    var updateActive = event("".concat(name, "-form-update-field-state"));
    var updateError = event("".concat(name, "-form-update-validation"));
    var updateTouch = event("".concat(name, "-form-update-touch"));
    var updateDirty = event("".concat(name, "-form-update-touch"));
    var updateValue = event("".concat(name, "-form-update-value"));
    var reset = event("".concat(name, "-form-reset"));
    var onChange = event("".concat(name, "-form-change"));
    /**
     * Validation errors store - keeps all fields validation errors
     */
    var $errors = store({}, { name: "$".concat(name, "-form-errors") })
        .on(updateError, function (state, _a) {
        var _b;
        var name = _a.name, error = _a.error;
        return (__assign(__assign({}, state), (_b = {}, _b[name] = error, _b)));
    });
    /**
     * Calculates form validation
     */
    var $valid = $errors.map(function (state) { return !isEmpty(state) ? !hasTruthy(state) : true; });
    /**
     * Fields status store - keeps fields activity / visibility status
     */
    var $active = store({}, { name: "$".concat(name, "-form-active") })
        .on(updateActive, function (state, _a) {
        var _b;
        var name = _a.name, active = _a.active;
        return (__assign(__assign({}, state), (_b = {}, _b[name] = active, _b)));
    });
    /**
     * Touches store - keeps all fields touches
     */
    var $touches = store({}, { name: "$".concat(name, "-form-touches") })
        .on(updateTouch, function (state, _a) {
        var _b;
        var name = _a.name, touched = _a.touched;
        return (__assign(__assign({}, state), (_b = {}, _b[name] = touched, _b)));
    });
    /**
     * Calculates form touched
     */
    var $touched = $touches.map(function (state) { return !isEmpty(state) ? !hasTruthy(state) : true; });
    /**
     * Dirties store - keeps all fields dirty
     */
    var $dirties = store({}, { name: "$".concat(name, "-form-dirties") })
        .on(updateDirty, function (state, _a) {
        var _b;
        var name = _a.name, dirty = _a.dirty;
        return (__assign(__assign({}, state), (_b = {}, _b[name] = dirty, _b)));
    });
    /**
     * Calculates form dirty
     */
    var $dirty = $dirties.map(function (state) { return !isEmpty(state) ? hasTruthy(state) : false; });
    /**
     * Values store - keeps all fields values
     */
    var $values = store({}, { name: "$".concat(name, "-form-values") })
        .on(updateValue, function (state, _a) {
        var _b;
        var name = _a.name, value = _a.value;
        return (__assign(__assign({}, state), (_b = {}, _b[name] = value, _b)));
    });
    /**
     * Changes store, triggers change on field change event
     */
    var $changes = store({}, { name: "$".concat(name, "-form-changes") })
        .on(sample({
        clock: onChange,
        fn: function (values, _a) {
            var _b;
            var name = _a.name, value = _a.value;
            return (__assign(__assign({}, values), (_b = {}, _b[name] = value, _b)));
        },
        source: $values,
    }), function (_, values) { return values; });
    /**
     * Sync form submit with option to skip validation
     */
    var submit = function (_a) {
        var cb = _a.cb, skipClientValidation = _a.skipClientValidation;
        Object.values(fields).forEach(function (_a) {
            var validate = _a.validate;
            return validate();
        });
        if ($valid.getState() || skipClientValidation) {
            cb($values.getState());
        }
    };
    /**
     * Remote validation form submit with option to skip client validation
     * cb - is api call for the remote validation, response contains validation
     * results in format { field1: message, field2: message }, if empty - valid
     */
    var submitRemote = effect({
        handler: function (_a) {
            var cb = _a.cb, _b = _a.skipClientValidation, skipClientValidation = _b === void 0 ? false : _b;
            return __awaiter(void 0, void 0, void 0, function () {
                var remoteErrors_1;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!skipClientValidation) {
                                Object.values(fields).forEach(function (_a) {
                                    var validate = _a.validate;
                                    return validate();
                                });
                                if (!$valid.getState()) {
                                    return [2 /*return*/, Promise.reject({ errors: $errors.getState() })];
                                }
                            }
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, cb($values.getState())];
                        case 2:
                            _c.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            remoteErrors_1 = _c.sent();
                            return [2 /*return*/, Promise.reject({ remoteErrors: remoteErrors_1 })];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
        name: "".concat(name, "-form-submit"),
    });
    return {
        name: name,
        $active: $active,
        $actives: combine($active, $values, function (active, values) { return pickBy(values, function (_, name) { return active[name]; }); }),
        $changes: $changes,
        $errors: $errors,
        $valid: $valid,
        $values: $values,
        $touched: $touched,
        $touches: $touches,
        $dirty: $dirty,
        $dirties: $dirties,
        $submitting: submitRemote.pending,
        get config() {
            return config;
        },
        set config(formConfig) {
            config = __assign(__assign({}, config), formConfig);
        },
        get fields() {
            return fields;
        },
        reset: reset,
        submit: submit,
        submitRemote: submitRemote,
        getField: function (name) { return fields[name]; },
        registerField: function (_a) {
            var name = _a.name, fieldConfig = __rest(_a, ["name"]);
            if (fields[name]) {
                fields[name].config = __assign({ name: name }, fieldConfig);
            }
            fields[name] = createField(__assign({ name: name }, fieldConfig), {
                formChange: onChange,
                resetField: reset,
                updateActive: updateActive,
                updateError: updateError,
                updateDirty: updateDirty,
                updateTouch: updateTouch,
                updateValue: updateValue,
                setRemoteErrors: guard({
                    source: submitRemote.failData,
                    filter: function (_a) {
                        var remoteErrors = _a.remoteErrors;
                        return !!remoteErrors;
                    },
                }),
            });
            setTimeout(function () { return fields[name].syncData(); }, 0);
            return fields[name];
        },
        removeField: function (name) {
            delete (fields[name]);
        },
        update: function (values) {
            Object.entries(values).forEach(function (_a) {
                var _b;
                var field = _a[0], value = _a[1];
                (_b = fields[field]) === null || _b === void 0 ? void 0 : _b.update(value);
            });
        },
    };
};
/**
 * Create/return form with the given name/config
 */
export var createForm = function (config) {
    var name = config.name;
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
export var getForm = function (name) {
    if (name === void 0) { name = formConfigDefault.name; }
    return forms[name] || createForm({ name: name });
};
