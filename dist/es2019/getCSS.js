import { kashe } from 'kashe';
import { extractUnmatchable, fromAst, getUnmatchableRules } from './parser/fromAst';
import { assertIsReady } from './utils/async';
import { createUsedFilter } from './utils/cache';
import { unique } from './utils/order';
import { flattenClasses, getStylesInText } from './utils/string';
export const getUnusableStyles = kashe((def) =>
  Object.keys(def.ast || {})
    .filter((key) => getUnmatchableRules(def.ast[key]).length > 0)
    .reduce((acc, file) => {
      acc[file] = true;
      return acc;
    }, {})
);
export const astToUsedStyles = kashe((styles, def) => {
  const { lookup, ast } = def;
  const fetches = {};
  const visitedStyles = new Set();
  styles.forEach((className) => {
    if (visitedStyles.has(className)) {
      return;
    }
    visitedStyles.add(className);
    const classes = className.split(' ');
    classes.forEach((singleClass) => {
      if (lookup.hasOwnProperty(singleClass)) {
        const files = lookup[singleClass];
        files.forEach((file) => {
          if (!fetches[file]) {
            fetches[file] = {};
          }
          fetches[file][singleClass] = true;
        });
      }
    });
  });
  return {
    fetches,
    usage: Object.keys(ast).filter((file) => !!fetches[file]),
  };
});
const getUsedStylesIn = kashe((styles, def) => {
  assertIsReady(def);
  const { usage } = astToUsedStyles(styles, def);
  const flags = {
    ...getUnusableStyles(def),
    ...usage.reduce((acc, file) => {
      acc[file] = true;
      return acc;
    }, {}),
  };
  return Object.keys(
    Object.keys(def.ast).reduce((acc, file) => {
      if (flags[file]) {
        acc[file] = true;
      }
      return acc;
    }, {})
  );
});
/**
 * returns names of the style files for a given HTML and style definitions
 */
export const getUsedStyles = (htmlCode, def) => {
  assertIsReady(def);
  return getUsedStylesIn(getStylesInText(htmlCode), def);
};
const astToStyles = kashe((styles, def, filter) => {
  const { ast } = def;
  const { fetches, usage } = astToUsedStyles(styles, def);
  if (filter && filter.introduceClasses) {
    filter.introduceClasses(flattenClasses(styles));
  }
  return usage.map((file) => ({
    file,
    css: fromAst(Object.keys(fetches[file]), ast[file], filter),
  }));
});
export const wrapInStyle = (styles, usedStyles = []) =>
  styles
    ? `<style type="text/css" data-used-styles="${
        usedStyles.length === 0 ? 'true' : usedStyles.join(',')
      }">${styles}</style>`
    : '';
export const extractUnmatchableFromAst = kashe((ast, filter) =>
  Object.keys(ast || {})
    .map((file) => {
      const css = extractUnmatchable(ast[file], filter);
      if (css) {
        return {
          file,
          css,
        };
      }
      return undefined;
    })
    .filter((x) => !!x)
    .map((x) => x)
);
export const extractAllUnmatchable = (def, filter) => extractUnmatchableFromAst(def.ast, filter);
export const extractAllUnmatchableAsString = kashe((def) =>
  wrapInStyle(
    extractAllUnmatchable(def).reduce((acc, { css }) => acc + css, ''),
    ['_unmatched']
  )
);
/**
 * just wraps with <style
 */
const criticalRulesToStyle = (styles, urlPrefix = '') =>
  wrapInStyle(styles.map(({ css }) => css).join(''), unique(styles.map(({ file }) => `${urlPrefix}${file}`)));
export const criticalStylesToString = (html, def, filter) => {
  assertIsReady(def);
  return criticalRulesToStyle(astToStyles(getStylesInText(html), def, filter), def.urlPrefix);
};
const getRawCriticalRules = (html, def, filter) => {
  assertIsReady(def);
  return astToStyles(getStylesInText(html), def, filter);
};
/**
 * returns critical rules(selector) used in a given HTML code, including unmatchable rules, which can be used indirectly
 * for example `:root`.
 * @see {@link extractCriticalRules} for chunk-based operations
 */
export const getCriticalRules = (html, def, filter = createUsedFilter()) => {
  assertIsReady(def);
  return [...extractAllUnmatchable(def, filter), ...getRawCriticalRules(html, def, filter)]
    .map(({ css, file }) => `\n/* ${file} */\n${css}`)
    .join('');
};
/**
 * returns critical rules explicitly used in a given HTML code
 * @see {@link getCriticalRules} for more complete solution, including unmatchable rules as well
 */
export const extractCriticalRules = (html, def, filter = createUsedFilter()) => {
  assertIsReady(def);
  return getRawCriticalRules(html, def, filter)
    .map(({ css, file }) => `\n/* ${file} */\n${css}`)
    .join('');
};
/**
 * Generates "ready for use" styles for a given HTML
 * @see {@link getCriticalRules} for lower level API
 * @param html
 * @param def
 * @param filter
 */
export const getCriticalStyles = (html, def, filter = createUsedFilter()) => {
  assertIsReady(def);
  return criticalRulesToStyle(
    [...extractAllUnmatchable(def, filter), ...getRawCriticalRules(html, def, filter)],
    def.urlPrefix
  );
};
