// @ts-ignore
import * as crc32 from 'crc-32';
import * as postcss from 'postcss';
import { AtRule, Rule } from 'postcss';

import { AtRules, SingleStyleAst, StyleBodies, StyleBody, StyleSelector } from './ast';
import { createRange, localRangeMax, localRangeMin, rangesIntervalEqual } from './ranges';
import { extractParents, mapSelector } from './utils';

const getAtRule = (rule: AtRule | Rule): string[] => {
  const parent = rule.parent as AtRule;

  if (parent && parent.name === 'media') {
    return getAtRule(parent as any).concat(parent.params);
  }

  return [];
};

const getBreak = (rule: string) => {
  const breakPoints = [
    rule.indexOf(' '),
    rule.indexOf('>'),
    rule.indexOf('~'),
    rule.indexOf('+'),
    rule.indexOf(':'),
  ].filter((index) => index > 0);

  if (breakPoints.length === 0) {
    return rule.length;
  }

  const min = Math.min(...breakPoints);

  return min ? min : rule.length;
};

const getPostfix = (rule: string) => {
  return rule.substr(getBreak(rule)).trim();
};

let bodyCounter = 1;

const assignBody = (decl: StyleBody, bodies: StyleBodies): StyleBody => {
  const d = Object.values(bodies).find((bodyDecl) => rangesIntervalEqual(bodyDecl, decl));

  if (d) {
    return d;
  }

  decl.id = bodyCounter++;
  bodies[decl.id] = decl;

  return decl;
};

const hashString = (str: string | undefined): string => {
  if (str === undefined) {
    return '';
  }

  return crc32.str(str).toString(32);
};

const hashBody = (body: StyleBody) => {
  return hashString(JSON.stringify(body.rules));
};

export const buildAst = (CSS: string, file = ''): SingleStyleAst => {
  const root = postcss.parse(CSS);
  const selectors: StyleSelector[] = [];
  const atRules: AtRules = [];

  const bodies: StyleBodies = {};

  const atParents = new Set<any>();

  root.walkAtRules((rule) => {
    if (rule.name === 'charset') {
      return;
    }

    if (rule.name !== 'media') {
      atParents.add(rule);

      atRules /*[rule.params]*/
        .push({
          kind: rule.name,
          id: rule.params,
          css: rule.toString(),
        });
    }
  });

  root.walkRules((rule) => {
    if (atParents.has(rule.parent)) {
      return;
    }

    const ruleSelectors = rule.selector.split(',');

    ruleSelectors
      .map((sel) => sel.trim())
      .forEach((selector) => {
        const stand: StyleSelector = {
          media: getAtRule(rule),
          selector,
          pieces: mapSelector(selector),
          postfix: getPostfix(selector),
          declaration: 0,
          hash: selector,
        };
        const parents = extractParents(selector);

        if (parents.length > 0) {
          stand.parents = parents;
        }

        const delc: StyleBody = {
          id: NaN,
          rules: [],
          start: createRange(Infinity, Infinity),
          end: createRange(0, 0),
        };

        rule.walkDecls(({ prop, value, source, important }) => {
          if (source) {
            delc.start = localRangeMin(delc.start, source.start!);
            delc.end = localRangeMax(delc.end, source.end!);

            delc.rules.push({
              prop,
              value,
              important,
            });
          }
        });

        stand.declaration = assignBody(delc, bodies).id;
        stand.hash = `${selector}${hashBody(delc)}${hashString(stand.postfix)}${hashString(stand.media.join())}`;

        selectors.push(stand);
      });
  });

  return {
    file,
    selectors,
    bodies,
    atRules,
  };
};
