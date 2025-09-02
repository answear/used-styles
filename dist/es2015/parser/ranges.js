export var rangesEqual = function (a, b) {
  // a.file === b.file &&
  return a.line === b.line && a.column === b.column;
};
export var rangesIntervalEqual = function (a, b) {
  return rangesEqual(a.start, b.start) && rangesEqual(a.end, b.end);
};
export var localRangeMin = function (v, max) {
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
export var localRangeMax = function (v, min) {
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
export var createRange = function (line, column) {
  return {
    line: line,
    column: column,
  };
};
