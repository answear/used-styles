import { StyleDefinition } from './types';

/**
 * auto discovers style files in a given dir applying a given "ordering" filter
 * @see Use {@link loadStyleDefinitions} as a full customizable variant
 * @param rootDir - location of the build artefact
 * @param fileFilter - filter and ordering, return false to skip the file, return true or null to not change file order, sort index otherwise
 */
export declare function discoverProjectStyles(
  rootDir: string,
  fileFilter?: (fileName: string) => boolean | number | null
): StyleDefinition;
