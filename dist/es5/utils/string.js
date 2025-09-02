'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.flattenClasses =
  exports.findLastBrace =
  exports.getStylesInReactText =
  exports.getStylesInPlainText =
  exports.getStylesInText =
    void 0;
var tslib_1 = require('tslib');
var memoize_one_1 = (0, tslib_1.__importDefault)(require('memoize-one'));
var config_1 = require('../config');
var memoizedArray = (0, memoize_one_1.default)(function () {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  return args;
});
var getStylesInText = function (html) {
  return memoizedArray.apply(
    void 0,
    (0, config_1.isReact)() ? (0, exports.getStylesInReactText)(html) : (0, exports.getStylesInPlainText)(html)
  );
};
exports.getStylesInText = getStylesInText;
var getStylesInPlainText = function (html) {
  return (0, tslib_1.__spreadArray)(
    (0, tslib_1.__spreadArray)([], html.match(/class=["']([^"]+)["']/g) || [], true),
    html.match(/class=([^"'\s>]+)/g) || [],
    true
  ).map(function (className) {
    return className.replace(/(class|'|"|=)+/g, '');
  });
};
exports.getStylesInPlainText = getStylesInPlainText;
var classPlaceholder = 'class="';
var classPlaceholderLength = classPlaceholder.length;
var getStylesInReactText = function (html) {
  return (0, tslib_1.__spreadArray)([], html.match(/class="([^"]+)"/g) || [], true).map(function (className) {
    return className.substr(classPlaceholderLength, className.length - classPlaceholderLength - 1);
  });
};
exports.getStylesInReactText = getStylesInReactText;
// ----
var findLastBrace = function (str) {
  var fromIndex = 0;
  while (true) {
    var classNamePosition = str.indexOf('class=', fromIndex);
    var endBrace = str.indexOf('>', Math.max(classNamePosition, fromIndex + 1)) + 1;
    if (endBrace === 0) {
      break;
    }
    fromIndex = Math.max(classNamePosition, endBrace);
  }
  return fromIndex;
};
exports.findLastBrace = findLastBrace;
var flattenClasses = function (classes) {
  var result = new Set();
  for (var _i = 0, classes_1 = classes; _i < classes_1.length; _i++) {
    var cls = classes_1[_i];
    if (cls.includes(' ')) {
      cls.split(' ').forEach(function (cl) {
        return result.add(cl);
      });
    } else {
      result.add(cls);
    }
  }
  return Array.from(result.values());
};
exports.flattenClasses = flattenClasses;
