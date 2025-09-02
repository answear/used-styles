import { buildAst } from './parser/toAst';
import { flattenOrder } from './utils/order';
const toFlattenArray = (ast) =>
  Object.keys(ast).reduce((acc, file) => {
    ast[file].selectors.forEach((sel) => {
      sel.pieces.forEach((className) => {
        if (!acc[className]) {
          acc[className] = [];
        }
        acc[className].push(file);
      });
    });
    return acc;
  }, {});
const astFromFiles = (fileDate) =>
  Object.keys(fileDate).reduce((acc, file) => {
    acc[file] = buildAst(fileDate[file], file);
    return acc;
  }, {});
/**
 * (synchronously) creates style definition from a given set of style data
 * @param data a data in form of {fileName: fileContent}
 */
export function parseProjectStyles(data) {
  const ast = astFromFiles(data);
  return {
    isReady: true,
    lookup: toFlattenArray(ast),
    ast,
  };
}
const passAll = () => true;
const createAwaitableResult = () => {
  let resolve;
  let reject;
  const awaiter = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  const result = {
    isReady: false,
    then(res, rej) {
      return awaiter.then(res, rej);
    },
  };
  return {
    result,
    resolve,
    reject,
  };
};
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
export function loadStyleDefinitions(getStyleNames, loader, fileFilter = passAll) {
  const { resolve, reject, result } = createAwaitableResult();
  async function scanner() {
    const files = (await getStyleNames())
      .map((file) => ({
        file,
        order: flattenOrder(fileFilter(file)),
      }))
      .filter(({ order }) => !Number.isNaN(order))
      .sort((a, b) => a.order - b.order)
      .map(({ file }) => file);
    const styleFiles = {};
    // prefill the obiect to pin keys ordering
    files.map((file) => (styleFiles[file] = undefined));
    await Promise.all(
      files.map(async (file) => {
        styleFiles[file] = await loader(file);
      })
    );
    return parseProjectStyles(styleFiles);
  }
  scanner().then(
    (styles) => {
      Object.assign(result, styles);
      resolve();
    },
    (e) => {
      reject(e);
      // tslint:disable-next-line:no-console
      console.error(e);
      throw new Error('used-styles failed to start');
    }
  );
  return result;
}
