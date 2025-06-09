export const createLine = () => ({
  tail: '',
});
export const createUsedFilter = () => {
  const usedSelectors = new Set();
  const knownClasses = new Set();
  const filter = (_, rule) => {
    // if rule is already seen - skip
    if (usedSelectors.has(rule.hash)) {
      return false;
    }
    // if one of the parents of this rule has not been introduced yed - skip
    const parents = rule.parents;
    if (parents) {
      if (!parents.every((parent) => knownClasses.has(parent))) {
        return false;
      }
    }
    usedSelectors.add(rule.hash);
    return true;
  };
  filter.introduceClasses = (classes) => classes.forEach((cl) => knownClasses.add(cl));
  return filter;
};
