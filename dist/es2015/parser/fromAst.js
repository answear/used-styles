import { kashe } from 'kashe';
import * as postcss from 'postcss';
var separator = process.env.NODE_ENV === 'production' ? '' : '\n';
export var escapeValue = function (value, name) {
  if (name === 'content') {
    return value.split('\\').join('\\\\');
  }
  return value;
};
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
var renderRule = kashe(function (rule, style) {
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
export var fromAst = function (rules, def, filter) {
  var blocks = [];
  var lookup = new Set(rules);
  blocks.push.apply(
    blocks,
    findMatchingSelectors(lookup, def.selectors).filter(function (block) {
      return !filter || filter(block.selector, block);
    })
  );
  return convertToString(blocks, def);
};
export var getUnmatchableRules = function (def, filter) {
  return findUnmatchableSelectors(def.selectors).filter(function (block) {
    return !filter || filter(block.selector, block);
  });
};
export var extractUnmatchable = function (def, filter) {
  return convertToString(getUnmatchableRules(def, filter), def) + getAtRules(def);
};
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
export var convertToString = function (blocks, _a) {
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
