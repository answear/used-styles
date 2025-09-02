'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.loadStyleDefinitions = exports.parseProjectStyles = void 0;
var tslib_1 = require('tslib');
var toAst_1 = require('./parser/toAst');
var order_1 = require('./utils/order');
var toFlattenArray = function (ast) {
  return Object.keys(ast).reduce(function (acc, file) {
    ast[file].selectors.forEach(function (sel) {
      sel.pieces.forEach(function (className) {
        if (!acc[className]) {
          acc[className] = [];
        }
        acc[className].push(file);
      });
    });
    return acc;
  }, {});
};
var astFromFiles = function (fileDate) {
  return Object.keys(fileDate).reduce(function (acc, file) {
    acc[file] = (0, toAst_1.buildAst)(fileDate[file], file);
    return acc;
  }, {});
};
/**
 * (synchronously) creates style definition from a given set of style data
 * @param data a data in form of {fileName: fileContent}
 */
function parseProjectStyles(data) {
  var ast = astFromFiles(data);
  return {
    isReady: true,
    lookup: toFlattenArray(ast),
    ast: ast,
  };
}
exports.parseProjectStyles = parseProjectStyles;
var passAll = function () {
  return true;
};
var createAwaitableResult = function () {
  var resolve;
  var reject;
  var awaiter = new Promise(function (res, rej) {
    resolve = res;
    reject = rej;
  });
  var result = {
    isReady: false,
    then: function (res, rej) {
      return awaiter.then(res, rej);
    },
  };
  return {
    result: result,
    resolve: resolve,
    reject: reject,
  };
};
/**
 * Loads a given set of styles. This function is useful for custom scenarios and dev mode, where no files are emitted on disk
 * @see {@link discoverProjectStyles} to automatically load styles from the build folder
 * @param getStyleNames - a style name generator
 * @param loader - a data loader
 * @param fileFilter - filter and order corrector
 * @example
 * ```ts
 * loadStyleDefinitions(
 *  async () => ['style1.css'],
 *  (styleName) => fetch(CDN+styleName),
 * )
 * ```
 */
function loadStyleDefinitions(getStyleNames, loader, fileFilter) {
  if (fileFilter === void 0) {
    fileFilter = passAll;
  }
  var _a = createAwaitableResult(),
    resolve = _a.resolve,
    reject = _a.reject,
    result = _a.result;
  function scanner() {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
      var files, styleFiles;
      var _this = this;
      return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, getStyleNames()];
          case 1:
            files = _a
              .sent()
              .map(function (file) {
                return {
                  file: file,
                  order: (0, order_1.flattenOrder)(fileFilter(file)),
                };
              })
              .filter(function (_a) {
                var order = _a.order;
                return !Number.isNaN(order);
              })
              .sort(function (a, b) {
                return a.order - b.order;
              })
              .map(function (_a) {
                var file = _a.file;
                return file;
              });
            styleFiles = {};
            // prefill the obiect to pin keys ordering
            files.map(function (file) {
              return (styleFiles[file] = undefined);
            });
            return [
              4 /*yield*/,
              Promise.all(
                files.map(function (file) {
                  return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
                    var _a, _b;
                    return (0, tslib_1.__generator)(this, function (_c) {
                      switch (_c.label) {
                        case 0:
                          _a = styleFiles;
                          _b = file;
                          return [4 /*yield*/, loader(file)];
                        case 1:
                          _a[_b] = _c.sent();
                          return [2 /*return*/];
                      }
                    });
                  });
                })
              ),
            ];
          case 2:
            _a.sent();
            return [2 /*return*/, parseProjectStyles(styleFiles)];
        }
      });
    });
  }
  scanner().then(
    function (styles) {
      Object.assign(result, styles);
      resolve();
    },
    function (e) {
      reject(e);
      // tslint:disable-next-line:no-console
      console.error(e);
      throw new Error('used-styles failed to start');
    }
  );
  return result;
}
exports.loadStyleDefinitions = loadStyleDefinitions;
