/**
 * @fileOverview inspired by https://github.com/perry-mitchell/css-selector-splitter/tree/master
 */
var BLOCKS = {
  '(': ')',
  '[': ']',
};
var QUOTES = {
  '"': '"',
  "'": "'",
};
var FINALIZERS = {
  ')': '(',
  ']': '[',
};
var SPLIT_ON = {
  ',': ',',
};
export var splitSelector = function (selector) {
  var selectors = [];
  var stack = [];
  var joiners = [];
  var currentSelector = '';
  for (var i = 0; i < selector.length; i += 1) {
    var char = selector[i];
    if (BLOCKS[char] || QUOTES[char]) {
      if (stack.length === 0) {
        stack.push(char);
      } else {
        var lastBrace = stack[stack.length - 1];
        if (QUOTES[lastBrace]) {
          // within quotes
          if (char === lastBrace) {
            // closing quote
            stack.pop();
          }
        } else {
          // inside brackets or square brackets
          stack.push(char);
        }
      }
      currentSelector += char;
    } else if (FINALIZERS.hasOwnProperty(char)) {
      var lastBrace = stack[stack.length - 1];
      var matchingOpener = FINALIZERS[char];
      if (lastBrace === matchingOpener) {
        stack.pop();
      }
      currentSelector += char;
    } else if (SPLIT_ON[char]) {
      if (!stack.length) {
        // we're not inside another block, so we can split using the comma/splitter
        var lastJoiner = joiners[joiners.length - 1];
        if (lastJoiner === ' ' && currentSelector.length <= 0) {
          // we just split by a space, but there seems to be another split character, so use
          // this new one instead of the previous space
          joiners[joiners.length - 1] = char;
        } else if (currentSelector.length <= 0) {
          // skip this character, as it's just padding
        } else {
          // split by this character
          var newLength = selectors.push(currentSelector);
          joiners[newLength - 1] = char;
          currentSelector = '';
        }
      } else {
        // we're inside another block, so ignore the comma/splitter
        currentSelector += char;
      }
    } else {
      // just add this character
      currentSelector += char;
    }
  }
  selectors.push(currentSelector);
  return selectors
    .map(function (selector) {
      return selector.trim();
    })
    .filter(function (cssSelector) {
      return cssSelector.length > 0;
    });
};
