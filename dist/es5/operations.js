'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.alterProjectStyles = void 0;
var tslib_1 = require('tslib');
var prune_selector_1 = require('./operations/prune-selector');
var async_1 = require('./utils/async');
/**
 * generates an altered subset of styles
 * @param def style definitions
 * @param options a filter function
 * @example
 * ```ts
 * const newStyles = alterProjectStyles(styles, { filter: (fileName) => fileName.indexOf('keep-only-this-file.css') !== 0 })
 * ```
 */
var alterProjectStyles = function (def, options) {
  (0, async_1.assertIsReady)(def);
  return (0, tslib_1.__assign)((0, tslib_1.__assign)({}, def), {
    ast: Object.keys(def.ast).reduce(function (acc, file) {
      var astFile = def.ast[file];
      var shouldRemove = options.filter && !options.filter(file);
      // dont add this file to the result file list
      if (shouldRemove) {
        return acc;
      }
      acc[file] = options.pruneSelector ? (0, prune_selector_1.pruneSelector)(astFile, options.pruneSelector) : astFile;
      return acc;
    }, {}),
  });
};
exports.alterProjectStyles = alterProjectStyles;
