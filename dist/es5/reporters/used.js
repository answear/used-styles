'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.createStyleStream = exports.processReact = exports.processPlain = exports.process = void 0;
var stream_1 = require('stream');
var config_1 = require('../config');
var getCSS_1 = require('../getCSS');
var async_1 = require('../utils/async');
var cache_1 = require('../utils/cache');
var string_1 = require('../utils/string');
var process = function (chunk, line, def, callback) {
  return (0, config_1.isReact)()
    ? (0, exports.processReact)(chunk, line, def, callback)
    : (0, exports.processPlain)(chunk, line, def, callback);
};
exports.process = process;
var processPlain = function (chunk, line, def, callback) {
  var data = line.tail + chunk;
  var lastBrace = (0, string_1.findLastBrace)(data);
  var usedString = data.substring(0, lastBrace);
  callback((0, getCSS_1.getUsedStyles)(usedString, def));
  line.tail = data.substring(lastBrace);
  return usedString;
};
exports.processPlain = processPlain;
var processReact = function (
  chunk,
  // tslint:disable-next-line:variable-name
  _line,
  def,
  callback
) {
  callback((0, getCSS_1.getUsedStyles)(chunk, def));
  return chunk;
};
exports.processReact = processReact;
var createStyleStream = function (def, callback) {
  var line = (0, cache_1.createLine)();
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
  return new stream_1.Transform({
    // transform() is called with each chunk of data
    // tslint:disable-next-line:variable-name
    transform: function (chunk, _, _callback) {
      (0, async_1.assertIsReady)(def);
      injections = [];
      var chunkData = Buffer.from((0, exports.process)(chunk.toString('utf-8'), line, def, cb), 'utf-8');
      _callback(undefined, injections.filter(Boolean).join('\n') + chunkData);
    },
    flush: function (flushCallback) {
      flushCallback(undefined, line.tail);
    },
  });
};
exports.createStyleStream = createStyleStream;
