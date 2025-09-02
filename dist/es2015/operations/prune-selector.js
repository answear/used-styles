import { __assign } from 'tslib';
export var pruneSelector = function (ast, filter) {
  return __assign(__assign({}, ast), {
    selectors: ast.selectors.filter(function (selector) {
      return !filter(selector.selector);
    }),
  });
};
