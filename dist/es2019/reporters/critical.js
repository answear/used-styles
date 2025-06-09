import { Transform } from 'stream';
import { isReact } from '../config';
import { criticalStylesToString, extractAllUnmatchableAsString } from '../getCSS';
import { assertIsReady } from '../utils/async';
import { createLine, createUsedFilter } from '../utils/cache';
import { findLastBrace } from '../utils/string';
export const process = (chunk, line, callback) =>
  isReact() ? processReact(chunk, line, callback) : processPlain(chunk, line, callback);
export const processPlain = (chunk, line, callback) => {
  const data = line.tail + chunk;
  const lastBrace = findLastBrace(data);
  const usedString = data.substring(0, lastBrace);
  callback(usedString);
  line.tail = data.substring(lastBrace);
  return usedString;
};
// tslint:disable-next-line:variable-name
export const processReact = (chunk, _line, callback) => {
  callback(chunk);
  return chunk;
};
function getClosingTag(tag) {
  return `</${tag}>`;
}
const PURE_TAGS = ['style', 'script', 'select'];
const PURE_TAG_PATTERN = new RegExp(
  // matches opening tag of any of the pure tags without a corresponding closing tag.
  // parsing with regex should be good enough, or should we use a proper parser?
  PURE_TAGS.map((tag) => `<(${tag})\\b[^>]*>(?:(?!</${tag}>)[\\s\\S])*$`).join('|'),
  'i'
);
export const createCriticalStyleStream = (def) => {
  const line = createLine();
  let injections = [];
  const contentBuffer = [];
  let bufferUntil = null;
  let flushContentBuffer = false;
  const filter = createUsedFilter();
  const styleCallback = (content) => {
    const style = criticalStylesToString(content, def, filter);
    style && injections.push(style);
  };
  let tick = 0;
  return new Transform({
    // transform() is called with each chunk of data
    // tslint:disable-next-line:variable-name
    transform(chunk, _, _callback) {
      assertIsReady(def);
      injections = [];
      flushContentBuffer = false;
      if (tick === 0) {
        const staticStyles = extractAllUnmatchableAsString(def);
        staticStyles && injections.push(staticStyles);
      }
      tick++;
      const chunkData = process(chunk.toString('utf-8'), line, styleCallback);
      const injectionsBlock = injections.join('');
      if (bufferUntil) {
        const closingTagIndex = chunkData.indexOf(bufferUntil);
        if (closingTagIndex !== -1) {
          // tag was closed, we can flush the buffer
          flushContentBuffer = true;
          bufferUntil = null;
        } else {
          // tag was still not closed yet, buffer the whole chunk.
          contentBuffer.push(chunkData);
          _callback(undefined, '');
          return;
        }
      }
      // protection from chunks with elements that can't contain styles
      const hasOpenedPureTagMatch = chunkData.match(PURE_TAG_PATTERN);
      if (!hasOpenedPureTagMatch) {
        if (flushContentBuffer) {
          // inject into the beginning of the chunk and flush buffered content
          _callback(undefined, injectionsBlock + contentBuffer.join('') + chunkData);
          contentBuffer.length = 0;
        } else {
          // inject into the beginning of the chunk
          _callback(undefined, injectionsBlock + chunkData);
        }
        return;
      }
      // we ended the chunk in the middle of a pure tag.
      // we need to wait with further injections until the this tag is closed.
      const contentBeforePureTag = chunkData.substring(0, hasOpenedPureTagMatch.index);
      const contentAfterPureTag = chunkData.substring(hasOpenedPureTagMatch.index);
      if (flushContentBuffer) {
        // inject into the beginning of the chunk and flush buffered content
        _callback(undefined, injectionsBlock + contentBuffer.join('') + contentBeforePureTag);
        contentBuffer.length = 0;
      } else {
        // inject into the beginning of the chunk
        _callback(undefined, injectionsBlock + contentBeforePureTag);
      }
      contentBuffer.push(contentAfterPureTag);
      bufferUntil = getClosingTag(hasOpenedPureTagMatch[1] || hasOpenedPureTagMatch[2] || hasOpenedPureTagMatch[3]);
    },
    flush(flushCallback) {
      flushCallback(undefined, line.tail);
    },
  });
};
