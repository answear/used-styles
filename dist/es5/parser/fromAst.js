'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.convertToString =
  exports.extractUnmatchable =
  exports.getUnmatchableRules =
  exports.fromAst =
  exports.escapeValue =
    void 0;
var tslib_1 = require('tslib');
var kashe_1 = require('kashe');
var postcss = (0, tslib_1.__importStar)(require('postcss'));
var separator = process.env.NODE_ENV === 'production' ? '' : '\n';
var escapeValue = function (value, name) {
  if (name === 'content') {
    return value.split('\\').join('\\\\');
  }
  return value;
};
exports.escapeValue = escapeValue;
var createDecl = function (decl) {
  return postcss.decl(decl) + ';';
};
var declsToString = function (rules) {
  return rules
    .map(function (decl) {
      return createDecl(decl);
    })
    .join(separator);
};
var getProcessedAtRules = function (_a) {
  var atrules = _a.atrules;
  var prefix = [];
  var postfix = [];
  atrules.forEach(function (currentRule) {
    prefix.push('@' + currentRule.kind + ' ' + currentRule.value + ' {');
    postfix.push('}');
  });
  return [prefix.join(separator), postfix.join(separator)];
};
var renderRule = (0, kashe_1.kashe)(function (rule, style) {
  return rule.selector + ' { ' + declsToString(style.rules) + ' }';
});
var isMatching = function (rule, rules) {
  return (
    rule.pieces.length > 0 &&
    rule.pieces.every(function (piece) {
      return rules.has(piece);
    })
  );
};
var findMatchingSelectors = function (rules, selectors) {
  return selectors.filter(function (rule) {
    return isMatching(rule, rules);
  });
};
var findUnmatchableSelectors = function (selectors) {
  return selectors.filter(function (rule) {
    return rule.pieces.length === 0;
  });
};
var fromAst = function (rules, def, filter) {
  var blocks = [];
  var lookup = new Set(rules);
  blocks.push.apply(
    blocks,
    findMatchingSelectors(lookup, def.selectors).filter(function (block) {
      return !filter || filter(block.selector, block);
    })
  );
  return (0, exports.convertToString)(blocks, def);
};
exports.fromAst = fromAst;
var getUnmatchableRules = function (def, filter) {
  return findUnmatchableSelectors(def.selectors).filter(function (block) {
    return !filter || filter(block.selector, block);
  });
};
exports.getUnmatchableRules = getUnmatchableRules;
var extractUnmatchable = function (def, filter) {
  return (0, exports.convertToString)((0, exports.getUnmatchableRules)(def, filter), def) + getAtRules(def);
};
exports.extractUnmatchable = extractUnmatchable;
var getAtRules = function (def) {
  return def.unknownAtRules.reduce(function (acc, rule) {
    if (rule.kind === 'layer') {
      /**
       * These are the cases of cascade layer styles order definition,
       * which should have an `;` in the end of the rule.
       */
      return acc + rule.css + ';';
    }
    return acc + rule.css;
  }, '');
};
var convertToString = function (blocks, _a) {
  var bodies = _a.bodies;
  blocks.sort(function (ruleA, ruleB) {
    return bodies[ruleA.declaration].id - bodies[ruleB.declaration].id;
  });
  var result = [];
  var lastProcessedAtRule = ['', ''];
  blocks.forEach(function (block, index) {
    var processedAtRule = getProcessedAtRules(block);
    if (processedAtRule[0] !== lastProcessedAtRule[0]) {
      result.push(lastProcessedAtRule[1]);
      lastProcessedAtRule = processedAtRule;
      result.push(lastProcessedAtRule[0]);
    }
    if (index < blocks.length - 1 && block.declaration === blocks[index + 1].declaration) {
      result.push(block.selector + ',');
    } else {
      result.push(renderRule(block, bodies[block.declaration]));
    }
  });
  result.push(lastProcessedAtRule[1]);
  return result.join(separator);
};
exports.convertToString = convertToString;
