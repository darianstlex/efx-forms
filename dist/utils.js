import { createDomain } from 'effector';
import reduce from 'lodash-es/reduce';
import set from 'lodash-es/set';
export var domain = createDomain('forms');
export var shapeValues = function (values) { return reduce(values, function (acc, val, key) { return set(acc, key, val); }, {}); };
