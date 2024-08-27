export class AssertionError extends Error {
}

export function assert(condition: any, msg?: string): asserts condition {
   if (!condition)
      throw new AssertionError(msg);
}

function assertIsString(value: any): asserts value is string {
   if (!isString(value))
      throw new AssertionError("Not a string!");
}

/**
 * @ngdoc function
 * @name angular.isUndefined
 * @module ng
 * @kind function
 *
 * @description
 * Determines if a reference is undefined.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is undefined.
 */
export function isUndefined(value: any) {
   return typeof value === 'undefined';
}

/**
 * @ngdoc function
 * @name angular.isDefined
 * @module ng
 * @kind function
 *
 * @description
 * Determines if a reference is defined.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is defined.
 */
export function isDefined(value: any): value is any {
   return typeof value !== 'undefined';
}

/**
 * @ngdoc function
 * @name angular.isObject
 * @module ng
 * @kind function
 *
 * @description
 * Determines if a reference is an `Object`. Unlike `typeof` in JavaScript, `null`s are not
 * considered to be objects. Note that JavaScript arrays are objects.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is an `Object` but not `null`.
 */
export function isObject(value: any): value is any {
   return value != null && typeof value === 'object';
}

/**
 * @ngdoc function
 * @name angular.isString
 * @module ng
 * @kind function
 *
 * @description
 * Determines if a reference is a `String`.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `String`.
 */
export function isString(value: any): value is string {
   return typeof value === 'string';
}

export function testString(value: any): boolean {
   return value != null && value !== '';
}

/**
 * @ngdoc function
 * @name angular.isNumber
 * @module ng
 * @kind function
 *
 * @description
 * Determines if a reference is a `Number`.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `Number`.
 */
export function isNumber(value: any): value is number {
   return typeof value === 'number';
}

export function isStringOrNumber(value: any): boolean {
   return isString(value) || isNumber(value);
}

/**
 * @ngdoc function
 * @name angular.isDate
 * @module ng
 * @kind function
 *
 * @description
 * Determines if a value is a date.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `Date`.
 */
export function isDate(value: any): value is Date {
   return Object.toString.call(value) === '[object Date]';
}

/**
 * @ngdoc function
 * @name angular.isFunction
 * @module ng
 * @kind function
 *
 * @description
 * Determines if a reference is a `Function`.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `Function`.
 */
export function isFunction(value: any): value is Function {
   return typeof value === 'function';
}

/**
 * Determines if a value is a regular expression object.
 *
 * @private
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `RegExp`.
 */
export function isRegExp(value: any): value is RegExp {
   return Object.toString.call(value) === '[object RegExp]';
}

export function isBoolean(value: any): value is boolean {
   return typeof value === 'boolean';
}

export function isArray(value: any): value is Array<any> {
   return Array.isArray(value);
}

export function isPromiseLike(obj: any): obj is { then(): void } {
   return obj && isDefined(obj) && isFunction(obj.then);
}