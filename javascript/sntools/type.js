function isArray (obj) {return Object.prototype.toString.call(obj) === '[object Array]';}

function isObject (obj) {return Object.prototype.toString.call(obj) === '[object Object]';}

function isString (obj) {return Object.prototype.toString.call(obj) === '[object String]';}

function isNumber (obj) {return Object.prototype.toString.call(obj) === '[object Number]';}

function isUndefined (obj) {return Object.prototype.toString.call(obj) === '[object Undefined]';}

function isNull (obj) {return Object.prototype.toString.call(obj) === '[object Null]';}

function isSymbol (obj) {return Object.prototype.toString.call(obj) === '[object Symbol]';}

function isFunction (obj) {return Object.prototype.toString.call(obj) === '[object Function]';}

function isCSSStyleDeclaration (obj) {return Object.prototype.toString.call(obj) === '[object CSSStyleDeclaration]';}

function isEmpty (obj) {

  switch (Object.prototype.toString.call(obj)) {
    case '[object Object]': {
      let flag = true;
      for (let key in obj) {flag = false;}
      return { empty: flag, suggest: '{}' };
    }
    case '[object Array]': {
      let flag = true;
      for (let key in obj) {flag = false;}
      return { empty: flag, suggest: '[]' };
    }
    case '[object String]': {

      return { empty: !obj, suggest: '空字符串' };
    }
    default:
      return true;
  }
}

export {
  isArray,
  isObject,
  isString,
  isNumber,
  isUndefined,
  isNull,
  isSymbol,
  isFunction,
  isEmpty,
};
