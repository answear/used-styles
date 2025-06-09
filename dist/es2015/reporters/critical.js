import { Transform } from 'stream';
import { isReact } from '../config';
import { criticalStylesToString, extractAllUnmatchableAsString } from '../getCSS';
import { assertIsReady } from '../utils/async';
import { createLine, createUsedFilter } from '../utils/cache';
import { findLastBrace } from '../utils/string';
export var process = function (chunk, line, callback) {
  return isReact() ? processReact(chunk, line, callback) : processPlain(chunk, line, callback);
};
export var processPlain = function (chunk, line, callback) {
  var data = line.tail + chunk;
  var lastBrace = findLastBrace(data);
  var usedString = data.substring(0, lastBrace);
  callback(usedString);
  line.tail = data.substring(lastBrace);
  return usedString;
};
// tslint:disable-next-line:variable-name
export var processReact = function (chunk, _line, callback) {
  callback(chunk);
  return chunk;
};
function getClosingTag(tag) {
  return '</' + tag + '>';
}
var PURE_TAGS = ['style', 'script', 'select'];
var PURE_TAG_PATTERN = new RegExp(
  // matches opening tag of any of the pure tags without a corresponding closing tag.
  // parsing with regex should be good enough, or should we use a proper parser?
  PURE_TAGS.map(function (tag) {
    return '<(' + tag + ')\\b[^>]*>(?:(?!</' + tag + '>)[\\s\\S])*$';
  }).join('|'),
  'i'
);
export var createCriticalStyleStream = function (def) {
  var line = createLine();
  var injections = [];
  var contentBuffer = [];
  var bufferUntil = null;
  var flushContentBuffer = false;
  var filter = createUsedFilter();
  var styleCallback = function (content) {
    var style = criticalStylesToString(content, def, filter);
    style && injections.push(style);
  };
  var tick = 0;
  return new Transform({
    // transform() is called with each chunk of data
    // tslint:disable-next-line:variable-name
    transform: function (chunk, _, _callback) {
      assertIsReady(def);
      injections = [];
      flushContentBuffer = false;
      if (tick === 0) {
        var staticStyles = extractAllUnmatchableAsString(def);
        staticStyles && injections.push(staticStyles);
      }
      tick++;
      var chunkData = process(chunk.toString('utf-8'), line, styleCallback);
      var injectionsBlock = injections.join('');
      if (bufferUntil) {
        var closingTagIndex = chunkData.indexOf(bufferUntil);
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
      var hasOpenedPureTagMatch = chunkData.match(PURE_TAG_PATTERN);
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
      var contentBeforePureTag = chunkData.substring(0, hasOpenedPureTagMatch.index);
      var contentAfterPureTag = chunkData.substring(hasOpenedPureTagMatch.index);
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
    flush: function (flushCallback) {
      flushCallback(undefined, line.tail);
    },
  });
};
