'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var split_selectors_1 = require('../split-selectors');
describe('split selectors', function () {
  it('simple', function () {
    expect((0, split_selectors_1.splitSelector)('.a')).toEqual(['.a']);
    expect((0, split_selectors_1.splitSelector)('.a,.b')).toEqual(['.a', '.b']);
    expect((0, split_selectors_1.splitSelector)('.a:before,:after')).toEqual(['.a:before', ':after']);
  });
  it('complex', function () {
    expect((0, split_selectors_1.splitSelector)('a ~ span,b')).toEqual(['a ~ span', 'b']);
    expect((0, split_selectors_1.splitSelector)("a#item p[alt^='test'],.body.test")).toEqual([
      "a#item p[alt^='test']",
      '.body.test',
    ]);
  });
});
