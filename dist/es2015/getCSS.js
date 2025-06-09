import { __assign, __spreadArray } from 'tslib';
import { kashe } from 'kashe';
import { extractUnmatchable, fromAst, getUnmatchableRules } from './parser/fromAst';
import { assertIsReady } from './utils/async';
import { createUsedFilter } from './utils/cache';
import { unique } from './utils/order';
import { flattenClasses, getStylesInText } from './utils/string';
export var getUnusableStyles = kashe(function (def) {
  return Object.keys(def.ast || {})
    .filter(function (key) {
      return getUnmatchableRules(def.ast[key]).length > 0;
    })
    .reduce(function (acc, file) {
      acc[file] = true;
      return acc;
    }, {});
});
export var astToUsedStyles = kashe(function (styles, def) {
  var lookup = def.lookup,
    ast = def.ast;
  var fetches = {};
  var visitedStyles = new Set();
  styles.forEach(function (className) {
    if (visitedStyles.has(className)) {
      return;
    }
    visitedStyles.add(className);
    var classes = className.split(' ');
    classes.forEach(function (singleClass) {
      if (lookup.hasOwnProperty(singleClass)) {
        var files = lookup[singleClass];
        files.forEach(function (file) {
          if (!fetches[file]) {
            fetches[file] = {};
          }
          fetches[file][singleClass] = true;
        });
      }
    });
  });
  return {
    fetches: fetches,
    usage: Object.keys(ast).filter(function (file) {
      return !!fetches[file];
    }),
  };
});
var getUsedStylesIn = kashe(function (styles, def) {
  assertIsReady(def);
  var usage = astToUsedStyles(styles, def).usage;
  var flags = __assign(
    __assign({}, getUnusableStyles(def)),
    usage.reduce(function (acc, file) {
      acc[file] = true;
      return acc;
    }, {})
  );
  return Object.keys(
    Object.keys(def.ast).reduce(function (acc, file) {
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
export var getUsedStyles = function (htmlCode, def) {
  assertIsReady(def);
  return getUsedStylesIn(getStylesInText(htmlCode), def);
};
var astToStyles = kashe(function (styles, def, filter) {
  var ast = def.ast;
  var _a = astToUsedStyles(styles, def),
    fetches = _a.fetches,
    usage = _a.usage;
  if (filter && filter.introduceClasses) {
    filter.introduceClasses(flattenClasses(styles));
  }
  return usage.map(function (file) {
    return {
      file: file,
      css: fromAst(Object.keys(fetches[file]), ast[file], filter),
    };
  });
});
export var wrapInStyle = function (styles, usedStyles) {
  if (usedStyles === void 0) {
    usedStyles = [];
  }
  return styles
    ? '<style type="text/css" data-used-styles="' +
        (usedStyles.length === 0 ? 'true' : usedStyles.join(',')) +
        '">' +
        styles +
        '</style>'
    : '';
};
export var extractUnmatchableFromAst = kashe(function (ast, filter) {
  return Object.keys(ast || {})
    .map(function (file) {
      var css = extractUnmatchable(ast[file], filter);
      if (css) {
        return {
          file: file,
          css: css,
        };
      }
      return undefined;
    })
    .filter(function (x) {
      return !!x;
    })
    .map(function (x) {
      return x;
    });
});
export var extractAllUnmatchable = function (def, filter) {
  return extractUnmatchableFromAst(def.ast, filter);
};
export var extractAllUnmatchableAsString = kashe(function (def) {
  return wrapInStyle(
    extractAllUnmatchable(def).reduce(function (acc, _a) {
      var css = _a.css;
      return acc + css;
    }, ''),
    ['_unmatched']
  );
});
/**
 * just wraps with <style
 */
var criticalRulesToStyle = function (styles, urlPrefix) {
  if (urlPrefix === void 0) {
    urlPrefix = '';
  }
  return wrapInStyle(
    styles
      .map(function (_a) {
        var css = _a.css;
        return css;
      })
      .join(''),
    unique(
      styles.map(function (_a) {
        var file = _a.file;
        return '' + urlPrefix + file;
      })
    )
  );
};
export var criticalStylesToString = function (html, def, filter) {
  assertIsReady(def);
  return criticalRulesToStyle(astToStyles(getStylesInText(html), def, filter), def.urlPrefix);
};
var getRawCriticalRules = function (html, def, filter) {
  assertIsReady(def);
  return astToStyles(getStylesInText(html), def, filter);
};
/**
 * returns critical rules(selector) used in a given HTML code, including unmatchable rules, which can be used indirectly
 * for example `:root`.
 * @see {@link extractCriticalRules} for chunk-based operations
 */
export var getCriticalRules = function (html, def, filter) {
  if (filter === void 0) {
    filter = createUsedFilter();
  }
  assertIsReady(def);
  return __spreadArray(
    __spreadArray([], extractAllUnmatchable(def, filter), true),
    getRawCriticalRules(html, def, filter),
    true
  )
    .map(function (_a) {
      var css = _a.css,
        file = _a.file;
      return '\n/* ' + file + ' */\n' + css;
    })
    .join('');
};
/**
 * returns critical rules explicitly used in a given HTML code
 * @see {@link getCriticalRules} for more complete solution, including unmatchable rules as well
 */
export var extractCriticalRules = function (html, def, filter) {
  if (filter === void 0) {
    filter = createUsedFilter();
  }
  assertIsReady(def);
  return getRawCriticalRules(html, def, filter)
    .map(function (_a) {
      var css = _a.css,
        file = _a.file;
      return '\n/* ' + file + ' */\n' + css;
    })
    .join('');
};
/**
 * Generates "ready for use" styles for a given HTML
 * @see {@link getCriticalRules} for lower level API
 * @param html
 * @param def
 * @param filter
 */
export var getCriticalStyles = function (html, def, filter) {
  if (filter === void 0) {
    filter = createUsedFilter();
  }
  assertIsReady(def);
  return criticalRulesToStyle(
    __spreadArray(
      __spreadArray([], extractAllUnmatchable(def, filter), true),
      getRawCriticalRules(html, def, filter),
      true
    ),
    def.urlPrefix
  );
};
