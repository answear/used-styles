'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.buildAst = void 0;
var tslib_1 = require('tslib');
// @ts-ignore
var crc32 = (0, tslib_1.__importStar)(require('crc-32'));
var postcss = (0, tslib_1.__importStar)(require('postcss'));
var split_selectors_1 = require('../utils/split-selectors');
var ranges_1 = require('./ranges');
var utils_1 = require('./utils');
var isCascadeLayerStyles = function (rule) {
  /**
   * This detects cases like `@layer something { ... }`,
   * but not the cases of layers order definition like `@layer a, b, c;`
   */
  return rule.name === 'layer' && rule.nodes;
};
/**
 * There are few cases of @-rules, which are getting special processing,
 * like `@media` and `@layer` (cascade layer styles order definition).
 *
 * Any other kind of @-rule is not processed and is just passed to critical css as is.
 */
var getProcessedAtRule = function (rule) {
  var parent = rule.parent;
  if (parent && (parent.name === 'media' || parent.name === 'layer')) {
    return getProcessedAtRule(parent).concat({ value: parent.params, kind: parent.name });
  }
  return [];
};
var getBreak = function (rule) {
  var breakPoints = [
    rule.indexOf(' '),
    rule.indexOf('>'),
    rule.indexOf('~'),
    rule.indexOf('+'),
    rule.indexOf(':'),
  ].filter(function (index) {
    return index > 0;
  });
  if (breakPoints.length === 0) {
    return rule.length;
  }
  var min = Math.min.apply(Math, breakPoints);
  return min ? min : rule.length;
};
var getPostfix = function (rule) {
  return rule.substr(getBreak(rule)).trim();
};
var bodyCounter = 1;
var assignBody = function (decl, bodies) {
  var d = Object.values(bodies).find(function (bodyDecl) {
    return (0, ranges_1.rangesIntervalEqual)(bodyDecl, decl);
  });
  if (d) {
    return d;
  }
  decl.id = bodyCounter++;
  bodies[decl.id] = decl;
  return decl;
};
var hashString = function (str) {
  if (str === undefined) {
    return '';
  }
  return crc32.str(str).toString(32);
};
var hashBody = function (body) {
  return hashString(JSON.stringify(body.rules));
};
var buildAst = function (CSS, file) {
  if (file === void 0) {
    file = '';
  }
  var root = postcss.parse(CSS);
  var selectors = [];
  var unknownAtRules = [];
  var bodies = {};
  var atParents = new Set();
  root.walkAtRules(function (rule) {
    if (rule.name === 'charset') {
      return;
    }
    if (atParents.has(rule.parent)) {
      atParents.add(rule);
      return;
    }
    if (rule.name !== 'media' && !isCascadeLayerStyles(rule)) {
      atParents.add(rule);
      unknownAtRules /*[rule.params]*/
        .push({
          kind: rule.name,
          id: rule.params,
          css: rule.toString(),
        });
    }
  });
  root.walkRules(function (rule) {
    if (atParents.has(rule.parent)) {
      return;
    }
    var ruleSelectors = (0, split_selectors_1.splitSelector)(rule.selector);
    ruleSelectors
      .map(function (sel) {
        return sel.trim();
      })
      .forEach(function (selector) {
        var stand = {
          atrules: getProcessedAtRule(rule),
          selector: selector,
          pieces: (0, utils_1.mapSelector)(selector),
          postfix: getPostfix(selector),
          declaration: 0,
          hash: selector,
        };
        var parents = (0, utils_1.extractParents)(selector);
        if (parents.length > 0) {
          stand.parents = parents;
        }
        var delc = {
          id: NaN,
          rules: [],
          start: (0, ranges_1.createRange)(Infinity, Infinity),
          end: (0, ranges_1.createRange)(0, 0),
        };
        rule.walkDecls(function (_a) {
          var prop = _a.prop,
            value = _a.value,
            source = _a.source,
            important = _a.important;
          if (source) {
            delc.start = (0, ranges_1.localRangeMin)(delc.start, source.start);
            delc.end = (0, ranges_1.localRangeMax)(delc.end, source.end);
            delc.rules.push({
              prop: prop,
              value: value,
              important: important,
            });
          }
        });
        stand.declaration = assignBody(delc, bodies).id;
        stand.hash =
          '' +
          selector +
          hashBody(delc) +
          hashString(stand.postfix) +
          hashString(
            stand.atrules
              .map(function (rule) {
                return rule.kind + rule.value;
              })
              .join()
          );
        selectors.push(stand);
      });
  });
  return {
    file: file,
    selectors: selectors,
    bodies: bodies,
    unknownAtRules: unknownAtRules,
  };
};
exports.buildAst = buildAst;
