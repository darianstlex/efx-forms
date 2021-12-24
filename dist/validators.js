export var required = function (_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.msg, msg = _c === void 0 ? 'This field is required' : _c;
    return function (val) { return !val ? msg : false; };
};
export var email = function (_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.msg, msg = _c === void 0 ? 'Must be a valid email' : _c;
    return function (val) { return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? msg : false; };
};
export var min = function (_a) {
    var value = _a.value, _b = _a.msg, msg = _b === void 0 ? "Must be greater than or equal to ".concat(value) : _b;
    return function (val) { return Number(val) < value ? msg : false; };
};
export var max = function (_a) {
    var value = _a.value, _b = _a.msg, msg = _b === void 0 ? "Must be less than or equal to ".concat(value) : _b;
    return function (val) { return Number(val) > value ? msg : false; };
};
export var lessThan = function (_a) {
    var value = _a.value, _b = _a.msg, msg = _b === void 0 ? "Must be less than ".concat(value) : _b;
    return function (val) { return "".concat(val).length >= value ? msg : false; };
};
export var moreThan = function (_a) {
    var value = _a.value, _b = _a.msg, msg = _b === void 0 ? "Must be greater than ".concat(value) : _b;
    return function (val) { return "".concat(val).length <= value ? msg : false; };
};
export var length = function (_a) {
    var value = _a.value, _b = _a.msg, msg = _b === void 0 ? "Must be exactly ".concat(value, " characters") : _b;
    return function (val) { return "".concat(val).length !== value ? msg : false; };
};
export var matches = function (_a) {
    var regexp = _a.regexp, _b = _a.label, label = _b === void 0 ? '' : _b, _c = _a.msg, msg = _c === void 0 ? "Must match the following: \"".concat(label, "\"") : _c;
    return function (val) { return !regexp.test(val) ? msg : false; };
};
export var positive = function (_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.msg, msg = _c === void 0 ? 'Must be a positive number' : _c;
    return function (val) { return Number(val) <= 0 ? msg : false; };
};
export var negative = function (_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.msg, msg = _c === void 0 ? 'Must be a negative number' : _c;
    return function (val) { return Number(val) >= 0 ? msg : false; };
};
export var number = function (_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.msg, msg = _c === void 0 ? 'Must be a number' : _c;
    return function (val) { return isNaN(Number(val)) ? msg : false; };
};
