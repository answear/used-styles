import { readFile } from 'fs/promises';
import { extname, join, relative } from 'path';
// @ts-ignore
import scanDirectory from 'scan-directory';
import { loadStyleDefinitions } from './style-operations';
const RESOLVE_EXTENSIONS = ['.css'];
const getFileContent = (file) => readFile(file, 'utf8');
const passAll = () => true;
/**
 * auto discovers style files in a given dir applying a given "ordering" filter
 * @see Use {@link loadStyleDefinitions} as a full customizable variant
 * @param rootDir - location of the build artefact
 * @param fileFilter - filter and ordering, return false to skip the file, return true or null to not change file order, sort index otherwise
 */
export function discoverProjectStyles(rootDir, fileFilter = passAll) {
  return loadStyleDefinitions(
    async () =>
      (await scanDirectory(rootDir, undefined, () => false))
        .filter((name) => RESOLVE_EXTENSIONS.indexOf(extname(name)) >= 0)
        .map((file) => relative(rootDir, file))
        .sort(),
    (fileName) => getFileContent(join(rootDir, fileName)),
    fileFilter
  );
}
