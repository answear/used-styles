/**
 * creates a style sheet link
 * @param styleFile
 */
export var createLink = function (styleFile) {
  return '<link href="' + styleFile + '" rel="stylesheet" data-used-styles="true">';
};
