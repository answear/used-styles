import { mapStyles } from '../parser/utils';
export var remapStyles = function (data, result) {
  return Object.keys(data)
    .map(function (file) {
      return { file: file, styles: mapStyles(data[file]) };
    })
    .forEach(function (_a) {
      var file = _a.file,
        styles = _a.styles;
      return styles.forEach(function (className) {
        if (!result[className]) {
          result[className] = {};
        }
        result[className][file] = true;
      });
    });
};
