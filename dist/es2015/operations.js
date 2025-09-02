import { __assign } from 'tslib';
import { pruneSelector } from './operations/prune-selector';
import { assertIsReady } from './utils/async';
/**
 * generates an altered subset of styles
 * @param def style definitions
 * @param options a filter function
 * @example
 * ```ts
 * const newStyles = alterProjectStyles(styles, { filter: (fileName) => fileName.indexOf('keep-only-this-file.css') !== 0 })
 * ```
 */
export var alterProjectStyles = function (def, options) {
  assertIsReady(def);
  return __assign(__assign({}, def), {
    ast: Object.keys(def.ast).reduce(function (acc, file) {
      var astFile = def.ast[file];
      var shouldRemove = options.filter && !options.filter(file);
      // dont add this file to the result file list
      if (shouldRemove) {
        return acc;
      }
      acc[file] = options.pruneSelector ? pruneSelector(astFile, options.pruneSelector) : astFile;
      return acc;
    }, {}),
  });
};
