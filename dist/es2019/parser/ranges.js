export const rangesEqual = (a, b) =>
  // a.file === b.file &&
  a.line === b.line && a.column === b.column;
export const rangesIntervalEqual = (a, b) => rangesEqual(a.start, b.start) && rangesEqual(a.end, b.end);
export const localRangeMin = (v, max) => {
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
export const localRangeMax = (v, min) => {
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
export const createRange = (line, column) => ({
  line,
  column,
});
