import { Transform } from 'stream';
import { isReact } from '../config';
import { getUsedStyles } from '../getCSS';
import { assertIsReady } from '../utils/async';
import { createLine } from '../utils/cache';
import { findLastBrace } from '../utils/string';
export const process = (chunk, line, def, callback) =>
  isReact() ? processReact(chunk, line, def, callback) : processPlain(chunk, line, def, callback);
export const processPlain = (chunk, line, def, callback) => {
  const data = line.tail + chunk;
  const lastBrace = findLastBrace(data);
  const usedString = data.substring(0, lastBrace);
  callback(getUsedStyles(usedString, def));
  line.tail = data.substring(lastBrace);
  return usedString;
};
export const processReact = (
  chunk,
  // tslint:disable-next-line:variable-name
  _line,
  def,
  callback
) => {
  callback(getUsedStyles(chunk, def));
  return chunk;
};
export const createStyleStream = (def, callback) => {
  const line = createLine();
  const styles = {};
  let injections = [];
  const cb = (newStyles) => {
    newStyles.forEach((style) => {
      if (!styles[style]) {
        styles[style] = true;
        const result = callback(style);
        if (result) {
          injections.push(result);
        }
      }
    });
  };
  return new Transform({
    // transform() is called with each chunk of data
    // tslint:disable-next-line:variable-name
    transform(chunk, _, _callback) {
      assertIsReady(def);
      injections = [];
      const chunkData = Buffer.from(process(chunk.toString('utf-8'), line, def, cb), 'utf-8');
      _callback(undefined, injections.filter(Boolean).join('\n') + chunkData);
    },
    flush(flushCallback) {
      flushCallback(undefined, line.tail);
    },
  });
};
