import { StyleDefinition, StyleFiles, SyncStyleDefinition } from './types';

/**
 * (synchronously) creates style definition from a given set of style data
 * @param data a data in form of {fileName: fileContent}
 */
export declare function parseProjectStyles(data: Readonly<StyleFiles>): SyncStyleDefinition;
export interface FlattenFileOrder {
  file: string;
  order: number;
}
/**
 * Loads a given set of styles. This function is useful for custom scenarios and dev mode, where no files are emitted on disk
 * @see {@link discoverProjectStyles} to automatically load styles from the build folder
 * @param getStyleNames - a style name generator
 * @param loader - a data loader
 * @param fileFilter - filter and order corrector
 * @example
 * ```ts
 * loadStyleDefinitions(
 *  async () => ['style1.css'],
 *  (styleName) => fetch(CDN+styleName),
 * )
 * ```
 */
export declare function loadStyleDefinitions(
  getStyleNames: () => string[] | Promise<string[]>,
  loader: (style: string) => string | Promise<string>,
  fileFilter?: (fileName: string) => boolean | number | null
): StyleDefinition;
