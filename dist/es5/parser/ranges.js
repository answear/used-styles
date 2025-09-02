'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.createRange =
  exports.localRangeMax =
  exports.localRangeMin =
  exports.rangesIntervalEqual =
  exports.rangesEqual =
    void 0;
var rangesEqual = function (a, b) {
  // a.file === b.file &&
  return a.line === b.line && a.column === b.column;
};
exports.rangesEqual = rangesEqual;
var rangesIntervalEqual = function (a, b) {
  return (0, exports.rangesEqual)(a.start, b.start) && (0, exports.rangesEqual)(a.end, b.end);
};
exports.rangesIntervalEqual = rangesIntervalEqual;
var localRangeMin = function (v, max) {
  if (v.line < max.line) {
    return {
      line: v.line,
      column: v.column,
    };
  }
  if (v.line === max.line) {
    return {
      // file: v.file,
      line: v.line,
      column: Math.min(v.column, max.column),
    };
  }
  return {
    line: max.line,
    column: max.column,
  };
};
exports.localRangeMin = localRangeMin;
var localRangeMax = function (v, min) {
  if (v.line > min.line) {
    return v;
  }
  if (v.line === min.line) {
    return {
      // file: v.file,
      line: v.line,
      column: Math.max(v.column, min.column),
    };
  }
  return {
    line: min.line,
    column: min.column,
  };
};
exports.localRangeMax = localRangeMax;
var createRange = function (line, column) {
  return {
    line: line,
    column: column,
  };
};
exports.createRange = createRange;
