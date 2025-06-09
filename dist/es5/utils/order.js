'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.unique = exports.flattenOrder = void 0;
var flattenOrder = function (order) {
  if (typeof order === 'number' || typeof order === 'string') {
    return +order;
  }
  if (order === true) {
    return 0;
  }
  return Number.NaN;
};
exports.flattenOrder = flattenOrder;
function unique(data) {
  return Array.from(new Set(data));
}
exports.unique = unique;
