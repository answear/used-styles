export var flattenOrder = function (order) {
  if (typeof order === 'number' || typeof order === 'string') {
    return +order;
  }
  if (order === true) {
    return 0;
  }
  return Number.NaN;
};
export function unique(data) {
  return Array.from(new Set(data));
}
