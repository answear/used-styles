'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var string_1 = require('../string');
test('extract classes from html', function () {
  expect((0, string_1.getStylesInReactText)('<div />')).toEqual([]);
  expect((0, string_1.getStylesInReactText)('<div class="a"/>')).toEqual(['a']);
  expect((0, string_1.getStylesInReactText)('<div class="a b"/>')).toEqual(['a b']);
});
