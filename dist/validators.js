export var required = function (_a) {
    var _b = _a.msg, msg = _b === void 0 ? 'This field is required' : _b;
    return function (val) { return !val ? msg : false; };
};
export var email = function (_a) {
    var _b = _a.msg, msg = _b === void 0 ? 'Must be a valid email' : _b;
    return function (val) { return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? msg : false; };
};
export var min = function (_a) {
    var min = _a.min, _b = _a.msg, msg = _b === void 0 ? "Must be greater than or equal to ".concat(min) : _b;
    return function (val) { return Number(val) < min ? msg : false; };
};
export var max = function (_a) {
    var max = _a.max, _b = _a.msg, msg = _b === void 0 ? "Must be less than or equal to ".concat(max) : _b;
    return function (val) { return Number(val) > max ? msg : false; };
};
export var lessThan = function (_a) {
    var less = _a.less, _b = _a.msg, msg = _b === void 0 ? "Must be less than ".concat(less) : _b;
    return function (val) { return "".concat(val).length >= less ? msg : false; };
};
export var moreThan = function (_a) {
    var more = _a.more, _b = _a.msg, msg = _b === void 0 ? "Must be greater than ".concat(more) : _b;
    return function (val) { return "".concat(val).length <= more ? msg : false; };
};
export var length = function (_a) {
    var length = _a.length, _b = _a.msg, msg = _b === void 0 ? "Must be exactly ".concat(length, " characters") : _b;
    return function (val) { return "".concat(val).length !== length ? msg : false; };
};
export var matches = function (_a) {
    var regexp = _a.regexp, pattern = _a.pattern, _b = _a.msg, msg = _b === void 0 ? "Must match the following: \"".concat(pattern, "\"") : _b;
    return function (val) { return !regexp.test(val) ? msg : false; };
};
export var positive = function (_a) {
    var _b = _a.msg, msg = _b === void 0 ? 'Must be a positive number' : _b;
    return function (val) { return Number(val) <= 0 ? msg : false; };
};
export var negative = function (_a) {
    var _b = _a.msg, msg = _b === void 0 ? 'Must be a negative number' : _b;
    return function (val) { return Number(val) >= 0 ? msg : false; };
};
