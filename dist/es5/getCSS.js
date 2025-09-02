'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getCriticalStyles =
  exports.extractCriticalRules =
  exports.getCriticalRules =
  exports.criticalStylesToString =
  exports.extractAllUnmatchableAsString =
  exports.extractAllUnmatchable =
  exports.extractUnmatchableFromAst =
  exports.wrapInStyle =
  exports.getUsedStyles =
  exports.astToUsedStyles =
  exports.getUnusableStyles =
    void 0;
var tslib_1 = require('tslib');
var kashe_1 = require('kashe');
var fromAst_1 = require('./parser/fromAst');
var async_1 = require('./utils/async');
var cache_1 = require('./utils/cache');
var order_1 = require('./utils/order');
var string_1 = require('./utils/string');
exports.getUnusableStyles = (0, kashe_1.kashe)(function (def) {
  return Object.keys(def.ast || {})
    .filter(function (key) {
      return (0, fromAst_1.getUnmatchableRules)(def.ast[key]).length > 0;
    })
    .reduce(function (acc, file) {
      acc[file] = true;
      return acc;
    }, {});
});
exports.astToUsedStyles = (0, kashe_1.kashe)(function (styles, def) {
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
var getUsedStylesIn = (0, kashe_1.kashe)(function (styles, def) {
  (0, async_1.assertIsReady)(def);
  var usage = (0, exports.astToUsedStyles)(styles, def).usage;
  var flags = (0, tslib_1.__assign)(
    (0, tslib_1.__assign)({}, (0, exports.getUnusableStyles)(def)),
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
var getUsedStyles = function (htmlCode, def) {
  (0, async_1.assertIsReady)(def);
  return getUsedStylesIn((0, string_1.getStylesInText)(htmlCode), def);
};
exports.getUsedStyles = getUsedStyles;
var astToStyles = (0, kashe_1.kashe)(function (styles, def, filter) {
  var ast = def.ast;
  var _a = (0, exports.astToUsedStyles)(styles, def),
    fetches = _a.fetches,
    usage = _a.usage;
  if (filter && filter.introduceClasses) {
    filter.introduceClasses((0, string_1.flattenClasses)(styles));
  }
  return usage.map(function (file) {
    return {
      file: file,
      css: (0, fromAst_1.fromAst)(Object.keys(fetches[file]), ast[file], filter),
    };
  });
});
var wrapInStyle = function (styles, usedStyles) {
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
exports.wrapInStyle = wrapInStyle;
exports.extractUnmatchableFromAst = (0, kashe_1.kashe)(function (ast, filter) {
  return Object.keys(ast || {})
    .map(function (file) {
      var css = (0, fromAst_1.extractUnmatchable)(ast[file], filter);
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
var extractAllUnmatchable = function (def, filter) {
  return (0, exports.extractUnmatchableFromAst)(def.ast, filter);
};
exports.extractAllUnmatchable = extractAllUnmatchable;
exports.extractAllUnmatchableAsString = (0, kashe_1.kashe)(function (def) {
  return (0, exports.wrapInStyle)(
    (0, exports.extractAllUnmatchable)(def).reduce(function (acc, _a) {
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
  return (0, exports.wrapInStyle)(
    styles
      .map(function (_a) {
        var css = _a.css;
        return css;
      })
      .join(''),
    (0, order_1.unique)(
      styles.map(function (_a) {
        var file = _a.file;
        return '' + urlPrefix + file;
      })
    )
  );
};
var criticalStylesToString = function (html, def, filter) {
  (0, async_1.assertIsReady)(def);
  return criticalRulesToStyle(astToStyles((0, string_1.getStylesInText)(html), def, filter), def.urlPrefix);
};
exports.criticalStylesToString = criticalStylesToString;
var getRawCriticalRules = function (html, def, filter) {
  (0, async_1.assertIsReady)(def);
  return astToStyles((0, string_1.getStylesInText)(html), def, filter);
};
/**
 * returns critical rules(selector) used in a given HTML code, including unmatchable rules, which can be used indirectly
 * for example `:root`.
 * @see {@link extractCriticalRules} for chunk-based operations
 */
var getCriticalRules = function (html, def, filter) {
  if (filter === void 0) {
    filter = (0, cache_1.createUsedFilter)();
  }
  (0, async_1.assertIsReady)(def);
  return (0, tslib_1.__spreadArray)(
    (0, tslib_1.__spreadArray)([], (0, exports.extractAllUnmatchable)(def, filter), true),
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
exports.getCriticalRules = getCriticalRules;
/**
 * returns critical rules explicitly used in a given HTML code
 * @see {@link getCriticalRules} for more complete solution, including unmatchable rules as well
 */
var extractCriticalRules = function (html, def, filter) {
  if (filter === void 0) {
    filter = (0, cache_1.createUsedFilter)();
  }
  (0, async_1.assertIsReady)(def);
  return getRawCriticalRules(html, def, filter)
    .map(function (_a) {
      var css = _a.css,
        file = _a.file;
      return '\n/* ' + file + ' */\n' + css;
    })
    .join('');
};
exports.extractCriticalRules = extractCriticalRules;
/**
 * Generates "ready for use" styles for a given HTML
 * @see {@link getCriticalRules} for lower level API
 * @param html
 * @param def
 * @param filter
 */
var getCriticalStyles = function (html, def, filter) {
  if (filter === void 0) {
    filter = (0, cache_1.createUsedFilter)();
  }
  (0, async_1.assertIsReady)(def);
  return criticalRulesToStyle(
    (0, tslib_1.__spreadArray)(
      (0, tslib_1.__spreadArray)([], (0, exports.extractAllUnmatchable)(def, filter), true),
      getRawCriticalRules(html, def, filter),
      true
    ),
    def.urlPrefix
  );
};
exports.getCriticalStyles = getCriticalStyles;
