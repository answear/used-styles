import { __spreadArray } from 'tslib';
import memoizeOne from 'memoize-one';
import { isReact } from '../config';
var memoizedArray = memoizeOne(function () {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  return args;
});
export var getStylesInText = function (html) {
  return memoizedArray.apply(void 0, isReact() ? getStylesInReactText(html) : getStylesInPlainText(html));
};
export var getStylesInPlainText = function (html) {
  return __spreadArray(
    __spreadArray([], html.match(/class=["']([^"]+)["']/g) || [], true),
    html.match(/class=([^"'\s>]+)/g) || [],
    true
  ).map(function (className) {
    return className.replace(/(class|'|"|=)+/g, '');
  });
};
var classPlaceholder = 'class="';
var classPlaceholderLength = classPlaceholder.length;
export var getStylesInReactText = function (html) {
  return __spreadArray([], html.match(/class="([^"]+)"/g) || [], true).map(function (className) {
    return className.substr(classPlaceholderLength, className.length - classPlaceholderLength - 1);
  });
};
// ----
export var findLastBrace = function (str) {
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
export var flattenClasses = function (classes) {
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
