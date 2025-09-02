export const pruneSelector = (ast, filter) => ({
  ...ast,
  selectors: ast.selectors.filter((selector) => !filter(selector.selector)),
});
