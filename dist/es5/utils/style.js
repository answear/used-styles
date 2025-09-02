'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.remapStyles = void 0;
var utils_1 = require('../parser/utils');
var remapStyles = function (data, result) {
  return Object.keys(data)
    .map(function (file) {
      return { file: file, styles: (0, utils_1.mapStyles)(data[file]) };
    })
    .forEach(function (_a) {
      var file = _a.file,
        styles = _a.styles;
      return styles.forEach(function (className) {
        if (!result[className]) {
          result[className] = {};
        }
        result[className][file] = true;
      });
    });
};
exports.remapStyles = remapStyles;
