import { kashe } from 'kashe';
import * as postcss from 'postcss';
const separator = process.env.NODE_ENV === 'production' ? '' : '\n';
export const escapeValue = (value, name) => {
  if (name === 'content') {
    return value.split('\\').join('\\\\');
  }
  return value;
};
const createDecl = (decl) => postcss.decl(decl) + ';';
const declsToString = (rules) => rules.map((decl) => createDecl(decl)).join(separator);
const getProcessedAtRules = ({ atrules }) => {
  const prefix = [];
  const postfix = [];
  atrules.forEach((currentRule) => {
    prefix.push(`@${currentRule.kind} ${currentRule.value} {`);
    postfix.push('}');
  });
  return [prefix.join(separator), postfix.join(separator)];
};
const renderRule = kashe((rule, style) => `${rule.selector} { ${declsToString(style.rules)} }`);
const isMatching = (rule, rules) => rule.pieces.length > 0 && rule.pieces.every((piece) => rules.has(piece));
const findMatchingSelectors = (rules, selectors) => selectors.filter((rule) => isMatching(rule, rules));
const findUnmatchableSelectors = (selectors) => selectors.filter((rule) => rule.pieces.length === 0);
export const fromAst = (rules, def, filter) => {
  const blocks = [];
  const lookup = new Set(rules);
  blocks.push(
    ...findMatchingSelectors(lookup, def.selectors).filter((block) => !filter || filter(block.selector, block))
  );
  return convertToString(blocks, def);
};
export const getUnmatchableRules = (def, filter) =>
  findUnmatchableSelectors(def.selectors).filter((block) => !filter || filter(block.selector, block));
export const extractUnmatchable = (def, filter) =>
  convertToString(getUnmatchableRules(def, filter), def) + getAtRules(def);
const getAtRules = (def) =>
  def.unknownAtRules.reduce((acc, rule) => {
    if (rule.kind === 'layer') {
      /**
       * These are the cases of cascade layer styles order definition,
       * which should have an `;` in the end of the rule.
       */
      return acc + rule.css + ';';
    }
    return acc + rule.css;
  }, '');
export const convertToString = (blocks, { bodies }) => {
  blocks.sort((ruleA, ruleB) => bodies[ruleA.declaration].id - bodies[ruleB.declaration].id);
  const result = [];
  let lastProcessedAtRule = ['', ''];
  blocks.forEach((block, index) => {
    const processedAtRule = getProcessedAtRules(block);
    if (processedAtRule[0] !== lastProcessedAtRule[0]) {
      result.push(lastProcessedAtRule[1]);
      lastProcessedAtRule = processedAtRule;
      result.push(lastProcessedAtRule[0]);
    }
    if (index < blocks.length - 1 && block.declaration === blocks[index + 1].declaration) {
      result.push(`${block.selector},`);
    } else {
      result.push(renderRule(block, bodies[block.declaration]));
    }
  });
  result.push(lastProcessedAtRule[1]);
  return result.join(separator);
};
