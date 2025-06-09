import { Transform } from 'stream';
import { isReact } from '../config';
import { getUsedStyles } from '../getCSS';
import { assertIsReady } from '../utils/async';
import { createLine } from '../utils/cache';
import { findLastBrace } from '../utils/string';
export var process = function (chunk, line, def, callback) {
  return isReact() ? processReact(chunk, line, def, callback) : processPlain(chunk, line, def, callback);
};
export var processPlain = function (chunk, line, def, callback) {
  var data = line.tail + chunk;
  var lastBrace = findLastBrace(data);
  var usedString = data.substring(0, lastBrace);
  callback(getUsedStyles(usedString, def));
  line.tail = data.substring(lastBrace);
  return usedString;
};
export var processReact = function (
  chunk,
  // tslint:disable-next-line:variable-name
  _line,
  def,
  callback
) {
  callback(getUsedStyles(chunk, def));
  return chunk;
};
export var createStyleStream = function (def, callback) {
  var line = createLine();
  var styles = {};
  var injections = [];
  var cb = function (newStyles) {
    newStyles.forEach(function (style) {
      if (!styles[style]) {
        styles[style] = true;
        var result = callback(style);
        if (result) {
          injections.push(result);
        }
      }
    });
  };
  return new Transform({
    // transform() is called with each chunk of data
    // tslint:disable-next-line:variable-name
    transform: function (chunk, _, _callback) {
      assertIsReady(def);
      injections = [];
      var chunkData = Buffer.from(process(chunk.toString('utf-8'), line, def, cb), 'utf-8');
      _callback(undefined, injections.filter(Boolean).join('\n') + chunkData);
    },
    flush: function (flushCallback) {
      flushCallback(undefined, line.tail);
    },
  });
};
