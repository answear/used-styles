'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.mapSelector = exports.extractParents = exports.mapStyles = void 0;
var classish = function (str) {
  return !!str && str.indexOf('.') >= 0;
};
var mapStyles = function (styles) {
  return (
    (
      styles
        // remove style body
        .replace(/({[^{}]+})/g, '$')
        .replace(/({[^{}]+})/g, '$')
        // match style name
        .match(/\.([^>~,+$:{\[\s]+)?/g) || []
    )
      // clean style name
      .map(function (x) {
        return x.replace(/[\s,.>~+$]+/, '');
      })
      .map(function (x) {
        return x.replace(/[.\s.:]+/, '');
      })
  );
};
exports.mapStyles = mapStyles;
var extractParents = function (selector) {
  // replace `something:not(.something)` to `something:not`
  var cleanSelector = selector.replace(/\(([^)])*\)/g, '').replace(/(\\\+)/g, 'PLUS_SYMBOL');
  var parts = cleanSelector.split(' ');
  // remove the last part
  parts.pop();
  var ruleSelection =
    // anything like "class"
    parts.join(' ').match(/\.([^>~+$:{\[\s]+)?/g) || [];
  var effectiveMatcher = ruleSelection.filter(classish);
  var selectors = effectiveMatcher
    .map(function (x) {
      return x.replace(/[.\s.:]+/, '').replace(/PLUS_SYMBOL/g, '+');
    })
    .filter(Boolean)
    .flatMap(function (cl) {
      return cl.split('.');
    });
  return selectors;
};
exports.extractParents = extractParents;
var mapSelector = function (selector) {
  // replace `something:not(.something)` to `something:not`
  var cleanSelector = selector.replace(/\(([^)])*\)/g, '').replace(/(\\\+)/g, 'PLUS_SYMBOL');
  var ruleSelection =
    // anything like "class"
    cleanSelector.match(/\.([^>~+$:{\[\s]+)?/g) || [];
  ruleSelection.reverse();
  var effectiveMatcher = ruleSelection.find(classish) || '';
  var selectors = effectiveMatcher.match(/(\.[^.>~+,$:{\[\s]+)?/g);
  return (selectors || [])
    .map(function (x) {
      return x.replace(/[.\s.:]+/, '').replace(/PLUS_SYMBOL/g, '+');
    })
    .filter(Boolean);
};
exports.mapSelector = mapSelector;
