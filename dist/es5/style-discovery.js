'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.discoverProjectStyles = void 0;
var tslib_1 = require('tslib');
var promises_1 = require('fs/promises');
var path_1 = require('path');
// @ts-ignore
var scan_directory_1 = (0, tslib_1.__importDefault)(require('scan-directory'));
var style_operations_1 = require('./style-operations');
var RESOLVE_EXTENSIONS = ['.css'];
var getFileContent = function (file) {
  return (0, promises_1.readFile)(file, 'utf8');
};
var passAll = function () {
  return true;
};
/**
 * auto discovers style files in a given dir applying a given "ordering" filter
 * @see Use {@link loadStyleDefinitions} as a full customizable variant
 * @param rootDir - location of the build artefact
 * @param fileFilter - filter and ordering, return false to skip the file, return true or null to not change file order, sort index otherwise
 */
function discoverProjectStyles(rootDir, fileFilter) {
  var _this = this;
  if (fileFilter === void 0) {
    fileFilter = passAll;
  }
  return (0, style_operations_1.loadStyleDefinitions)(
    function () {
      return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
        return (0, tslib_1.__generator)(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [
                4 /*yield*/,
                (0, scan_directory_1.default)(rootDir, undefined, function () {
                  return false;
                }),
              ];
            case 1:
              return [
                2 /*return*/,
                _a
                  .sent()
                  .filter(function (name) {
                    return RESOLVE_EXTENSIONS.indexOf((0, path_1.extname)(name)) >= 0;
                  })
                  .map(function (file) {
                    return (0, path_1.relative)(rootDir, file);
                  })
                  .sort(),
              ];
          }
        });
      });
    },
    function (fileName) {
      return getFileContent((0, path_1.join)(rootDir, fileName));
    },
    fileFilter
  );
}
exports.discoverProjectStyles = discoverProjectStyles;
