import { StyleDefinition } from './types';

export interface AlterOptions {
  /**
   * filters available styles sources/files
   * @param fileName
   */
  filter?(fileName: string): boolean;
  /**
   * filters available rule
   * @param styleName
   */
  pruneSelector?(selector: string): boolean;
}
/**
 * generates an altered subset of styles
 * @param def style definitions
 * @param options a filter function
 * @example
 * ```ts
 * const newStyles = alterProjectStyles(styles, { filter: (fileName) => fileName.indexOf('keep-only-this-file.css') !== 0 })
 * ```
 */
export declare const alterProjectStyles: (def: StyleDefinition, options: AlterOptions) => StyleDefinition;
