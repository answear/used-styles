import { StyleAst } from './parser/ast';
import {
  AbstractStyleDefinition,
  FlagType,
  SelectionFilter,
  StyleChunk,
  StyleDefinition,
  SyncStyleDefinition,
  UsedTypes,
  UsedTypesRef,
} from './types';

export declare const getUnusableStyles: (
  x: Readonly<{
    isReady: boolean;
    lookup: Readonly<import('./types').StylesLookupTable>;
    ast: Readonly<StyleAst>;
    urlPrefix: string;
    then(resolve?: (() => void) | undefined, reject?: (() => void) | undefined): Promise<void>;
  }>
) => UsedTypesRef;
export declare const astToUsedStyles: (
  x: string[],
  def: AbstractStyleDefinition
) => {
  fetches: Record<string, FlagType>;
  usage: string[];
};
/**
 * returns names of the style files for a given HTML and style definitions
 */
export declare const getUsedStyles: (htmlCode: string, def: StyleDefinition) => UsedTypes;
export declare const wrapInStyle: (styles: string, usedStyles?: string[]) => string;
export declare const extractUnmatchableFromAst: (x: StyleAst, filter?: SelectionFilter | undefined) => StyleChunk[];
export declare const extractAllUnmatchable: (
  def: Pick<StyleDefinition, 'ast'>,
  filter?: SelectionFilter | undefined
) => StyleChunk[];
export declare const extractAllUnmatchableAsString: (
  x: Readonly<{
    isReady: boolean;
    lookup: Readonly<import('./types').StylesLookupTable>;
    ast: Readonly<StyleAst>;
    urlPrefix: string;
    then(resolve?: (() => void) | undefined, reject?: (() => void) | undefined): Promise<void>;
  }>
) => string;
export declare const criticalStylesToString: (
  html: string,
  def: StyleDefinition,
  filter?: SelectionFilter | undefined
) => string;
/**
 * returns critical rules(selector) used in a given HTML code, including unmatchable rules, which can be used indirectly
 * for example `:root`.
 * @see {@link extractCriticalRules} for chunk-based operations
 */
export declare const getCriticalRules: (
  html: string,
  def: StyleDefinition | SyncStyleDefinition,
  filter?: SelectionFilter
) => string;
/**
 * returns critical rules explicitly used in a given HTML code
 * @see {@link getCriticalRules} for more complete solution, including unmatchable rules as well
 */
export declare const extractCriticalRules: (html: string, def: StyleDefinition, filter?: SelectionFilter) => string;
/**
 * Generates "ready for use" styles for a given HTML
 * @see {@link getCriticalRules} for lower level API
 * @param html
 * @param def
 * @param filter
 */
export declare const getCriticalStyles: (html: string, def: StyleDefinition, filter?: SelectionFilter) => string;
