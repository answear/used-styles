import { mapStyles } from '../parser/utils';
export const remapStyles = (data, result) =>
  Object.keys(data)
    .map((file) => ({ file, styles: mapStyles(data[file]) }))
    .forEach(({ file, styles }) =>
      styles.forEach((className) => {
        if (!result[className]) {
          result[className] = {};
        }
        result[className][file] = true;
      })
    );
