/**
 * moves dynamically injected styles outside of rendered content to the document head to avoid hydration mismatch
 * @see {@link removeStyles} as a followup when all required styles are loaded as files
 */
export var moveStyles = function () {
  var _a;
  if (typeof document === 'undefined' || !document.body || !document.head) {
    return;
  }
  // move all injects style tags to the <head/>
  var linkTags = document.querySelectorAll('[data-used-styles]');
  var root = document.head.firstChild;
  // remove in two steps to prevent flickering
  for (var i = 0; i < linkTags.length; ++i) {
    document.head.insertBefore(linkTags[i].cloneNode(true), root);
  }
  for (var i = 0; i < linkTags.length; ++i) {
    (_a = linkTags[i].parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(linkTags[i]);
  }
};
/**
 * removes dynamically injected styles to avoid hydration mismatch
 * @see {@link moveStyles} to only move styles and avoid "flash of unstyled content"
 */
export var removeStyles = function () {
  var _a;
  if (typeof document === 'undefined' || !document.body || !document.head) {
    return;
  }
  // move all injects style tags to the <head/>
  var linkTags = document.querySelectorAll('[data-used-styles]');
  for (var i = 0; i < linkTags.length; ++i) {
    (_a = linkTags[i].parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(linkTags[i]);
  }
};
