'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.pruneSelector = void 0;
var tslib_1 = require('tslib');
var pruneSelector = function (ast, filter) {
  return (0, tslib_1.__assign)((0, tslib_1.__assign)({}, ast), {
    selectors: ast.selectors.filter(function (selector) {
      return !filter(selector.selector);
    }),
  });
};
exports.pruneSelector = pruneSelector;
