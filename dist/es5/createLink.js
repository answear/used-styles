'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.createLink = void 0;
/**
 * creates a style sheet link
 * @param styleFile
 */
var createLink = function (styleFile) {
  return '<link href="' + styleFile + '" rel="stylesheet" data-used-styles="true">';
};
exports.createLink = createLink;
