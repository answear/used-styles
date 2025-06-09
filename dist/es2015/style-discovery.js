import { __awaiter, __generator } from 'tslib';
import { readFile } from 'fs/promises';
import { extname, join, relative } from 'path';
// @ts-ignore
import scanDirectory from 'scan-directory';
import { loadStyleDefinitions } from './style-operations';
var RESOLVE_EXTENSIONS = ['.css'];
var getFileContent = function (file) {
  return readFile(file, 'utf8');
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
export function discoverProjectStyles(rootDir, fileFilter) {
  var _this = this;
  if (fileFilter === void 0) {
    fileFilter = passAll;
  }
  return loadStyleDefinitions(
    function () {
      return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [
                4 /*yield*/,
                scanDirectory(rootDir, undefined, function () {
                  return false;
                }),
              ];
            case 1:
              return [
                2 /*return*/,
                _a
                  .sent()
                  .filter(function (name) {
                    return RESOLVE_EXTENSIONS.indexOf(extname(name)) >= 0;
                  })
                  .map(function (file) {
                    return relative(rootDir, file);
                  })
                  .sort(),
              ];
          }
        });
      });
    },
    function (fileName) {
      return getFileContent(join(rootDir, fileName));
    },
    fileFilter
  );
}
