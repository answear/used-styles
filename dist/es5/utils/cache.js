'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.createUsedFilter = exports.createLine = void 0;
var createLine = function () {
  return {
    tail: '',
  };
};
exports.createLine = createLine;
var createUsedFilter = function () {
  var usedSelectors = new Set();
  var knownClasses = new Set();
  var filter = function (_, rule) {
    // if rule is already seen - skip
    if (usedSelectors.has(rule.hash)) {
      return false;
    }
    // if one of the parents of this rule has not been introduced yed - skip
    var parents = rule.parents;
    if (parents) {
      if (
        !parents.every(function (parent) {
          return knownClasses.has(parent);
        })
      ) {
        return false;
      }
    }
    usedSelectors.add(rule.hash);
    return true;
  };
  filter.introduceClasses = function (classes) {
    return classes.forEach(function (cl) {
      return knownClasses.add(cl);
    });
  };
  return filter;
};
exports.createUsedFilter = createUsedFilter;
